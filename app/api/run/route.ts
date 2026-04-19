import { hasEnv } from "@/lib/env";
import {
  createCollector,
  createContext,
  generateRunId,
  persistRun,
} from "@/lib/pipeline/orchestrator";
import { runStructuredFundWatcher } from "@/lib/pipeline/step1a-structured";
import { runThesisExtractor } from "@/lib/pipeline/step2-thesisExtractor";
import { runCounterpartFinder } from "@/lib/pipeline/step3-counterpartFinder";
import { runTractionScorer } from "@/lib/pipeline/step4-tractionScorer";
import { runFounderScorer } from "@/lib/pipeline/step5-founderScorer";
import { runPortfolioBuilder } from "@/lib/pipeline/step6-portfolioBuilder";
import { runRequestSchema } from "@/lib/pipeline/config";
import { LIMITS } from "@/lib/pipeline/limits";
import {
  createSseHeaders,
  encodePipelineEvent,
  encodeSseFlushPadding,
} from "@/lib/pipeline/stream";
import { replayDemoRun } from "@/lib/pipeline/demoReplay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = (await request.json().catch(() => ({}))) ?? {};
  const parsed = runRequestSchema.safeParse(rawBody);

  const stream = new ReadableStream({
    async start(controller) {
      // Flush 2 KB of SSE comment padding before anything else so dev-server
      // and proxy buffering can't hide the first events.
      try {
        controller.enqueue(encodeSseFlushPadding());
      } catch {
        // already closed
      }

      const emit = (event: Parameters<typeof encodePipelineEvent>[0]) => {
        try {
          controller.enqueue(encodePipelineEvent(event));
        } catch {
          // controller may have closed; swallow.
        }
      };

      if (!parsed.success) {
        emit({
          type: "run.failed",
          payload: {
            message: parsed.error.issues[0]?.message ?? "Invalid run request.",
          },
        });
        controller.close();
        return;
      }

      const body = parsed.data;
      const selectedFunds = body.fundsToMirror.slice(0, LIMITS.fundsToMirror);
      const runId = generateRunId();

      emit({
        type: "run.started",
        payload: {
          runId,
          selectedFunds,
          fundSize: body.fundSize,
          targetPortfolioSize: body.targetPortfolioSize,
          demo: body.demo,
        },
      });

      if (body.demo) {
        try {
          await replayDemoRun(runId, emit);
        } catch (error) {
          emit({
            type: "run.failed",
            payload: {
              message: `Demo replay failed: ${error instanceof Error ? error.message : String(error)}`,
            },
          });
        }
        controller.close();
        return;
      }

      emit({
        type: "step.started",
        payload: {
          step: "bootstrap",
          message: "Run initialized. Validating environment and preparing pipeline.",
        },
      });

      emit({
        type: "run.checkpoint",
        payload: { limits: LIMITS, funds: selectedFunds },
      });

      if (!hasEnv("CRUSTDATA_API_KEY")) {
        emit({
          type: "run.blocked",
          payload: {
            reason:
              "CRUSTDATA_API_KEY is required to run the pipeline. Add it to .env.local and retry.",
          },
        });
        controller.close();
        return;
      }
      if (!hasEnv("OPENAI_API_KEY")) {
        emit({
          type: "run.blocked",
          payload: {
            reason:
              "OPENAI_API_KEY is required for thesis extraction (step 2) and downstream LLM steps.",
          },
        });
        controller.close();
        return;
      }

      const collector = createCollector(runId, {
        fundSize: body.fundSize,
        targetPortfolioSize: body.targetPortfolioSize,
        blockedGeos: body.blockedGeos,
        blockedSectors: body.blockedSectors,
        maxChequeSize: body.maxChequeSize,
        minStage: body.minStage,
        maxStage: body.maxStage,
        fundsToMirror: selectedFunds,
      });
      const ctx = createContext(collector, emit);

      emit({
        type: "step.completed",
        payload: {
          step: "bootstrap",
          itemCount: selectedFunds.length,
          message: `Bootstrap OK. ${selectedFunds.length} funds queued.`,
        },
      });

      try {
        // STEP 1A — only sourcing path. Looks back 6 months of funding rounds
        // for each selected fund and emits one MirroredDeal per company.
        emit({
          type: "step.started",
          payload: {
            step: "step1a",
            message: "Resolving investor names and searching the last 6 months of funded deals.",
          },
        });
        const step1a = await runStructuredFundWatcher(collector.config, ctx);

        // De-dupe by crustdataCompanyId in case the same company shows up in
        // more than one fund's results, then cap at the global mirrored-deal
        // limit so downstream steps stay within budget.
        const dealsById = new Map<number, typeof step1a.deals[number]>();
        for (const deal of step1a.deals) {
          if (!dealsById.has(deal.crustdataCompanyId)) {
            dealsById.set(deal.crustdataCompanyId, deal);
          }
        }
        const mirroredDeals = Array.from(dealsById.values())
          .sort((a, b) =>
            (b.fundingDate ?? "").localeCompare(a.fundingDate ?? ""),
          )
          .slice(0, LIMITS.totalMirroredDeals);

        collector.deals.push(...mirroredDeals);
        for (const deal of mirroredDeals) {
          ctx.emit({ type: "step1a.deal", payload: deal });
        }

        emit({
          type: "step.completed",
          payload: {
            step: "step1a",
            itemCount: mirroredDeals.length,
            message: `Step 1a returned ${mirroredDeals.length} mirrored deals (cap ${LIMITS.totalMirroredDeals}).`,
          },
        });

        if (mirroredDeals.length === 0) {
          ctx.emit({
            type: "step.skipped",
            payload: { step: "step2", reason: "No mirrored deals to extract a thesis from." },
          });
          await persistRun(collector);
          emit({
            type: "run.completed",
            payload: {
              runId,
              totalCredits: collector.totalCredits,
              message: "Run finished early: no mirrored deals from Step 1.",
            },
          });
          controller.close();
          return;
        }

        // STEP 2
        emit({
          type: "step.started",
          payload: {
            step: "step2",
            message: "Distilling implicit thesis from each mirrored deal.",
          },
        });
        const theses = await runThesisExtractor(collector.deals, ctx);
        collector.theses.push(...theses);
        emit({
          type: "step.completed",
          payload: {
            step: "step2",
            itemCount: theses.length,
            message: `Generated ${theses.length} thesis briefs.`,
          },
        });

        // STEP 3
        emit({
          type: "step.started",
          payload: {
            step: "step3",
            message: "Searching earlier-stage counterparts and reranking by thesis fit.",
          },
        });
        const counterparts = await runCounterpartFinder(
          collector.deals,
          theses,
          collector.config,
          ctx,
        );
        collector.counterparts.push(...counterparts);
        emit({
          type: "step.completed",
          payload: {
            step: "step3",
            itemCount: counterparts.length,
            message: `Kept ${counterparts.length} on-thesis counterparts (cap ${LIMITS.totalCounterparts}).`,
          },
        });

        // STEP 4
        emit({
          type: "step.started",
          payload: {
            step: "step4",
            message: "Computing traction signals and risk flags for each counterpart.",
          },
        });
        const step4 = await runTractionScorer(counterparts, ctx);
        collector.traction.push(...step4.traction);
        collector.riskFlags.push(...step4.risk);
        emit({
          type: "step.completed",
          payload: {
            step: "step4",
            itemCount: step4.traction.length,
            message: `Traction + risk scored for ${step4.traction.length} counterparts.`,
          },
        });

        // STEP 5
        emit({
          type: "step.started",
          payload: {
            step: "step5",
            message: "Enriching founders and synthesizing dossier blurbs.",
          },
        });
        const founders = await runFounderScorer(counterparts, step4.enriched, theses, ctx);
        collector.founders.push(...founders);
        emit({
          type: "step.completed",
          payload: {
            step: "step5",
            itemCount: founders.length,
            message: `Scored founder rosters for ${founders.length} companies.`,
          },
        });

        // STEP 6
        emit({
          type: "step.started",
          payload: {
            step: "step6",
            message: "Building final portfolio with power-law allocation and diversification caps.",
          },
        });
        const portfolio = runPortfolioBuilder(
          counterparts,
          step4.traction,
          step4.risk,
          founders,
          theses,
          collector.config,
          ctx,
        );
        collector.portfolio = portfolio;
        emit({
          type: "step.completed",
          payload: {
            step: "step6",
            itemCount: portfolio.entries.length,
            message: `Portfolio built: ${portfolio.byStatus.invest} invest, ${portfolio.byStatus.watch} watch, ${portfolio.byStatus.skip} skip.`,
          },
        });

        await persistRun(collector);

        emit({
          type: "run.completed",
          payload: {
            runId,
            totalCredits: collector.totalCredits,
            message: `Run complete. ${portfolio.byStatus.invest} invest cheques. ${collector.totalCredits.toFixed(1)} estimated credits used.`,
          },
        });
      } catch (error) {
        emit({
          type: "run.failed",
          payload: {
            message:
              error instanceof Error
                ? error.message
                : "Unknown error while running the pipeline.",
          },
        });
        try {
          await persistRun(collector);
        } catch {
          // best effort
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: createSseHeaders(),
  });
}
