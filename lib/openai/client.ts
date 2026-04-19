import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { requireEnv } from "@/lib/env";

export type StructuredGenerationInput<T> = {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  schemaName: string;
  schemaDescription?: string;
  model?: string;
};

export type StructuredGenerationResult<T> = {
  object: T;
  model: string;
};

export interface LanguageModelClient {
  generateObject<T>(
    input: StructuredGenerationInput<T>,
  ): Promise<StructuredGenerationResult<T>>;
}

const DEFAULT_MODEL =
  process.env.MIRRORVC_LLM_MODEL?.trim() || "gpt-5.4-mini";

class OpenAiSdkClient implements LanguageModelClient {
  async generateObject<T>(
    input: StructuredGenerationInput<T>,
  ): Promise<StructuredGenerationResult<T>> {
    const apiKey = requireEnv("OPENAI_API_KEY");
    const openai = createOpenAI({ apiKey });
    const modelName = input.model ?? DEFAULT_MODEL;

    const result = await generateObject({
      model: openai(modelName),
      system: input.system,
      prompt: input.prompt,
      schema: input.schema,
      schemaName: input.schemaName,
      schemaDescription: input.schemaDescription,
    });

    return {
      object: result.object,
      model: modelName,
    };
  }
}

export const openAiClient: LanguageModelClient = new OpenAiSdkClient();
