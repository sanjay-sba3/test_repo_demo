import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { generateValue } from '../support/testDataGenerator.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';

// Augment CustomWorld for this feature's multi-step journeys
type JourneyWorld = CustomWorld & {
  email?: string;
  password?: string;
  scriptName?: string;
};

When('I register a new user', async function (this: JourneyWorld) {
  this.email = generateValue('email');
  this.password = 'S3cureP@ssw0rd!'; // Must meet minlength=6

  const registerPage = new RegisterPage(this.page);
  await registerPage.open('http://localhost:3000/register');

  await registerPage.fill(registerPage.firstName, generateValue('firstName'));
  await registerPage.fill(registerPage.lastName, generateValue('lastName'));
  await registerPage.fill(registerPage.emailAddress, this.email);
  await registerPage.fill(registerPage.age, '30');
  await registerPage.select(registerPage.genderIdentity, 'Male');
  await registerPage.fill(registerPage.accountPassword, this.password);
  await registerPage.fill(registerPage.confirmPassword, this.password);
  await registerPage.check(registerPage.acceptTerms);
  await registerPage.click(registerPage.createAccountButton);
});

When('I register a new user with a script in the name field', async function (this: JourneyWorld) {
  this.email = generateValue('email');
  this.password = 'A-strong-password-123!';
  this.scriptName = generateValue('comment', 'security'); // e.g., <script>alert(1)</script>

  const registerPage = new RegisterPage(this.page);
  await registerPage.open('http://localhost:3000/register');

  await registerPage.fill(registerPage.firstName, this.scriptName);
  await registerPage.fill(registerPage.lastName, generateValue('lastName'));
  await registerPage.fill(registerPage.emailAddress, this.email);
  await registerPage.fill(registerPage.age, '25');
  await registerPage.select(registerPage.genderIdentity, 'Female');
  await registerPage.fill(registerPage.accountPassword, this.password);
  await registerPage.fill(registerPage.confirmPassword, this.password);
  await registerPage.check(registerPage.acceptTerms);
  await registerPage.click(registerPage.createAccountButton);
});

When('I sign in as the new user', async function (this: JourneyWorld) {
  if (!this.email || !this.password) {
    throw new Error('User credentials not found in world context. Did a registration step run before this?');
  }
  const loginPage = new LoginPage(this.page);
  await loginPage.login(this.email, this.password);
});

Then('I should see the {string} link', async function (this: CustomWorld, name: string) {
  await expect(this.page.getByRole('link', { name })).toBeVisible();
});
