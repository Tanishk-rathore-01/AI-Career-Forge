const requiredServerEnv = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "OPENAI_API_KEY"
] as const;

export function getEnvironmentStatus() {
  return requiredServerEnv.map((key) => ({
    key,
    configured: Boolean(process.env[key])
  }));
}

export function missingEnvironmentKeys() {
  return getEnvironmentStatus()
    .filter((item) => !item.configured)
    .map((item) => item.key);
}
