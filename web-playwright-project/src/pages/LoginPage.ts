import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  get email() {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get password() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  get signIn() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  get loginLink() {
    return this.page.getByRole('link', { name: 'Login' });
  }

  async login(user: string, pass: string): Promise<void> {
    await this.fill(this.email, user);
    await this.fill(this.password, pass);
    await this.click(this.signIn);
    await this.page.waitForURL((u) => !u.pathname.startsWith('/login'));
  }
}
