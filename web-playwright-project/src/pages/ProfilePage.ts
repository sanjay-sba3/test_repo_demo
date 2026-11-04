import { BasePage } from './BasePage.js';

export class ProfilePage extends BasePage {
  get backToDashboardLink() {
    return this.page.getByRole('link', { name: '← Back to dashboard' });
  }

  get profileHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }
}
