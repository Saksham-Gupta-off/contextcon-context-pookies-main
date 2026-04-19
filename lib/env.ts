const REQUIRED_KEYS = ["CRUSTDATA_API_KEY", "OPENAI_API_KEY"] as const;

export type RequiredEnvKey = (typeof REQUIRED_KEYS)[number];

export type MirrorVcEnv = {
  CRUSTDATA_API_KEY?: string;
  OPENAI_API_KEY?: string;
  NODE_ENV: string;
};

export function getEnv(): MirrorVcEnv {
  return {
    CRUSTDATA_API_KEY: process.env.CRUSTDATA_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV ?? "development",
  };
}

export function requireEnv(key: RequiredEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required but is not set.`);
  }

  return value;
}

export function hasEnv(key: RequiredEnvKey) {
  return Boolean(process.env[key]);
}

export function missingRequiredKeys() {
  return REQUIRED_KEYS.filter((key) => !process.env[key]);
}
