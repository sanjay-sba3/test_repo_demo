import { BasePage } from './BasePage.js';
import { Locator, Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  get firstName(): Locator { return this.page.getByRole('textbox', { name: 'First name' }); }
  get lastName(): Locator { return this.page.getByRole('textbox', { name: 'Last name' }); }
  get emailAddress(): Locator { return this.page.getByRole('textbox', { name: 'Email address' }); }
  get age(): Locator { return this.page.getByRole('spinbutton', { name: 'Age (years)' }); }
  get genderIdentity(): Locator { return this.page.getByRole('combobox', { name: 'Gender identity' }); }
  get accountPassword(): Locator { return this.page.getByRole('textbox', { name: 'Account password' }); }
  get confirmPassword(): Locator { return this.page.getByRole('textbox', { name: 'Confirm password' }); }
  get acceptTerms(): Locator { return this.page.getByRole('checkbox', { name: 'I accept the terms and conditions' }); }
  get createAccountButton(): Locator { return this.page.getByRole('button', { name: 'Create account' }); }
  get goToLoginLink(): Locator { return this.page.getByRole('link', { name: 'Go to login' }); }

  async register(details: {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    gender: string;
    pass: string;
  }): Promise<void> {
    await this.fill(this.firstName, details.firstName);
    await this.fill(this.lastName, details.lastName);
    await this.fill(this.emailAddress, details.email);
    await this.fill(this.age, details.age);
    await this.select(this.genderIdentity, details.gender);
    await this.fill(this.accountPassword, details.pass);
    await this.fill(this.confirmPassword, details.pass);
    await this.check(this.acceptTerms);
    await this.click(this.createAccountButton);
  }
}
