import dotenv from 'dotenv';

// override: Orbit writes this project's .env per run (the selected environment's URL and
// login), and those values must win over anything the parent process happened to inherit.
dotenv.config({ override: true, quiet: true });

// Every environment-specific value (base URL, credentials) comes from .env / process env --
// never hardcode one in a feature, step, page object or test data file.
export const config = {
  baseUrl: process.env.APP_BASE_URL || '',
  username: process.env.APP_USERNAME || '',
  password: process.env.APP_PASSWORD || '',
  browser: (process.env.BROWSER || 'chromium').toLowerCase(),
  headless: process.env.HEADLESS !== 'false',
  timeout: Number(process.env.STEP_TIMEOUT_MS || 60000)
};

// An empty value counts as not set: Orbit writes every known key, blank when the selected
// environment has none, so "" means "not configured", never a real test value.
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not set (see .env.example)`);
  return value;
}
