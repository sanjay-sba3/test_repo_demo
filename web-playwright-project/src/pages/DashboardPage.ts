import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
  get viewProfileLink(): Locator {
    return this.page.getByRole('link', { name: 'View profile →' });
  }

  get logoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Logout' });
  }
}
