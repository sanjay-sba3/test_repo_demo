import { Before, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { generateValue } from '../support/testDataGenerator.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';

type JourneyWorld = CustomWorld & {
  email?: string;
  password?: string;
  script?: string;
  dialogFired?: boolean;
};

Before({ tags: '@xss-test' }, function (this: JourneyWorld) {
  this.dialogFired = false;
  this.page.on('dialog', () => {
    this.dialogFired = true;
  });
});

Then('I should see the {string} link', async function (this: CustomWorld, name: string) {
  await expect(this.page.getByRole('link', { name })).toBeVisible();
});

When('I register a new user', async function (this: JourneyWorld) {
  this.email = generateValue('email');
  this.password = 'S3cureP@ssw0rd!';
  const registerPage = new RegisterPage(this.page);
  await registerPage.register({
    firstName: generateValue('firstName'),
    lastName: generateValue('lastName'),
    email: this.email,
    age: '30',
    gender: 'Male',
    password: this.password,
  });
});

When('I register a new user with a script in the first name', async function (this: JourneyWorld) {
  this.email = generateValue('email');
  this.password = 'A-strong-password-123!';
  this.script = generateValue('firstName', 'security'); // <script>alert(1)</script>
  const registerPage = new RegisterPage(this.page);
  await registerPage.register({
    firstName: this.script,
    lastName: generateValue('lastName'),
    email: this.email,
    age: '28',
    gender: 'Other',
    password: this.password,
  });
});

When('I log in as the new user', async function (this: JourneyWorld) {
  if (!this.email || !this.password) {
    throw new Error('User credentials not found in world context. Did you register a user first?');
  }
  const loginPage = new LoginPage(this.page);
  await loginPage.login(this.email, this.password);
});

When('I navigate from the dashboard to my profile and back', async function (this: CustomWorld) {
  await new DashboardPage(this.page).viewProfile();
  await new ProfilePage(this.page).goBackToDashboard();
});

When('I log out from the dashboard', async function (this: CustomWorld) {
  await new DashboardPage(this.page).logout();
});

Then('no alert dialog should have appeared', function (this: JourneyWorld) {
  if (this.dialogFired) {
    throw new Error('An unexpected alert dialog was displayed.');
  }
});
