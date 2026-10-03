// Server-only environment for Render. Report quotas fall back to bounded RAM
// counters on the single free instance when no durable database is configured.
export const env = process.env;
