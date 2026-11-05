Feature: User Registration and Authentication

  Background:
    Given I open the "http://localhost:3000/" page

  @dryrun @TS-437 @TC-TC1
  Scenario: E2E - Successful user registration, login, navigation, and logout
    When I register a new user
    Then I should see the text "Registration successful"
    When I click the "Go to login" link
    Then the URL should contain "/login"
    When I sign in as the new user
    Then the URL should contain "/dashboard"
    When I click the "View profile →" link
    Then the URL should contain "/profile"
    When I click the "← Back to dashboard" link
    Then the URL should contain "/dashboard"
    When I click the "Logout" button
    Then the URL should contain "/login"
    Then I should see the "Login" link

  @dryrun @TS-438 @TC-TC1
  Scenario: Attempt registration with an existing email address
    Given I open the "http://localhost:3000/register" page
    When I fill "First name" with "{{random.firstName}}"
    When I fill "Last name" with "{{random.lastName}}"
    When I fill "Email address" with the value of env "APP_USERNAME"
    When I fill "Age (years)" with "30"
    When I select "Male" from "Gender identity"
    When I fill "Account password" with "ValidPassword123!"
    When I fill "Confirm password" with "ValidPassword123!"
    When I check "I accept the terms and conditions"
    When I click the "Create account" button
    # The exact error message is not in UI discovery; assuming a common pattern.
    Then I should see the text "Email already registered"

  @dryrun @TS-439 @TC-TC1
  Scenario: Unauthorized access to dashboard redirects to login
    Given I open the "http://localhost:3000/dashboard" page
    Then the URL should contain "/login"
    Then I should see the text "Sign in"

  @dryrun @TS-440 @TC-TC1
  Scenario: Verify success message and login button after registration
    Given I open the "http://localhost:3000/register" page
    When I fill "First name" with "{{random.firstName}}"
    When I fill "Last name" with "{{random.lastName}}"
    When I fill "Email address" with "{{random.email}}"
    When I fill "Mobile number" with "+1234567890"
    When I fill "Age (years)" with "25"
    When I select "Female" from "Gender identity"
    When I fill "Account password" with "ValidPassword123!"
    When I fill "Confirm password" with "ValidPassword123!"
    When I check "I accept the terms and conditions"
    When I click the "Create account" button
    Then I should see the text "Registration successful"
    Then I should see the "Go to login" link

  @dryrun @TS-441 @TC-TC1
  Scenario: Register with script in First Name field to test XSS protection
    When I register a new user with a script in the name field
    Then I should see the text "Registration successful"
    When I click the "Go to login" link
    When I sign in as the new user
    Then the URL should contain "/dashboard"
    When I click the "View profile →" link
    Then the URL should contain "/profile"
    Then I should see the text "<script>alert(1)</script>"
