import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  get email(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get password(): Locator {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  get signIn(): Locator {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  async login(user: string, pass: string): Promise<void> {
    await this.fill(this.email, user);
    await this.fill(this.password, pass);
    await this.click(this.signIn);
    // Wait until the app has left the login page to ensure session is established
    await this.page.waitForURL(url => !url.pathname.startsWith('/login'));
  }
}
