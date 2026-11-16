---
name: frontend-code-review
description: Standards and guidelines for reviewing frontend code, pull requests, architecture, React components, hooks, state management, TypeScript, security, accessibility, performance, and testing compliance. Use when reviewing, auditing, refactoring, or improving frontend applications.
---

# Frontend Code Review

## 1. Core Review Principles

Conduct code reviews to improve correctness, security, maintainability, performance, and consistency across the application.

Follow these principles:

- Review code against established project architecture, engineering standards, and business requirements.
- Prioritize correctness, security, reliability, and maintainability over personal coding preferences.
- Evaluate implementation decisions in the context of the application's architecture and requirements.
- Identify meaningful defects and risks rather than enforcing arbitrary stylistic restrictions.
- Prefer simple, readable, and maintainable solutions over unnecessary abstractions.
- Verify that changes are adequately tested.
- Avoid introducing unnecessary complexity or dependencies.
- Provide actionable feedback that explains the problem, its impact, and a practical solution.
- Distinguish objectively verifiable defects from recommendations and personal preferences.
- Consider the impact of changes on existing features, shared components, and dependent modules.

A code review should help prevent defects and improve engineering quality without unnecessarily blocking reasonable implementation choices.

## 2. Architecture and Directory Boundaries

Review the application structure against the established frontend architecture.

### 2.1 Screaming Architecture

Organize application code around business domains and features rather than allowing technical categories to become unrelated dumping grounds.

Verify that:

- Feature-specific code lives within its corresponding feature directory.
- Features own their domain-specific components, hooks, API clients, types, and utilities.
- Shared components and utilities are genuinely reusable across multiple features.
- Business-specific logic does not unnecessarily leak into global shared modules.
- Feature boundaries remain understandable and maintainable.
- New functionality is placed in the appropriate architectural layer.

Prefer structures such as:

```bash
src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── payments/
│   └── users/
├── hooks/
├── lib/
├── services/
└── types/
```

Adapt the exact directory structure to the established project architecture. Do not enforce this example as a universal directory layout.

### 2.2 Feature Isolation

Verify that:

- Features do not depend on unrelated feature internals unnecessarily.
- Cross-feature communication follows established application boundaries.
- Shared functionality is exposed through clear public interfaces.
- Circular dependencies are avoided.
- Features do not bypass another feature's public API to access internal implementation details.
- Domain-specific types and business rules remain owned by the appropriate feature.

### 2.3 Monorepo Boundaries

For monorepo applications, verify dependency direction and package ownership.

- Shared packages must not import from application-specific packages.
- Applications may consume shared packages through their public interfaces.
- Packages should have clearly defined responsibilities.
- Avoid circular dependencies between applications and packages.
- Avoid coupling shared packages to a specific application's runtime or business logic.
- Ensure package exports do not expose unnecessary internal implementation details.
- Follow established workspace dependency and versioning conventions.

Example:

```bash
apps/
├── web/
└── admin/

packages/
├── ui/
├── utilities/
├── types/
└── configuration/
```

The `packages/` directory should contain reusable functionality rather than code that belongs to an individual application.

## 3. Component and Hook Design

Review component and hook boundaries for cohesion, reusability, readability, and responsibility.

### 3.1 Component Responsibilities

Verify that:

- Components have clear and focused responsibilities.
- Components do not combine unrelated business logic and presentation unnecessarily.
- Props are explicit, appropriately typed, and understandable.
- Components avoid excessive conditional rendering and deeply nested logic.
- Reusable behavior is extracted when it meaningfully improves maintainability.
- Components do not introduce unnecessary abstractions.
- Component composition is preferred over unnecessarily complex inheritance or configuration patterns.

### 3.2 One Primary Component Per File

Prefer one primary React component per file.

Small, tightly related helper components may remain in the same file when they:

- Are private implementation details.
- Have a clear relationship with the primary component.
- Are unlikely to be reused independently.
- Do not make the file difficult to understand.

Recommend extraction when a component has an independent responsibility, meaningful complexity, or reuse potential.

Do not reject a change simply because a file contains more than one small component.

### 3.3 Component File Size

Use approximately 200 lines of code as a review signal for component complexity.

When a component exceeds this threshold, investigate:

- Whether it has multiple responsibilities.
- Whether presentation and business logic are unnecessarily coupled.
- Whether repeated UI structures should be extracted.
- Whether complex state management should be separated.
- Whether conditional rendering can be simplified.

Do not require extraction solely to satisfy a line-count limit. A cohesive component may reasonably exceed 200 lines.

### 3.4 Custom Hook Responsibilities

Custom hooks should encapsulate reusable stateful behavior, side effects, or domain-specific logic.

Verify that:

- Hooks have clear responsibilities.
- Hook dependencies are correct.
- Side effects are appropriately managed.
- State is not unnecessarily duplicated.
- Hooks do not introduce hidden coupling between unrelated components.
- Reusable behavior is extracted when it improves clarity.
- Hooks follow React's Rules of Hooks.

Use approximately 300 lines as a review signal for custom hook complexity.

When a hook exceeds this threshold, investigate whether its responsibilities should be separated into smaller hooks or functions.

Do not split hooks simply to reduce line count.

### 3.5 Component and Hook Granularity

Prefer decomposition based on:

- Responsibility.
- Cohesion.
- Reuse potential.
- Cognitive complexity.
- State ownership.
- Testability.
- Architectural boundaries.

Avoid creating excessive components or hooks that only introduce indirection without meaningful separation of concerns.

## 4. Component Responsibilities and Data Boundaries

Evaluate component responsibilities using the project's component architecture and Atomic Design conventions where applicable.

### 4.1 Atoms and Molecules

Reusable design-system components should primarily remain presentational.

Examples include:

- Buttons.
- Inputs.
- Labels.
- Badges.
- Dialog primitives.
- Dropdown primitives.
- Reusable form controls.

Verify that:

- Generic UI components do not depend on feature-specific business logic.
- Components receive data and behavior through explicit props or composition.
- Components expose appropriate interaction callbacks.
- Components remain reusable across application features.
- Business-specific data fetching does not unnecessarily leak into generic UI primitives.

Do not interpret Atomic Design as an absolute prohibition against all logic in molecules. Responsibilities should be determined by the component's purpose and reuse boundaries.

### 4.2 Feature Organisms and Widgets

Feature-specific organisms and widgets may consume feature-level hooks and services when doing so keeps the feature cohesive.

Verify that:

- Domain-specific responsibilities remain within the appropriate feature.
- Data access uses established query and mutation abstractions.
- Components do not duplicate business logic.
- Query cache behavior is respected.
- Components remain reasonably testable.
- Cross-feature dependencies are avoided or explicitly justified.

### 4.3 Templates and Pages

Templates and pages should coordinate application composition and page-level workflows.

Verify that:

- Page-level responsibilities are clearly defined.
- Multiple widgets and feature components are composed appropriately.
- Page-level state is owned at the appropriate level.
- Navigation and route-specific behavior are handled consistently.
- Business logic is not unnecessarily concentrated in page components.
- Data dependencies are clear and predictable.

Pages may consume query hooks directly when appropriate. The important requirement is that data access remains encapsulated and consistent with the project's established query architecture.

## 5. State Management and CQRS

Review how application state and server data are managed.

### 5.1 State Ownership

Distinguish between different categories of state:

| State type | Examples | Preferred ownership |
|---|---|---|
| Local UI state | Modal visibility, input focus, expanded sections | Component |
| Shared client state | User preferences, application-wide UI state | Context or state manager |
| Server state | Users, payments, transactions, API responses | Query/cache layer |
| Form state | Field values, validation, submission status | Form state management |
| URL state | Filters, pagination, selected tabs | Router or URL parameters |

Verify that:

- State is owned at the lowest appropriate level.
- State is not unnecessarily duplicated.
- Derived state is computed rather than maintained separately when practical.
- Global state is not used for values that only one component needs.
- Server state is not unnecessarily copied into local or global state.
- State transitions are predictable and maintainable.

### 5.2 CQRS: Queries

Queries represent read operations.

Encapsulate application read operations within dedicated query hooks or established data-access abstractions.

Examples:

```tsx
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });
}

function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userService.getUser(userId),
    enabled: Boolean(userId),
  });
}
```

Verify that:

- Query logic is not arbitrarily duplicated across components.
- Query keys are consistent and sufficiently specific.
- Query functions are separated from presentation logic.
- Query hooks expose appropriate loading, error, and data states.
- Dependent queries are enabled only when their dependencies are available.
- Query hooks avoid unrelated imperative side effects.
- Cache behavior and stale-data requirements are handled appropriately.

Avoid scattered raw query implementations when the project has an established query-hook abstraction.

### 5.3 CQRS: Commands

Commands represent operations that change application or server state.

Encapsulate write operations using explicit mutation hooks or action handlers.

Example:

```tsx
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
}
```

Verify that:

- Mutations are clearly separated from read operations.
- Mutation payloads are appropriately typed.
- Successful operations update or synchronize relevant server state.
- Errors are handled appropriately.
- Loading and submission states are exposed where needed.
- Duplicate submissions are prevented where appropriate.
- Side effects are intentional and predictable.

### 5.4 Server-State Cache Management

Do not require cache invalidation for every successful mutation.

Choose an appropriate synchronization strategy based on the operation and query library.

Possible strategies include:

- Query invalidation.
- Direct cache updates.
- Optimistic updates with rollback.
- Refetching.
- Cache removal when data is no longer valid.

Verify that:

- Related cached queries remain consistent.
- Cache updates do not introduce stale or contradictory data.
- Optimistic updates handle failure and rollback correctly.
- Query keys and invalidation scopes are appropriate.
- Unnecessary refetching is avoided.

### 5.5 Separation of Commands and Queries

- Queries should not perform unrelated state-changing operations.
- Commands should not be used merely to retrieve data.
- Local UI state should not be forced into server mutation abstractions.
- Side effects should be placed in the appropriate event handlers, mutation lifecycle, or dedicated effect abstractions.

## 6. React Best Practices

Review React implementations for correctness, predictable rendering, and maintainability.

### 6.1 Hooks

Verify that:

- Hooks are called at the top level of React components or custom hooks.
- Hooks are not called conditionally or inside loops.
- Effect dependencies are complete and correct.
- Custom hooks follow the Rules of Hooks.
- State updates do not depend on stale values.
- Effects clean up subscriptions, listeners, and other external resources when necessary.

### 6.2 useEffect

Avoid using effects for operations that can be performed during rendering or directly in event handlers.

Review effects for:

- Unnecessary derived-state synchronization.
- Missing dependencies.
- Infinite render loops.
- Stale closures.
- Unnecessary network requests.
- Missing cleanup.
- Duplicated side effects.
- Incorrect handling of asynchronous operations.

Use effects primarily to synchronize React with external systems.

Do not automatically reject an effect simply because it contains state updates. Evaluate whether the effect has a legitimate synchronization responsibility.

### 6.3 Rendering and Reconciliation

Verify that:

- Lists use stable and appropriate keys.
- Components do not mutate props or state.
- Rendering remains free from unintended side effects.
- Conditional rendering is understandable.
- Unnecessary component remounting is avoided.
- State is preserved appropriately across renders.

Avoid array indexes as keys when list items can be reordered, inserted, or removed and stable identifiers are available.

### 6.4 Memoization

Use `React.memo`, `useMemo`, and `useCallback` when they provide measurable or meaningful benefits.

Verify that:

- Memoization addresses an actual performance concern.
- Dependencies are correct.
- Memoization does not introduce stale values.
- Expensive calculations are optimized when necessary.
- Referential stability is maintained where it matters.

Do not require memoization on every component or callback.

### 6.5 Event Handling

Verify that:

- Event handlers have clear responsibilities.
- Event handlers do not contain unnecessarily complex business logic.
- Async operations handle failures appropriately.
- Duplicate actions are prevented where necessary.
- Event propagation is handled intentionally.
- User interactions provide appropriate feedback.

## 7. TypeScript and Type Safety

Review TypeScript code for explicit, accurate, and maintainable types.

### 7.1 Type Definitions

Verify that:

- Component props are appropriately typed.
- API request and response types are defined.
- Shared domain types are reused appropriately.
- Function parameters and return values are clear.
- Generic types are used where they improve reuse and type safety.
- Optional properties are used intentionally.
- Null and undefined states are handled correctly.

Prefer deriving types from authoritative schemas or existing domain definitions rather than duplicating them unnecessarily.

### 7.2 Avoid Unsafe Types

Avoid:

- Unnecessary `any`.
- Unchecked type assertions.
- Excessive non-null assertions.
- Broad types that hide meaningful constraints.
- Duplicate type definitions that can drift apart.

Prefer:

- Explicit interfaces and type aliases.
- Generics.
- Discriminated unions.
- Type guards.
- Narrowing.
- Runtime validation for untrusted external data.

### 7.3 Type Assertions

Do not automatically reject every type assertion.

Type assertions may be appropriate at well-understood boundaries, such as integrations with libraries that expose incomplete type definitions.

However:

- Avoid `as unknown as` when a safer type design is possible.
- Avoid assertions that merely suppress compiler errors.
- Require a clear justification for unsafe assertions.
- Validate external data at runtime rather than trusting compile-time types.

Use Zod or another established validation library where runtime schema validation is appropriate.

### 7.4 API and External Data

Verify that:

- API responses are not blindly trusted.
- External data is validated where necessary.
- Error responses are represented accurately.
- Optional and nullable fields are handled correctly.
- Sensitive values are not exposed through types or client-side code unnecessarily.

## 8. Web Security

Treat security findings as high priority and evaluate the actual exploitability and impact of each issue.

### 8.1 XSS Prevention

Prevent cross-site scripting vulnerabilities.

Verify that:

- Dynamic content is rendered through React's normal escaping behavior.
- Untrusted HTML is not inserted directly into the DOM.
- `dangerouslySetInnerHTML` is avoided unless necessary.
- HTML that must be rendered is sanitized using an appropriate sanitizer, such as DOMPurify.
- Sanitization is configured for the intended HTML context.
- URLs and other user-controlled values are validated before use.

Do not assume that TypeScript types or client-side validation make untrusted content safe.

### 8.2 CSRF Protection and Authentication

Review authentication and session handling.

Verify that:

- High-privilege credentials are not unnecessarily stored in client-accessible storage.
- Session cookies use appropriate `HttpOnly`, `Secure`, and `SameSite` attributes.
- Cookie-based authentication has appropriate CSRF protection.
- CSRF tokens are handled consistently where required.
- Authentication state is not treated as proof of server-side authorization.
- Token refresh and expiration are handled safely.
- Logout and session invalidation behavior are correct.

`SameSite` cookies can reduce CSRF exposure but should not automatically be treated as a complete CSRF defense in every application.

Prefer secure server-managed sessions where appropriate to the application's authentication architecture.

### 8.3 Sensitive Data Handling

Verify that:

- Credentials and high-privilege tokens are not stored unnecessarily in local storage or session storage.
- Sensitive PII is not exposed in client-side logs.
- Secrets are not embedded in client bundles.
- Sensitive data is not unnecessarily included in URLs.
- Error reporting and analytics do not expose credentials or private information.
- Data is only retained for as long as required.
- Sensitive values are handled according to the application's security requirements.

Client-side encryption does not provide meaningful protection against malicious scripts executing in the same origin when the decryption capability is also available to those scripts.

### 8.4 Open Redirects and URL Validation

Verify that:

- Post-login redirect destinations are validated.
- User-controlled redirect URLs cannot redirect users to untrusted destinations.
- External links are handled safely.
- URL schemes are restricted where appropriate.
- Redirect allowlists are used when required.
- Route parameters are not blindly trusted.

### 8.5 Content Security Policy

Review changes for compatibility with the application's Content Security Policy.

Avoid introducing:

- `eval`.
- `new Function`.
- Unnecessary inline scripts.
- Unsafe script execution.
- Untrusted script sources.

Do not confuse React event-handler syntax such as `onClick` with raw inline HTML event-handler attributes. Evaluate the actual browser behavior and CSP configuration.

### 8.6 Authorization and Access Control

Verify that:

- Client-side route guards are not treated as the only authorization mechanism.
- Sensitive operations are protected by server-side authorization.
- UI visibility does not replace permission enforcement.
- Role and permission checks are consistent with the application's security model.
- Unauthorized users cannot access sensitive functionality through alternate routes or direct API calls.

### 8.7 Dependencies and Supply Chain

Review dependencies for:

- Known vulnerabilities.
- Suspicious or unnecessary packages.
- Unmaintained dependencies.
- Unexpected dependency additions.
- Unsafe installation or execution scripts.
- Unnecessary exposure of third-party scripts.

## 9. Styling and Design System Compliance

Review styling for consistency, responsiveness, maintainability, and adherence to the project's design system.

### 9.1 Design Tokens

Prefer established design tokens and configured Tailwind theme values.

Verify that:

- Shared spacing and sizing conventions are followed.
- Colors come from the established theme or design tokens.
- Typography is consistent.
- Components reuse shared design-system values.
- Repeated styling patterns are extracted when appropriate.

Avoid arbitrary Tailwind values when an existing token or shared design value satisfies the requirement.

Examples of arbitrary values:

```tsx
<div className="h-[20px] w-[350px] top-[13px]" />
```

Arbitrary values are acceptable when there is a legitimate design requirement that cannot reasonably be represented by existing tokens.

Do not reject them automatically. Evaluate whether the value is intentional, justified, and consistent with the design system.

### 9.2 Styling Maintainability

Verify that:

- Styling responsibilities are clearly separated.
- Repeated styles are reused appropriately.
- Conditional styling remains readable.
- Unused styles are removed.
- Responsive behavior is intentional.
- Component styling does not unnecessarily leak into unrelated components.

### 9.3 Responsive Design

Verify that:

- Layouts behave correctly across supported viewport sizes.
- Content does not overflow unexpectedly.
- Interactive controls remain usable on smaller screens.
- Responsive breakpoints follow project conventions.
- Important content is not hidden unintentionally.
- Layout changes preserve accessibility and usability.

### 9.4 UI Consistency

Check consistency in:

- Spacing.
- Typography.
- Colors.
- Borders.
- Shadows.
- Component states.
- Loading indicators.
- Empty states.
- Error states.
- Responsive behavior.

Use existing design-system components before introducing new implementations of established UI patterns.

## 10. Code Quality and Cognitive Complexity

Review code for readability, cohesion, duplication, and unnecessary complexity.

### 10.1 Cognitive Complexity

Identify:

- Deeply nested conditionals.
- Complex ternary expressions.
- Large functions with multiple responsibilities.
- Excessive boolean combinations.
- Long conditional rendering chains.
- Repeated branching logic.
- Difficult-to-follow control flow.

Prefer:

- Early returns.
- Guard clauses.
- Meaningfully named helper functions.
- Smaller cohesive functions.
- Clear conditional expressions.
- Appropriate composition.
- Explicit state transitions.

Do not extract every conditional into a helper. Extraction should improve readability and clarify responsibilities.

### 10.2 Function and Component Responsibilities

Verify that:

- Functions have clear responsibilities.
- Components are not overloaded with unrelated logic.
- Business rules are not unnecessarily duplicated.
- Data transformations are placed appropriately.
- Helper functions have meaningful names.
- Side effects are easy to identify.
- Functions do not unexpectedly mutate shared state.

### 10.3 Duplication

Identify duplicated:

- Business logic.
- Validation rules.
- API request handling.
- Formatting logic.
- Complex UI patterns.
- Permission checks.

Recommend shared abstractions when duplication creates a meaningful maintenance risk.

Do not introduce abstractions for small, unrelated code fragments merely because they look similar.

### 10.4 Naming and Readability

Verify that:

- Variables, functions, components, and types have descriptive names.
- Names communicate intent.
- Boolean names read naturally.
- Abbreviations are understandable and consistent.
- Unnecessary comments are avoided.
- Comments explain non-obvious decisions rather than restating code.

### 10.5 Error Handling

Review how errors are detected, propagated, and presented.

Verify that:

- Async operations handle rejected promises.
- Errors are not silently swallowed.
- User-facing errors are understandable.
- Sensitive internal details are not exposed.
- Error boundaries are used where appropriate.
- Fallback UI provides a useful recovery path.
- Errors are reported through the established observability system.
- Expected business errors are distinguished from unexpected application failures.

Avoid generic catch blocks that hide failures without meaningful handling.

## 11. Performance and Optimization

Review performance based on actual application behavior and likely impact.

### 11.1 Rendering Performance

Look for:

- Unnecessary re-renders.
- Expensive computations during rendering.
- Large component trees with avoidable updates.
- Unnecessary state changes.
- Expensive list rendering.
- Unstable keys.
- Unnecessary effects.
- Incorrect memoization.

Recommend optimization when there is a meaningful performance concern.

Do not introduce memoization or complex performance abstractions without a clear benefit.

### 11.2 Bundle Size

Verify that:

- Large dependencies are justified.
- Unused dependencies are removed.
- Code splitting is used where appropriate.
- Heavy components are lazy-loaded when beneficial.
- Tree-shaking is not unnecessarily obstructed.
- Unused exports and duplicate implementations are avoided.

### 11.3 Network Performance

Review:

- Unnecessary API requests.
- Duplicate requests.
- Request waterfalls.
- Missing pagination or appropriate data limits.
- Unnecessary polling.
- Cache configuration.
- Request cancellation where appropriate.
- Large payloads and unnecessary data transfer.

### 11.4 Resource Management

Verify that:

- Event listeners are cleaned up.
- Subscriptions are unsubscribed.
- Timers are cleared.
- Observers are disconnected.
- Long-running operations are handled appropriately.
- Object URLs and other browser resources are released when no longer needed.

## 12. Accessibility

Ensure that application changes preserve and improve accessibility.

### 12.1 Semantic HTML

Verify that:

- Native HTML elements are used appropriately.
- Buttons use `<button>`.
- Navigation uses appropriate link elements.
- Form controls have associated labels.
- Headings follow a meaningful hierarchy.
- Interactive elements expose appropriate roles and names.

Do not use generic elements such as `<div>` or `<span>` as interactive controls when native semantic elements are appropriate.

### 12.2 Keyboard Accessibility

Verify that:

- Interactive controls can be reached by keyboard.
- Keyboard interactions work as expected.
- Focus indicators are visible.
- Focus order is logical.
- Dialogs manage focus appropriately.
- Keyboard users can dismiss overlays where appropriate.
- Focus is restored appropriately after modal interactions.

### 12.3 ARIA

Use ARIA attributes when native HTML semantics are insufficient.

Verify that:

- ARIA roles are appropriate.
- Accessible names are meaningful.
- `aria-expanded`, `aria-selected`, and other state attributes reflect actual state.
- Live regions are used appropriately.
- ARIA attributes do not contradict native element semantics.

Avoid unnecessary ARIA where semantic HTML already provides the required behavior.

### 12.4 Forms and Feedback

Verify that:

- Inputs have accessible labels.
- Validation errors are associated with the relevant fields.
- Error messages are perceivable to assistive technologies.
- Required fields are communicated appropriately.
- Loading and success states are understandable.
- Dynamic updates are announced where necessary.

## 13. Testing Compliance

Review tests against the established `frontend-testing` standards.

Tests should provide confidence in observable application behavior rather than implementation details.

### 13.1 Test Types

Verify that the appropriate test type is used.

| Test type | Responsibility |
|---|---|
| Unit | Individual components, hooks, utilities, and modules |
| Integration | Interactions between components and application layers within templates or pages |
| E2E | Complete user journeys and critical business workflows |

Do not classify tests solely by their filenames. Evaluate the behavior and boundaries they verify.

### 13.2 Test File Placement

Enforce the following conventions:

**Unit tests**

- Must live in the component or module's `__tests__` folder.
- Must be colocated with the implementation being tested.

**Integration tests**

- Must live in the template or page's `__tests__` folder.
- Must verify meaningful interactions between multiple parts of the page or template.

**Mocks**

- Related mock files must live in the same `__tests__` folder as the tests that use them.
- Shared test infrastructure and reusable factories may live in central test-support directories.

**E2E tests**

- Must live in a dedicated E2E directory, separate from application source files.

### 13.3 Test Naming

Use descriptive, behavior-focused filenames.

| Test type | Naming convention | Example |
|---|---|---|
| Unit | `<component-or-module>-<behavior>.test.ts(x)` | `login-form-validation.test.ts` |
| Integration | `<page-or-template>-<workflow>.integration.test.ts(x)` | `login-page-authentication.integration.test.tsx` |
| E2E | `<feature-or-workflow>.spec.ts` | `login.spec.ts` |

Rules:

- Unit and integration tests must use `.test` extensions.
- Integration tests must include `.integration` in their filenames.
- E2E tests must use `.spec` extensions.
- Prefer behavior-focused names over generic filenames.
- Do not use `.spec` for unit or integration tests.

### 13.4 Test Quality

Verify that:

- Tests prioritize observable behavior.
- Tests avoid assertions against private functions and internal component state.
- Accessible queries are preferred.
- `userEvent` is preferred for realistic interactions.
- Mocks are minimal and purposeful.
- MSW is used for network-level mocking where appropriate.
- Tests cover relevant success, loading, empty, and error states.
- Tests remain deterministic and independent.
- Shared state and mocks are reset appropriately.

### 13.5 Async Testing

Verify appropriate use of React Testing Library queries:

| Query | Expected use |
|---|---|
| `getBy*` | Element should exist immediately |
| `queryBy*` | Check whether an element exists without throwing |
| `findBy*` | Element should appear asynchronously |
| `waitFor` | Wait for an assertion or asynchronous condition |

Reject:

- Arbitrary `setTimeout` delays used to synchronize tests.
- Unnecessary hardcoded sleeps.
- Unresolvable `waitFor` conditions.
- Missing cleanup of fake timers.
- Tests that depend on unpredictable network behavior.

Do not treat `findBy*` as inherently fail-fast. It waits for the expected element within its configured timeout.

### 13.6 Test Assertions

- Prefer assertions against accessible content and user-visible behavior.
- Avoid assertions against internal implementation details.
- Avoid CSS class assertions as a substitute for behavior testing.
- Avoid computed-style assertions in ordinary unit and integration tests when they merely test implementation details.
- Allow visual regression tests and targeted visual assertions when visual behavior is explicitly the requirement.

### 13.7 Test Structure and Size

- Prefer focused and descriptive test cases.
- Allow reasonable `describe` nesting when it improves organization.
- Avoid excessive nesting that makes tests difficult to scan.
- Treat test files exceeding approximately 200–300 lines as a review signal.
- Do not reject a test file solely because it exceeds a line-count threshold.
- Recommend splitting tests when doing so improves clarity and maintainability.

## 14. Error Handling and Application Reliability

Review changes for predictable behavior under failure conditions.

Verify that:

- Loading, success, empty, and failure states are handled.
- Network failures do not leave the interface in an inconsistent state.
- Failed mutations communicate the outcome to users.
- Retry behavior is appropriate and does not duplicate unsafe operations.
- Error boundaries are positioned appropriately.
- Fallback experiences remain usable.
- Data is not accidentally lost during recoverable failures.
- Unexpected errors are reported through approved monitoring tools.
- Application recovery behavior is consistent with business requirements.

Consider edge cases such as:

- Expired sessions.
- Missing permissions.
- Empty API responses.
- Invalid user input.
- Slow network connections.
- Duplicate submissions.
- Partial failures.
- Unexpected server responses.

## 15. Dependencies and Project Configuration

Review dependency and configuration changes carefully.

### 15.1 Dependency Management

Verify that:

- New dependencies provide meaningful value.
- Existing dependencies cannot reasonably provide the required functionality.
- Package versions follow project conventions.
- Packages are actively maintained where possible.
- Known security vulnerabilities are considered.
- Unnecessary packages are not introduced.
- Dependency changes do not create avoidable bundle-size increases.

### 15.2 Configuration

Review changes to:

- Build configuration.
- TypeScript configuration.
- Linting rules.
- Testing configuration.
- Environment variables.
- CI pipelines.
- Package scripts.
- Routing configuration.
- Framework-specific settings.

Verify that configuration changes are intentional and do not silently weaken existing engineering standards.

### 15.3 Environment Variables

Verify that:

- Environment-specific values are configured correctly.
- Private secrets are not exposed to client-side bundles.
- Required variables are validated where appropriate.
- Sensitive values are not committed to source control.
- Example environment files do not contain real credentials.

## 16. Code Review Severity and Reporting

Every finding should communicate its severity, location, impact, and recommended action.

### 16.1 Severity Levels

Use the following severity levels:

| Severity | Meaning | Expected action |
|---|---|---|
| Critical | Exploitable security vulnerability, sensitive data exposure, or severe application failure | Must fix before merge |
| High | Significant functional defect, serious architectural violation, or major regression | Must fix before merge |
| Medium | Maintainability, performance, reliability, or testing concern with meaningful impact | Should be fixed before merge |
| Low | Minor improvement, localized inconsistency, or non-critical concern | Optional or follow-up |

Assign severity based on actual impact, likelihood, and scope.

Do not label every architectural preference as High severity.

### 16.2 Finding Requirements

Each actionable finding should include:

1. **Severity:** Critical, High, Medium, or Low.
2. **Location:** Relevant file and line or code section.
3. **Problem:** What is wrong.
4. **Impact:** Why it matters and what could happen.
5. **Recommendation:** A practical correction.

Example:

```text
[High] Prevent unauthorized access to the user management route

File: src/features/users/pages/users-page.tsx

Problem:
The page checks whether a user is authenticated but does not
account for the required user-management permission.

Impact:
Authenticated users without the appropriate role may be shown
functionality they are not authorized to access. The server must
also enforce authorization independently.

Recommendation:
Use the application's established permission-checking mechanism
for the UI and verify that the corresponding API enforces the
same authorization requirement.
```

### 16.3 Review Feedback Standards

- Explain why the implementation is problematic.
- Describe the actual consequence rather than making vague claims.
- Suggest a practical solution.
- Reference the relevant engineering standard when applicable.
- Avoid unnecessarily confrontational language.
- Avoid repeating the same finding across multiple locations when one finding can describe the underlying issue.
- Do not report speculative problems as confirmed defects.
- Clearly label optional improvements.
- Do not request changes merely because another implementation is personally preferred.

### 16.4 Distinguish Defects from Recommendations

Use actionable findings for objectively identifiable issues.

Use suggestions for improvements that are beneficial but not required for correctness.

Examples:

**Actionable finding:**

A component stores a derived value in state and updates it through an effect, creating an unnecessary render cycle and potential stale state.

**Suggestion:**

A small helper function could improve readability, but the existing implementation is correct and maintainable.

Do not block a pull request for a suggestion unless it violates an explicit project requirement or creates a meaningful risk.

## 17. AI Code Review Guidelines

When reviewing code, AI agents must follow these rules:

1. Understand the purpose and scope of the change before reviewing individual files.
2. Inspect relevant surrounding code and existing project conventions.
3. Evaluate changes against established architecture and engineering standards.
4. Prioritize correctness, security, reliability, and maintainability.
5. Verify feature and monorepo dependency boundaries.
6. Evaluate component and hook responsibilities based on cohesion and complexity rather than rigid LOC limits.
7. Verify appropriate separation of presentation, domain logic, queries, and commands.
8. Review state ownership and server-state cache synchronization.
9. Check React hooks, effects, rendering behavior, and state transitions.
10. Identify unsafe TypeScript patterns and missing runtime validation at external boundaries.
11. Review security-sensitive code for XSS, CSRF, authentication, authorization, sensitive data exposure, and unsafe redirects.
12. Verify adherence to the project's design system without automatically rejecting justified arbitrary styling values.
13. Review accessibility, responsive behavior, and meaningful performance risks.
14. Check error handling, loading states, and failure recovery.
15. Review dependency and configuration changes for unintended consequences.
16. Enforce the established `frontend-testing` conventions for test placement, naming, mocks, and test quality.
17. Use Critical, High, Medium, and Low severity levels consistently.
18. Provide actionable findings with specific locations, explanations, impact, and recommendations.
19. Distinguish confirmed defects from optional improvements.
20. Avoid inventing requirements or reporting speculative issues as facts.
21. Do not approve or reject changes based solely on stylistic preferences.
22. Summarize important review findings and identify any relevant testing or verification gaps.

### 17.1 Review Output

Structure the final review as follows:

```text
## Review Summary

Briefly describe the overall quality and purpose of the changes.

## Findings

### Critical
- Findings that must be resolved before merge.

### High
- Significant defects or risks.

### Medium
- Meaningful maintainability, reliability, or performance concerns.

### Low
- Minor issues and optional improvements.

## Testing and Verification

- Tests reviewed.
- Missing or insufficient test coverage.
- Additional verification required.

## Positive Observations

- Important improvements or sound engineering decisions.

## Overall Assessment

- Approved
- Approved with suggestions
- Changes requested
```

Only include severity sections that contain findings.

Do not manufacture findings to populate every section.

The overall assessment should reflect the actual findings and project review requirements.

## 18. Final Review Checklist

Before completing a review, verify the following:

### Architecture

- [ ] Feature boundaries and dependency direction are respected.
- [ ] Shared packages remain independent of application-specific implementations.
- [ ] Components and modules are placed in appropriate architectural layers.
- [ ] Cross-feature dependencies are justified.

### Components and State

- [ ] Components have clear responsibilities.
- [ ] Hooks encapsulate appropriate reusable behavior.
- [ ] Presentation and domain logic are separated appropriately.
- [ ] State is owned at the correct level.
- [ ] Queries and commands follow established abstractions.
- [ ] Server-state cache synchronization is correct.

### React and TypeScript

- [ ] Hooks follow React's Rules of Hooks.
- [ ] Effects have correct dependencies and cleanup.
- [ ] Rendering and state updates are predictable.
- [ ] Memoization is justified.
- [ ] Types are explicit and accurate.
- [ ] Untrusted external data is validated where necessary.

### Security

- [ ] Dynamic content is handled safely.
- [ ] Authentication and session handling are secure.
- [ ] CSRF protections are appropriate.
- [ ] Authorization is enforced server-side.
- [ ] Redirect destinations are validated.
- [ ] Sensitive information is not unnecessarily exposed.
- [ ] Dependencies do not introduce known unacceptable vulnerabilities.

### UI and Accessibility

- [ ] Design-system conventions are followed.
- [ ] Responsive behavior is appropriate.
- [ ] Semantic HTML is used.
- [ ] Keyboard interactions and focus behavior work correctly.
- [ ] Accessible names and states are exposed appropriately.

### Quality and Performance

- [ ] Cognitive complexity is manageable.
- [ ] Responsibilities are cohesive.
- [ ] Unnecessary duplication is avoided.
- [ ] Error handling is appropriate.
- [ ] Performance concerns are addressed where meaningful.
- [ ] Resources and subscriptions are cleaned up.

### Testing

- [ ] Unit tests are in the component/module's `__tests__` folder.
- [ ] Integration tests are in the template/page's `__tests__` folder.
- [ ] Related mocks are in the same `__tests__` folder as their tests.
- [ ] Unit and integration tests use descriptive `.test` filenames.
- [ ] Integration test filenames include `.integration`.
- [ ] E2E tests use `.spec` filenames in the dedicated E2E directory.
- [ ] Tests verify observable behavior.
- [ ] Async behavior and mock cleanup are handled correctly.
- [ ] Important success and failure scenarios are covered.

### Review Quality

- [ ] Findings have appropriate severity.
- [ ] Findings identify specific locations.
- [ ] Impacts and recommendations are clearly explained.
- [ ] Suggestions are distinguished from required changes.
- [ ] The overall assessment reflects the actual findings.

The goal is to maintain a frontend codebase that is secure, scalable, performant, accessible, testable, and maintainable without sacrificing reasonable engineering flexibility.
