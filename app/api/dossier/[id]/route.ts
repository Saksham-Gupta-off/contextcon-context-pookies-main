import { NextResponse } from "next/server";
import { loadRun } from "@/lib/pipeline/runStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = new URL(request.url);
  const runId = url.searchParams.get("runId") ?? undefined;
  const run = await loadRun(runId);

  if (!run) {
    return NextResponse.json({ error: "no_run" }, { status: 404 });
  }

  const companyId = Number(id);
  const entry = run.portfolio.entries.find((e) => e.crustdataCompanyId === companyId);
  const counterpart = run.counterparts.find((c) => c.crustdataCompanyId === companyId);
  if (!entry || !counterpart) {
    return NextResponse.json({ error: "company_not_in_run" }, { status: 404 });
  }

  const traction = run.traction.find((t) => t.crustdataCompanyId === companyId);
  const risk = run.riskFlags.find((r) => r.crustdataCompanyId === companyId);
  const founders = run.founders.find((f) => f.crustdataCompanyId === companyId);
  const mirroredDeal = run.deals.find((d) => d.crustdataCompanyId === counterpart.mirroredFromCompanyId);
  const mirroredThesis = run.theses.find((t) => t.crustdataCompanyId === counterpart.mirroredFromCompanyId);
  const reasoning = run.reasoning.filter(
    (r) => r.companyName === counterpart.name || r.companyName === mirroredDeal?.name,
  );

  return NextResponse.json({
    runId: run.runId,
    entry,
    counterpart,
    traction,
    risk,
    founders,
    mirroredDeal,
    mirroredThesis,
    reasoning,
  });
}
