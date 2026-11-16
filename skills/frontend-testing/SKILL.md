---
name: frontend-testing
description: Standards and best practices for writing maintainable, reliable, and effective frontend unit, integration, and end-to-end tests. Use when creating, reviewing, or modifying frontend tests, test infrastructure, mocks, or testing strategies.
---

# Frontend Testing

## 1. Core Philosophy

Write tests that provide confidence in application behavior, catch regressions, and make refactoring safer.

Follow these principles:

- Test observable behavior rather than implementation details.
- Prefer realistic user interactions over directly invoking internal functions.
- Keep tests deterministic, isolated, readable, and maintainable.
- Choose the appropriate testing level: unit, integration, or end-to-end.
- Prioritize meaningful coverage over arbitrary coverage percentages.
- Include accessibility considerations in component and integration testing.
- Avoid unnecessary mocking that makes tests behave differently from the real application.
- Write tests that explain expected behavior and protect important business requirements.
- Avoid mocking components inorder to ensure actual component behavior is tested.

## 2. Testing Stack

Use the established project testing stack. Prefer existing dependencies over introducing new tools without a clear reason.

Recommended tools:

| Tool | Responsibility |
|---|---|
| Vitest | Unit and integration test runner |
| React Testing Library | Component and DOM testing |
| user-event | Simulating realistic user interactions |
| MSW | Intercepting and mocking network requests |
| Playwright | End-to-end browser testing |
| Cucumber | BDD scenarios when business-readable specifications provide value |
| Visual regression tools | Detecting unintended visual changes |

## 3. Test Types and Scope

### 3.1 Unit Tests

Test individual components, hooks, utilities, services, or modules in isolation.

Examples:

- A component renders the expected content.
- A button responds correctly to user interaction.
- A hook returns the expected state.
- A utility produces the expected output.
- A service handles success and failure responses correctly.
- A validation function returns the expected errors.

Unit tests should focus on the individual unit's responsibilities and observable behavior.

### 3.2 Integration Tests

Test how multiple parts of the application work together.

Examples:

- A page correctly composes and coordinates its components.
- A form validates input, submits data, and displays the result.
- A page fetches data and renders loading, success, empty, and error states.
- Multiple hooks and components work together as expected.
- Navigation and shared state behave correctly across a page.
- Data flows correctly between application layers.

Integration tests should verify meaningful interactions and data flow across boundaries rather than retesting every individual component.

### 3.3 End-to-End Tests

Test complete user journeys in a real browser using the application as a user would.

Examples:

- A user signs in and reaches the dashboard.
- A user completes a checkout flow.
- A user creates, edits, and deletes a resource.
- A user navigates through important application workflows.

E2E tests should focus on critical user journeys and business workflows.

## 4. Testing Responsibilities by Layer

| Application layer | Recommended testing |
|---|---|
| Components | Unit tests |
| Hooks | Unit tests |
| Utilities and helpers | Unit tests |
| API clients and services | Unit tests |
| Templates and pages | Integration tests |
| Feature workflows | Integration tests |
| Critical user journeys | E2E tests |

Classify tests according to what they verify, not merely their filenames or locations.

For example, a page test that only verifies that the page renders is not automatically an integration test. It should verify meaningful interactions between the page's components, state, and data flow to qualify as an integration test.

## 5. Test File Organization and Naming

Tests must be colocated with the application code they verify.

Both unit and integration tests must live inside a folder named `__tests__`.

### 5.1 Unit Test Placement

Unit tests must live in the `__tests__` folder inside the directory of the component or module being tested.

Corresponding mock files must also live in that same `__tests__` folder.

Example:

```bash
src/
└── features/
    └── auth/
        └── components/
            └── login-form/
                ├── login-form.tsx
                └── __tests__/
                    ├── login-form-rendering.test.tsx
                    ├── login-form-validation.test.ts
                    ├── login-form-submission.test.tsx
                    └── login-form.mock.ts
```

### 5.2 Integration Test Placement

Integration tests must live in the `__tests__` folder inside the template or page directory being tested.

Corresponding mock files must also live in that same `__tests__` folder.

Example:

```bash
src/
└── app/
    └── pages/
        └── login/
            ├── login-page.tsx
            └── __tests__/
                ├── login-page-authentication.integration.test.tsx
                ├── login-page-error-handling.integration.test.tsx
                └── login-page.mock.ts
```

### 5.3 E2E Test Placement

E2E tests must live in a dedicated E2E project outside the main application.
E2E test files must use the `.spec` extension.

Example:

```bash
e2e/
├── authentication/
│   ├── login.spec.ts
│   └── logout.spec.ts
├── checkout/
│   └── checkout.spec.ts
├── fixtures/
└── features/
```

### 5.4 Naming Convention

Use descriptive, behavior-focused filenames that communicate what each test verifies.

Avoid generic filenames such as:

```text
login-form.test.ts
login-page.test.ts
```

Prefer:

```text
login-form-validation.test.ts
login-form-submission.test.tsx
login-page-authentication.integration.test.tsx
login.spec.ts
```

Follow these naming patterns:

| Test type | Naming pattern | Example |
|---|---|---|
| Unit | `<component-or-module>-<behavior>.test.ts(x)` | `login-form-validation.test.ts` |
| Integration | `<page-or-template>-<workflow>.integration.test.ts(x)` | `login-page-authentication.integration.test.tsx` |
| E2E | `<feature-or-workflow>.spec.ts` | `login.spec.ts` |

Use `.test` for both unit and integration tests. Include `.integration` in integration test filenames to distinguish them from unit tests.

### 5.5 Mock File Rules

- Keep mock files in the same `__tests__` folder as the tests that use them.
- Use descriptive names such as `login-form.mock.ts` or `login-page.mock.ts`.
- Keep mock data focused and representative of realistic application scenarios.
- Avoid placing test-specific mocks in unrelated component or page directories.
- Shared test infrastructure, reusable factories, and common setup utilities may live in a central test-support location.
- Avoid duplicating shared mock infrastructure when it can be reused without coupling unrelated tests.

### 5.6 Organization Rules

- Unit tests belong inside the component or module's `__tests__` folder.
- Integration tests belong inside the template or page's `__tests__` folder.
- Related mocks belong inside the same `__tests__` folder as their tests.
- E2E tests belong in the dedicated `e2e` directory.
- Do not place integration tests inside individual component directories when they test a page or template workflow.
- Do not place E2E tests inside application component or page directories.
- Apply these conventions consistently across features and pages.

## 6. React Testing Library Best Practices

### 6.1 Query Priority

Prefer queries that reflect how users interact with the application.

Use this priority:

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByTestId` as a last resort

Prefer accessible queries because they encourage accessible application markup.

Avoid relying on implementation-specific selectors such as CSS classes or internal component structure.

### 6.2 User Interactions

Prefer `userEvent` over `fireEvent` for user interactions.

```tsx
const user = userEvent.setup();

await user.click(screen.getByRole('button', { name: /submit/i }));
await user.type(screen.getByLabelText(/email/i), 'user@example.com');
```

Use `fireEvent` only when a low-level event needs to be triggered directly and `userEvent` does not provide the required behavior.

### 6.3 Assertions

- Assert what the user can observe.
- Verify meaningful content, state changes, and interactions.
- Avoid asserting internal implementation details.
- Avoid excessive assertions that make tests brittle.
- Prefer clear, focused test cases over large tests covering unrelated behavior.

## 7. Mocking and API Testing

Mock only external dependencies or boundaries that need isolation.

Prefer realistic behavior over excessive mocking.

### 7.1 API Mocking

Use MSW to intercept network requests where appropriate.

This allows tests to exercise the application's actual request and response handling without depending on a live backend.

Test relevant scenarios:

- Successful responses.
- Empty responses.
- Validation errors.
- Authentication and authorization failures.
- Server errors.
- Network failures.
- Loading states.

### 7.2 Mocking Rules

- Keep mocks minimal and purposeful.
- Mock external services when necessary.
- Avoid mocking the component or function whose behavior is being tested.
- Do not mock internal implementation details unnecessarily.
- Use realistic response shapes.
- Reset or restore mocks between tests to prevent state leakage.
- Store test-specific mock files in the corresponding `__tests__` folder.
- Keep shared mock infrastructure separate from test-specific mocks.

## 8. Async Testing and Timer Management

Choose the appropriate query based on the expected behavior.

| Query | Purpose |
|---|---|
| `getBy*` | Element should exist immediately |
| `queryBy*` | Check whether an element exists without throwing |
| `findBy*` | Element should appear asynchronously |
| `waitFor` | Wait for an assertion to become true |

Example:

```tsx
expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
```

Best practices:

- Prefer `findBy*` for asynchronously appearing elements.
- Use `waitFor` when waiting for an assertion or state transition that is not directly represented by a query.
- Avoid arbitrary delays and hardcoded sleeps.
- Use fake timers only when testing timer-dependent behavior.
- Restore real timers after tests that use fake timers.
- Avoid unnecessary `async` and `await` when no asynchronous behavior exists.

## 9. Test Organization and Code Quality

Keep tests focused, readable, and easy to maintain.

### 9.1 Structure

- Use descriptive test names that explain the expected behavior.
- Group related test cases with `describe` where useful.
- Use `beforeEach` and `afterEach` for shared setup and cleanup.
- Avoid deeply nested `describe` blocks.
- Keep setup logic simple and explicit.
- Extract repeated setup into helpers when it improves readability.

### 9.2 Test Size

- Keep test cases focused on one behavior or closely related behaviors.
- Treat tests exceeding approximately 200–300 lines as a signal to review for unnecessary complexity.
- Do not split tests arbitrarily just to meet a line limit.
- Prefer clear test structure over rigid size restrictions.

### 9.3 Maintainability

- Avoid brittle assertions tied to implementation details.
- Avoid duplicated test logic where reusable helpers improve clarity.
- Do not introduce abstractions that make simple tests harder to understand.
- Keep test names and descriptions aligned with actual behavior.

## 10. Accessibility and Visual Testing

Accessibility should be considered throughout component and integration testing.

Where appropriate, verify:

- Interactive elements have accessible names.
- Form controls have associated labels.
- Keyboard interactions work correctly.
- Focus behavior is appropriate.
- Dialogs and menus expose the correct roles and states.
- Error messages are accessible to assistive technologies.
- Semantic HTML is used appropriately.

Use automated accessibility checks where they provide value, but do not treat them as a replacement for meaningful interaction testing.

### 10.1 Visual Regression

Use visual regression testing for important interfaces where visual consistency matters.

Examples:

- Shared design-system components.
- Complex layouts.
- Responsive page layouts.
- Critical user-facing screens.

Avoid introducing visual snapshots for every component without a clear maintenance benefit.

## 11. Playwright and E2E Testing Standards

Use Playwright to test important application workflows in a real browser.

### 11.1 Best Practices

- Use accessible locators such as `getByRole`, `getByLabel`, and `getByText`.
- Prefer user-facing selectors over fragile CSS selectors.
- Use stable test IDs only when accessible selectors are insufficient.
- Test complete user journeys.
- Cover critical business workflows.
- Keep E2E tests independent and repeatable.
- Avoid unnecessary dependencies between test cases.
- Use fixtures for reusable setup.
- Capture useful diagnostics such as screenshots, traces, and videos when tests fail.

### 11.2 E2E Naming and Location

- Store E2E tests in the dedicated `e2e` directory.
- Use `.spec` for all E2E test files.
- Keep E2E support files, fixtures, and step definitions organized within the E2E structure.

### 11.3 Cucumber

Use Cucumber when business-readable scenarios and collaboration with non-developers provide real value.

Do not introduce BDD ceremony for straightforward tests that are easier to maintain with regular Playwright tests.

## 12. Test Data and Isolation

Tests must be independent and deterministic.

- Each test should establish its own required state.
- Avoid relying on execution order.
- Clean up resources and restore modified state.
- Avoid sharing mutable test data between test cases.
- Use factories or fixtures for repeatable test data.
- Keep test data realistic and easy to understand.
- Ensure mocks and handlers are reset appropriately.
- Avoid depending on external services or unstable network conditions.

## 13. Coverage and CI Reliability

Use coverage as a tool for identifying untested areas, not as the sole measure of test quality.

Prioritize:

- Critical business logic.
- Important user workflows.
- Complex state transitions.
- Error handling.
- Shared components and utilities.
- Regression-prone areas.

### 13.1 CI Standards

- Run unit and integration tests in CI.
- Run E2E tests against a predictable test environment.
- Ensure tests are deterministic and repeatable.
- Avoid tests that depend on execution order.
- Review flaky tests and address their root causes.
- Use coverage thresholds where they support meaningful quality goals.
- Ensure failures provide enough information to diagnose problems.

## 14. AI Testing Decision Guidelines

When generating or modifying tests, AI agents must follow these rules:

1. Identify the behavior and responsibility being tested before choosing a test type.
2. Use unit tests for isolated components, hooks, utilities, and modules.
3. Use integration tests for meaningful interactions between components and application layers within templates or pages.
4. Use E2E tests for complete user journeys and critical business workflows.
5. Place unit tests in the component or module's `__tests__` folder.
6. Place integration tests in the template or page's `__tests__` folder.
7. Place corresponding mock files in the same `__tests__` folder as the tests that use them.
8. Use descriptive, behavior-focused `.test` filenames for unit and integration tests.
9. Include `.integration` in integration test filenames to distinguish them from unit tests.
10. Use `.spec` filenames for E2E tests.
11. Follow existing project conventions when extending established test structures.
12. Prefer accessible queries and realistic user interactions.
13. Use MSW for API-level mocking where appropriate.
14. Avoid unnecessary mocks and implementation-detail assertions.
15. Cover success, loading, empty, and error states where relevant.
16. Keep tests isolated, deterministic, and maintainable.

The goal is to produce a reliable test suite that gives confidence in application behavior while remaining easy to understand, maintain, and extend.