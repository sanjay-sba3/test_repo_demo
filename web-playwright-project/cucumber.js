const common = {
  import: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  loader: ['ts-node/esm'],
  format: [
    'progress',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    // Needs its own output file: a formatter without one takes over stdout, which hides
    // the progress output (and every error message) from the console and from Orbit.
    'allure-cucumberjs/reporter:reports/allure-reporter.log'
  ],
  formatOptions: { resultsDir: 'allure-results' },
  failFast: false
};

// `npx cucumber-js` / `npm test`: every feature.
export default { ...common, paths: ['src/features/**/*.feature'] };

// `cucumber-js -p single src/features/<Name>.feature`: only the given feature(s) -- a
// profile without `paths`, so a CLI path isn't merged with the default glob above.
export const single = common;
