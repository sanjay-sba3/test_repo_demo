import { BasePage } from './BasePage.js';
import { Page, Locator } from '@playwright/test';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get viewProfileLink(): Locator { return this.page.getByRole('link', { name: 'View profile →' }); }
  get logoutButton(): Locator { return this.page.getByRole('button', { name: 'Logout' }); }
}
