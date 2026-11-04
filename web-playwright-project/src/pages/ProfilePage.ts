import { BasePage } from './BasePage.js';
import { Page, Locator } from '@playwright/test';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get backToDashboardLink(): Locator { return this.page.getByRole('link', { name: '← Back to dashboard' }); }
  get heading(): Locator { return this.page.getByRole('heading', { level: 1 }); }
}
