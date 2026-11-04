import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Locator, Page } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { requireEnv } from '../support/config.js';
import { resolveTokens } from '../support/testDataGenerator.js';

// Shared, page-agnostic steps. Generated feature files reuse these by exact text; a
// feature's own <Name>.steps.ts only adds what these can't express.

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The form control labelled `label`. Exact match first: getByLabel's default substring
// match makes "Password" also hit "Confirm password" (a strict-mode failure). Falls back to
// the substring match for a label whose text also contains its control's own text, e.g.
// <label>Gender <select>...options...</select></label>.
async function field(page: Page, label: string): Promise<Locator> {
  const exact = page.getByLabel(label, { exact: true });
  return (await exact.count()) > 0 ? exact : page.getByLabel(label);
}

async function validity(page: Page, label: string): Promise<{ valid: boolean; message: string }> {
  return (await field(page, label)).evaluate((el) => {
    const input = el as HTMLInputElement;
    return { valid: input.validity.valid, message: input.validationMessage };
  });
}

Given('I open the {string} page', async function (this: CustomWorld, url: string) {
  await this.page.goto(url);
});

When('I click the {string} button', async function (this: CustomWorld, name: string) {
  await this.page.getByRole('button', { name }).click();
});

When('I click the {string} link', async function (this: CustomWorld, name: string) {
  await this.page.getByRole('link', { name }).click();
});

// The value may carry generated-data tokens: "{{random.email}}", "{{negative.email}}",
// "{{boundary.name}}", "{{security.comment}}" -- a fresh value on every run.
When('I fill {string} with {string}', async function (this: CustomWorld, label: string, value: string) {
  await (await field(this.page, label)).fill(resolveTokens(value));
});

When('I fill {string} with the value of env {string}', async function (this: CustomWorld, label: string, envKey: string) {
  await (await field(this.page, label)).fill(requireEnv(envKey));
});

// <select> dropdowns: `option` is the option's visible text (or its value).
When('I select {string} from {string}', async function (this: CustomWorld, option: string, label: string) {
  await (await field(this.page, label)).selectOption(option);
});

When('I check {string}', async function (this: CustomWorld, label: string) {
  await (await field(this.page, label)).check();
});

When('I uncheck {string}', async function (this: CustomWorld, label: string) {
  await (await field(this.page, label)).uncheck();
});

// Playwright key names: "Enter", "Tab", "Escape", "ArrowDown"...
When('I press the {string} key', async function (this: CustomWorld, key: string) {
  await this.page.keyboard.press(key);
});

Then('I should see the text {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page.getByText(text).first()).toBeVisible();
});

Then('I should not see the text {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page.getByText(text)).toHaveCount(0);
});

Then('I should see the {string} button', async function (this: CustomWorld, name: string) {
  await expect(this.page.getByRole('button', { name })).toBeVisible();
});

Then('the page title should contain {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page).toHaveTitle(new RegExp(escapeRegExp(text)));
});

Then('the URL should contain {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page).toHaveURL(new RegExp(escapeRegExp(text)));
});

// Retries until the URL no longer contains the text (e.g. waiting for a redirect away from
// register.html), like every other expect.
Then('the URL should not contain {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page).not.toHaveURL(new RegExp(escapeRegExp(text)));
});

// Browser (HTML5) validation -- `required`, type="email", min/max/minlength, pattern. For
// pages that block submission with the browser's own popup instead of on-page error text.
Then('the {string} field should be invalid', async function (this: CustomWorld, label: string) {
  const v = await validity(this.page, label);
  if (v.valid) throw new Error(`Expected "${label}" to fail browser validation, but it is valid`);
});

Then('the {string} field should be valid', async function (this: CustomWorld, label: string) {
  const v = await validity(this.page, label);
  if (!v.valid) throw new Error(`Expected "${label}" to be valid, but the browser reports: ${v.message}`);
});
