import { BasePage } from './BasePage.js';
import { Locator, Page } from '@playwright/test';

export class LoginPage extends BasePage {
  get email(): Locator { return this.page.getByRole('textbox', { name: 'Email' }); }
  get password(): Locator { return this.page.getByRole('textbox', { name: 'Password' }); }
  get signInButton(): Locator { return this.page.getByRole('button', { name: 'Sign in' }); }

  async login(user: string, pass: string): Promise<void> {
    await this.fill(this.email, user);
    await this.fill(this.password, pass);
    await this.click(this.signInButton);
    await this.page.waitForURL(url => !url.pathname.includes('/login'));
  }
}
