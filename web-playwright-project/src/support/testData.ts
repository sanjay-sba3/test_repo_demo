import { readFileSync } from 'fs';
import { resolveTokens } from './testDataGenerator.js';

// Loads src/testdata/<name>.json. "${VAR}" placeholders are replaced from process.env, so
// credentials stay in .env: {"password": "${APP_PASSWORD}"}. "{{random.email}}"-style tokens
// in string values become generated values (testDataGenerator.ts), fresh on every load.
export function loadTestData<T = Record<string, any>>(name: string): T {
  const raw = readFileSync(new URL(`../testdata/${name}.json`, import.meta.url), 'utf8');
  const resolved = raw.replace(/\$\{(\w+)\}/g, (_, key) => JSON.stringify(process.env[key] ?? '').slice(1, -1));
  return resolveAll(JSON.parse(resolved));
}

function resolveAll(value: any): any {
  if (typeof value === 'string') return resolveTokens(value);
  if (Array.isArray(value)) return value.map(resolveAll);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveAll(v)]));
  return value;
}
