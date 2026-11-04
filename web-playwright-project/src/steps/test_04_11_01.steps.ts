import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { generateValue, resolveTokens } from '../support/testDataGenerator.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';

type JourneyWorld = CustomWorld & {
  email?: string;
  password?: string;
  firstName?: string;
};

async function registerUser(world: JourneyWorld, firstName: string) {
  world.firstName = resolveTokens(firstName);
  world.email = generateValue('email');
  world.password = 'S3cureP@ssw0rd!';

  const registerPage = new RegisterPage(world.page);
  await registerPage.open('http://localhost:3000/register');
  await registerPage.fillAndSubmitForm({
    firstName: world.firstName,
    lastName: 'User',
    email: world.email,
    age: '30',
    gender: 'Male',
    password: world.password,
  });
}

Given('I register a new user and see the success message', async function (this: JourneyWorld) {
  await registerUser(this, '{{random.firstName}}');
  await expect(this.page.getByText('Registration successful')).toBeVisible();
});

Given('I register a new user with a script in the first name and see the success message', async function (this: JourneyWorld) {
  await registerUser(this, '{{security.comment}}');
  await expect(this.page.getByText('Registration successful')).toBeVisible();
});

When('I sign in as that new user', async function (this: JourneyWorld) {
  if (!this.email || !this.password) {
    throw new Error('User credentials not found. Did you register a user in a previous step?');
  }
  const loginPage = new LoginPage(this.page);
  await loginPage.login(this.email, this.password);
});

Then('I should see the {string} link', async function (this: CustomWorld, name: string) {
  await expect(this.page.getByRole('link', { name })).toBeVisible();
});

Then('I should see the script as plain text in the profile', async function (this: JourneyWorld) {
  let dialogTriggered = false;
  this.page.once('dialog', () => (dialogTriggered = true));

  const profilePage = new ProfilePage(this.page);
  await expect(profilePage.profileHeading).toContainText(this.firstName as string);

  // This check runs after the page has loaded and rendered.
  if (dialogTriggered) {
    throw new Error('An unexpected browser alert dialog was displayed, indicating a potential XSS vulnerability.');
  }
});
