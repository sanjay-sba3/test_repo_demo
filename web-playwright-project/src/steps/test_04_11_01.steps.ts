import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { generateValue } from '../support/testDataGenerator.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';

type JourneyWorld = CustomWorld & { email?: string; password?: string };

When('I register a new user with valid details', async function (this: JourneyWorld) {
  this.email = generateValue('email');
  this.password = 'S3cureP@ssw0rd!';
  const registerPage = new RegisterPage(this.page);
  await registerPage.register({
    firstName: generateValue('firstName'),
    lastName: generateValue('lastName'),
    email: this.email,
    age: '30',
    gender: 'Female',
    pass: this.password,
  });
});

When('I register a new user with a script in the first name field', async function (this: JourneyWorld) {
  this.email = generateValue('email');
  this.password = 'A-strong-password-123!';
  const registerPage = new RegisterPage(this.page);
  await registerPage.register({
    firstName: '<script>alert(1)</script>',
    lastName: generateValue('lastName'),
    email: this.email,
    age: '30',
    gender: 'Female',
    pass: this.password,
  });
});

When('I sign in as the new user', async function (this: JourneyWorld) {
  if (!this.email || !this.password) {
    throw new Error('User credentials not generated. Did you run "I register a new user..." first?');
  }
  const loginPage = new LoginPage(this.page);
  await loginPage.login(this.email, this.password);
});

When('I navigate to the profile page', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.viewProfileLink.click();
});

When('I navigate back to the dashboard', async function (this: CustomWorld) {
  const profilePage = new ProfilePage(this.page);
  await profilePage.backToDashboardLink.click();
});

When('I log out', async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.logoutButton.click();
});

Then('I should see the {string} link', async function (this: CustomWorld, name: string) {
  await expect(this.page.getByRole('link', { name })).toBeVisible();
});
