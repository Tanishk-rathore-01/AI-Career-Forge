const serverEnv = [
  { key: "DATABASE_URL", required: true },
  { key: "DIRECT_URL", required: true },
  { key: "AUTH_SECRET", required: true },
  { key: "AUTH_GOOGLE_ID", required: true },
  { key: "AUTH_GOOGLE_SECRET", required: true },
  { key: "NEXT_PUBLIC_APP_URL", required: true },
  { key: "AI_PROVIDER", required: false },
  { key: "GEMINI_API_KEY", required: false },
  { key: "GEMINI_MODEL", required: false },
  { key: "OPENAI_API_KEY", required: false },
  { key: "OPENAI_MODEL", required: false }
] as const;

export function getEnvironmentStatus() {
  return serverEnv.map((item) => ({
    ...item,
    configured: Boolean(process.env[item.key])
  }));
}

export function missingEnvironmentKeys() {
  return getEnvironmentStatus()
    .filter((item) => item.required && !item.configured)
    .map((item) => item.key);
}
