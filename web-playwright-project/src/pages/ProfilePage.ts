import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class ProfilePage extends BasePage {
  get backToDashboardLink(): Locator {
    return this.page.getByRole('link', { name: '← Back to dashboard' });
  }
}
