import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class RegisterPage extends BasePage {
  get firstName(): Locator {
    return this.page.getByRole('textbox', { name: 'First name' });
  }

  get lastName(): Locator {
    return this.page.getByRole('textbox', { name: 'Last name' });
  }

  get emailAddress(): Locator {
    return this.page.getByRole('textbox', { name: 'Email address' });
  }

  get mobileNumber(): Locator {
    return this.page.getByRole('textbox', { name: 'Mobile number' });
  }

  get age(): Locator {
    return this.page.getByRole('spinbutton', { name: 'Age (years)' });
  }

  get genderIdentity(): Locator {
    return this.page.getByRole('combobox', { name: 'Gender identity' });
  }

  get accountPassword(): Locator {
    return this.page.getByRole('textbox', { name: 'Account password' });
  }

  get confirmPassword(): Locator {
    return this.page.getByRole('textbox', { name: 'Confirm password' });
  }

  get acceptTerms(): Locator {
    return this.page.getByRole('checkbox', { name: 'I accept the terms and conditions' });
  }

  get createAccountButton(): Locator {
    return this.page.getByRole('button', { name: 'Create account' });
  }
}
