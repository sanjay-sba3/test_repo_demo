Feature: User Registration and Authentication

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
    And I fill "Age (years)" with "25"
    And I select "Male" from "Gender identity"
    And I fill "Account password" with "S3cureP@ssw0rd!"
    And I fill "Confirm password" with "S3cureP@ssw0rd!"
    And I check "I accept the terms and conditions"
    And I click the "Create account" button
    Then I should see the text "Registration successful"
    And I should see the "Go to login" link

  @dryrun @TS-437 @TC-TC1
  Scenario: E2E - Successful user registration, login, navigation, and logout
    Given I open the "http://localhost:3000/register" page
    When I register a new user with valid details
    Then I should see the text "Registration successful"
    And I should see the "Go to login" link
    When I click the "Go to login" link
    Then the URL should contain "/login"
    When I sign in as the new user
    Then the URL should contain "/dashboard"
    When I navigate to the profile page
    Then the URL should contain "/profile"
    When I navigate back to the dashboard
    Then the URL should contain "/dashboard"
    When I log out
    Then I should see the "Login" link

  @dryrun @TS-438 @TC-TC1
  Scenario: Attempt registration with an existing email address
    Given I open the "http://localhost:3000/register" page
    When I fill "First name" with "{{random.firstName}}"
    And I fill "Last name" with "{{random.lastName}}"
    And I fill "Email address" with the value of env "APP_USERNAME"
    And I fill "Age (years)" with "25"
    And I select "Female" from "Gender identity"
    And I fill "Account password" with "ValidPassword123!"
    And I fill "Confirm password" with "ValidPassword123!"
    And I check "I accept the terms and conditions"
    And I click the "Create account" button
    Then I should see the text "Email already registered"

  # needs-review: Test case specifies "Full Name" field, but page has "First name" and "Last name". Using "First name".
  @dryrun @needs-review @TS-441 @TC-TC1
  Scenario: Register with script in Full Name field to test XSS protection
    Given I open the "http://localhost:3000/register" page
    When I register a new user with a script in the first name field
    Then I should see the text "Registration successful"
    And I should see the "Go to login" link
    When I click the "Go to login" link
    Then the URL should contain "/login"
    When I sign in as the new user
    Then the URL should contain "/dashboard"
    When I navigate to the profile page
    Then the URL should contain "/profile"
    Then I should see the text "<script>alert(1)</script>"
