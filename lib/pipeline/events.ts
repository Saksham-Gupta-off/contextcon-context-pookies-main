import type { FundId } from "@/lib/funds/types";
import type {
  ApiCallSnapshot,
  CompanyFounderScore,
  CounterpartCompany,
  DealThesis,
  MirroredDeal,
  PortfolioEntry,
  PortfolioSummary,
  ReasoningEntry,
  RiskFlag,
  TractionScore,
} from "@/lib/pipeline/types";

export type PipelineStepId =
  | "bootstrap"
  | "step1a"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6";

export type PipelineEvent =
  | {
      type: "run.started";
      payload: {
        runId: string;
        selectedFunds: FundId[];
        fundSize: number | null;
        targetPortfolioSize: number | null;
        demo: boolean;
      };
    }
  | {
      type: "step.started";
      payload: {
        step: PipelineStepId;
        message: string;
      };
    }
  | {
      type: "step.completed";
      payload: {
        step: PipelineStepId;
        itemCount: number;
        message: string;
      };
    }
  | {
      type: "step.skipped";
      payload: {
        step: PipelineStepId;
        reason: string;
      };
    }
  | {
      type: "step.warning";
      payload: {
        step: PipelineStepId;
        message: string;
      };
    }
  | {
      type: "run.checkpoint";
      payload: {
        limits: Record<string, number>;
        funds: FundId[];
      };
    }
  | {
      type: "step1a.deal";
      payload: MirroredDeal;
    }
  | {
      type: "step2.thesis";
      payload: DealThesis;
    }
  | {
      type: "step3.counterpart";
      payload: CounterpartCompany;
    }
  | {
      type: "step4.traction";
      payload: { traction: TractionScore; risk: RiskFlag };
    }
  | {
      type: "step5.founders";
      payload: CompanyFounderScore;
    }
  | {
      type: "step6.entry";
      payload: PortfolioEntry;
    }
  | {
      type: "step6.summary";
      payload: PortfolioSummary;
    }
  | {
      type: "api.call";
      payload: ApiCallSnapshot;
    }
  | {
      type: "reasoning";
      payload: ReasoningEntry;
    }
  | {
      type: "run.blocked";
      payload: { reason: string };
    }
  | {
      type: "run.failed";
      payload: { message: string };
    }
  | {
      type: "run.completed";
      payload: { runId: string; totalCredits: number; message: string };
    };
