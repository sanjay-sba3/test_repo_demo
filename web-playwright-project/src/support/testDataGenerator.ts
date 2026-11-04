import { faker } from '@faker-js/faker';

// Generated test data: "{{random.email}}", "{{negative.email}}", "{{boundary.name}}",
// "{{security.comment}}" in a test data file (resolved by loadTestData) or generateValue()
// in a script. The field name picks the kind of value; every call is a NEW value.
export type Strategy = 'random' | 'negative' | 'boundary' | 'security';

const NUMERIC_WORDS = new Set(['id', 'count', 'amount', 'age', 'price', 'quantity', 'qty', 'total', 'number']);
const TOKEN = /\{\{\s*(random|negative|boundary|security)\.([\w.-]+)\s*\}\}/g;

// "firstName" / "first_name" / "first-name" -> ["first", "name"]
function words(field: string): string[] {
  return field.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

export function generateValue(field: string, strategy: Strategy = 'random'): string {
  const parts = words(field);
  const key = parts.join('');
  const has = (w: string) => parts.includes(w);
  const email = key.includes('email');
  const phone = key.includes('phone') || has('mobile');
  const numeric = !email && !phone && parts.some(w => NUMERIC_WORDS.has(w));

  if (strategy === 'negative') return email ? 'invalid-email' : numeric ? '-999' : '';
  if (strategy === 'boundary') return numeric ? '0' : 'A';
  if (strategy === 'security') return key === 'sql' ? "' OR '1'='1" : numeric ? '9999999' : '<script>alert(1)</script>';

  if (email) return faker.internet.email().toLowerCase();
  if (key.includes('password')) return 'Pass@' + faker.internet.password({ length: 10 });
  if (phone) return faker.string.numeric(10);
  if (numeric) return String(faker.number.int({ min: 1, max: 100 }));
  if (has('date') || has('time')) return new Date().toISOString();
  if (has('first')) return faker.person.firstName();
  if (has('last')) return faker.person.lastName();
  if (has('user') || has('username') || has('login')) return faker.internet.username();
  if (has('name')) return faker.person.fullName();
  return faker.lorem.word();
}

// Replaces every token in a string; two tokens give two different values.
export function resolveTokens(text: string): string {
  return text.replace(TOKEN, (_, strategy: Strategy, field: string) => generateValue(field, strategy));
}
