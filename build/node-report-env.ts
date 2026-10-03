// Server-only environment for Render. Without a durable quota database,
// reportConfigured stays false even if a provider key is accidentally set.
export const env = process.env;
