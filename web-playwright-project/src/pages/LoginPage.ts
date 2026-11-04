import { BasePage } from './BasePage.js';
import { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get email(): Locator { return this.page.getByRole('textbox', { name: 'Email' }); }
  get password(): Locator { return this.page.getByRole('textbox', { name: 'Password' }); }
  get signInButton(): Locator { return this.page.getByRole('button', { name: 'Sign in' }); }

  async login(email: string, pass: string): Promise<void> {
    await this.fill(this.email, email);
    await this.fill(this.password, pass);
    await this.click(this.signInButton);
    await this.page.waitForURL(url => !url.pathname.includes('/login'));
  }
}
