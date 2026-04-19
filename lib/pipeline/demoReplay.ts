import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PipelineEvent } from "@/lib/pipeline/events";
import type { RunRecord } from "@/lib/pipeline/types";

const FIXTURE_PATH = path.join(process.cwd(), "lib", "fixtures", "demo-run.json");

const STEP_LABELS: Record<string, string> = {
  bootstrap: "Bootstrap",
  step1a: "Mirrored deals (last 6 months)",
  step2: "Thesis extraction",
  step3: "Counterpart finder",
  step4: "Traction & risk scoring",
  step5: "Founder scoring",
  step6: "Portfolio assembly",
};

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function replayDemoRun(
  runId: string,
  emit: (event: PipelineEvent) => void,
) {
  let raw: string;
  try {
    raw = await readFile(FIXTURE_PATH, "utf8");
  } catch {
    emit({
      type: "run.blocked",
      payload: {
        reason: "Demo fixture not yet captured. Run a real pipeline once to generate lib/fixtures/demo-run.json.",
      },
    });
    return;
  }

  const fixture = JSON.parse(raw) as RunRecord;

  emit({
    type: "step.started",
    payload: { step: "bootstrap", message: "Replaying captured demo run." },
  });
  await delay(300);
  emit({
    type: "run.checkpoint",
    payload: {
      limits: {},
      funds: fixture.config.fundsToMirror,
    },
  });
  emit({
    type: "step.completed",
    payload: { step: "bootstrap", itemCount: fixture.config.fundsToMirror.length, message: "Replay configured." },
  });

  emit({ type: "step.started", payload: { step: "step1a", message: STEP_LABELS.step1a } });
  for (const deal of fixture.deals) {
    emit({ type: "step1a.deal", payload: deal });
    await delay(70);
  }
  emit({
    type: "step.completed",
    payload: { step: "step1a", itemCount: fixture.deals.length, message: "Replayed mirrored deals." },
  });

  emit({ type: "step.started", payload: { step: "step2", message: STEP_LABELS.step2 } });
  for (const thesis of fixture.theses) {
    emit({ type: "step2.thesis", payload: thesis });
    const reason = fixture.reasoning.find(
      (r) => r.step === "step2" && fixture.deals.find((d) => d.crustdataCompanyId === thesis.crustdataCompanyId)?.name === r.companyName,
    );
    if (reason) emit({ type: "reasoning", payload: reason });
    await delay(180);
  }
  emit({
    type: "step.completed",
    payload: { step: "step2", itemCount: fixture.theses.length, message: "Replayed theses." },
  });

  emit({ type: "step.started", payload: { step: "step3", message: STEP_LABELS.step3 } });
  for (const cp of fixture.counterparts) {
    emit({ type: "step3.counterpart", payload: cp });
    const reason = fixture.reasoning.find(
      (r) => r.step === "step3" && r.companyName === cp.name,
    );
    if (reason) emit({ type: "reasoning", payload: reason });
    await delay(120);
  }
  emit({
    type: "step.completed",
    payload: { step: "step3", itemCount: fixture.counterparts.length, message: "Replayed counterparts." },
  });

  emit({ type: "step.started", payload: { step: "step4", message: STEP_LABELS.step4 } });
  for (const traction of fixture.traction) {
    const risk = fixture.riskFlags.find((r) => r.crustdataCompanyId === traction.crustdataCompanyId);
    emit({
      type: "step4.traction",
      payload: { traction, risk: risk ?? { crustdataCompanyId: traction.crustdataCompanyId, flags: [], totalPenalty: 0 } },
    });
    await delay(80);
  }
  emit({
    type: "step.completed",
    payload: { step: "step4", itemCount: fixture.traction.length, message: "Replayed traction signals." },
  });

  emit({ type: "step.started", payload: { step: "step5", message: STEP_LABELS.step5 } });
  for (const founder of fixture.founders) {
    emit({ type: "step5.founders", payload: founder });
    await delay(120);
  }
  emit({
    type: "step.completed",
    payload: { step: "step5", itemCount: fixture.founders.length, message: "Replayed founders." },
  });

  emit({ type: "step.started", payload: { step: "step6", message: STEP_LABELS.step6 } });
  for (const entry of fixture.portfolio.entries) {
    emit({ type: "step6.entry", payload: entry });
    await delay(60);
  }
  emit({ type: "step6.summary", payload: fixture.portfolio });
  emit({
    type: "step.completed",
    payload: { step: "step6", itemCount: fixture.portfolio.entries.length, message: "Replayed final portfolio." },
  });

  emit({
    type: "run.completed",
    payload: {
      runId: fixture.runId ?? runId,
      totalCredits: fixture.totalCredits,
      message: `Demo replay complete (${fixture.portfolio.byStatus.invest} invest cheques).`,
    },
  });
}
