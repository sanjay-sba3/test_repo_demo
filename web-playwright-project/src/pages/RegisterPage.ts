import { BasePage } from './BasePage.js';

interface RegistrationDetails {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
  password: string;
}

export class RegisterPage extends BasePage {
  get firstName() { return this.page.getByRole('textbox', { name: 'First name' }); }
  get lastName() { return this.page.getByRole('textbox', { name: 'Last name' }); }
  get emailAddress() { return this.page.getByRole('textbox', { name: 'Email address' }); }
  get age() { return this.page.getByRole('spinbutton', { name: 'Age (years)' }); }
  get gender() { return this.page.getByRole('combobox', { name: 'Gender identity' }); }
  get password() { return this.page.getByRole('textbox', { name: 'Account password' }); }
  get confirmPassword() { return this.page.getByRole('textbox', { name: 'Confirm password' }); }
  get terms() { return this.page.getByRole('checkbox', { name: 'I accept the terms and conditions' }); }
  get createAccount() { return this.page.getByRole('button', { name: 'Create account' }); }

  async register(details: RegistrationDetails): Promise<void> {
    await this.fill(this.firstName, details.firstName);
    await this.fill(this.lastName, details.lastName);
    await this.fill(this.emailAddress, details.email);
    await this.fill(this.age, details.age);
    await this.select(this.gender, details.gender);
    await this.fill(this.password, details.password);
    await this.fill(this.confirmPassword, details.password);
    await this.check(this.terms);
    await this.click(this.createAccount);
  }
}
