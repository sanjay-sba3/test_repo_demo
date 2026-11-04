# web-playwright-project

cucumber-js + Playwright (TypeScript) reference project. Orbit downloads it from S3
(`web/playwright/web-playwright-project/`) into each workspace that has a web/Playwright
automation config.

```
npm install
npx playwright install chromium
cp .env.example .env
npx cucumber-js                    # everything
npx cucumber-js --tags @dryrun     # smoke subset Orbit runs after generation
npm run allure:report              # allure-results/ -> allure-report/ (needs Java, same as the API project)
npm run allure:open
```

Layout:

- `src/features/<Name>.feature`: generated Gherkin
- `src/steps/common.steps.ts`: shared steps (reuse these, don't redeclare them)
- `src/steps/<Name>.steps.ts`: feature-specific steps
- `src/pages/BasePage.ts`: base page object; `src/pages/<Page>Page.ts` extend it
- `src/testdata/<Name>.json`: test data, loaded with `loadTestData('<Name>')` -- `"${APP_PASSWORD}"`
  from `.env`, `"{{random.email}}"` / `{{negative.x}}` / `{{boundary.x}}` / `{{security.x}}` generated
  per load (`src/support/testDataGenerator.ts`, Faker)
- `src/support/`: World, hooks, config (`.env`), test data loader
