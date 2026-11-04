import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser } from '@playwright/test';
import { config } from './config.js';
import { CustomWorld } from './world.js';

setDefaultTimeout(config.timeout);

let browser: Browser;

BeforeAll(async function () {
  const browserType = config.browser === 'firefox' ? firefox : config.browser === 'webkit' ? webkit : chromium;
  browser = await browserType.launch({ headless: config.headless });
});

// One fresh context per scenario: no cookies/storage leak between scenarios.
Before(async function (this: CustomWorld) {
  this.browser = browser;
  this.context = await browser.newContext({ baseURL: config.baseUrl || undefined, ignoreHTTPSErrors: true });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
