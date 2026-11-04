Feature: User Registration and Login Flow

  @dryrun @TS-439 @TC-TC1
  Scenario: Unauthorized access to dashboard redirects to login
    Given I open the "http://localhost:3000/dashboard" page
    Then the URL should contain "/login"
    And I should see the text "Sign in"

  @dryrun @TS-440 @TC-TC1
  Scenario: Verify success message and login button after registration
    Given I open the "http://localhost:3000/register" page
    When I fill "First name" with "{{random.firstName}}"
    And I fill "Last name" with "{{random.lastName}}"
    And I fill "Email address" with "{{random.email}}"
    And I fill "Age (years)" with "30"
    And I select "Female" from "Gender identity"
    And I fill "Account password" with "S3cureP@ssw0rd!"
    And I fill "Confirm password" with "S3cureP@ssw0rd!"
    And I check "I accept the terms and conditions"
    When I click the "Create account" button
    Then I should see the text "Registration successful"
    And I should see the "Go to login" link

  @dryrun @TS-438 @TC-TC1
  Scenario: Attempt registration with an existing email address
    Given I open the "http://localhost:3000/register" page
    When I fill "First name" with "{{random.firstName}}"
    And I fill "Last name" with "{{random.lastName}}"
    And I fill "Email address" with the value of env "APP_USERNAME"
    And I fill "Age (years)" with "30"
    And I select "Other" from "Gender identity"
    And I fill "Account password" with "S3cureP@ssw0rd!"
    And I fill "Confirm password" with "S3cureP@ssw0rd!"
    And I check "I accept the terms and conditions"
    When I click the "Create account" button
    Then I should see the text "Email already registered"

  @dryrun @TS-437 @TC-TC1
  Scenario: E2E - Successful user registration, login, navigation, and logout
    Given I register a new user
    Then I should see the text "Registration successful"
    When I click the "Go to login" link
    Then the URL should contain "/login"
    When I log in as the newly registered user
    Then the URL should contain "/dashboard"
    When I click the "View profile →" link
    Then the URL should contain "/profile"
    When I click the "← Back to dashboard" link
    Then the URL should contain "/dashboard"
    When I click the "Logout" button
    Then I should see the "Login" link

  # needs-review: Test case specifies "Full Name" field, but page has "First name" and "Last name". Using "First name".
  @dryrun @needs-review @TS-441 @TC-TC1
  Scenario: Register with script in First Name field to test XSS protection
    Given I register a new user with a script in the first name
    Then I should see the text "Registration successful"
    When I click the "Go to login" link
    Then the URL should contain "/login"
    When I log in as the newly registered user
    Then the URL should contain "/dashboard"
    When I click the "View profile →" link
    Then the URL should contain "/profile"
    Then I should see the script displayed as text on the profile page
