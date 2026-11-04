import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world.js';
import { generateValue } from '../support/testDataGenerator.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';

type JourneyWorld = CustomWorld & {
  email?: string;
  password?: string;
  firstName?: string;
};

const registerUser = async (world: JourneyWorld, firstName: string) => {
  world.email = generateValue('email');
  world.password = 'S3cureP@ssw0rd!'; // Must meet minlength=6
  world.firstName = firstName;

  const registerPage = new RegisterPage(world.page);
  await registerPage.open('http://localhost:3000/register');
  await registerPage.register({
    firstName: world.firstName,
    lastName: generateValue('lastName'),
    email: world.email,
    age: '30',
    gender: 'Prefer not to say',
    password: world.password,
    confirmPassword: world.password,
    acceptTerms: true,
  });
};

Given('I register a new user', async function (this: JourneyWorld) {
  await registerUser(this, generateValue('firstName'));
});

Given('I register a new user with a script in the first name', async function (this: JourneyWorld) {
  await registerUser(this, generateValue('comment', 'security'));
});

When('I log in as the newly registered user', async function (this: JourneyWorld) {
  if (!this.email || !this.password) {
    throw new Error('User credentials not found. Did you register the user first?');
  }
  const loginPage = new LoginPage(this.page);
  await loginPage.login(this.email, this.password);
});

Then('I should see the {string} link', async function (this: CustomWorld, name: string) {
  await expect(this.page.getByRole('link', { name })).toBeVisible();
});

Then('I should see the script displayed as text on the profile page', async function (this: JourneyWorld) {
  if (!this.firstName) {
    throw new Error('First name with script not found in world context.');
  }
  const profilePage = new ProfilePage(this.page);
  await expect(profilePage.heading).toContainText(this.firstName);
});
