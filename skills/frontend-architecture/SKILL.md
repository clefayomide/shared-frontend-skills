---
name: frontend-architecture
description: Enforce domain-driven frontend architecture, Screaming Architecture, Atomic Design principles, component and hook granularity, smart/dumb component boundaries, CQRS, state ownership, and dependency management. Use when creating project directories, organizing feature modules, managing data flow, building UI components and hooks, or making frontend architectural decisions.
---

# Frontend Architecture & Design Principles

Establish maintainable, scalable, and predictable frontend architectures by organizing code around business domains, enforcing clear separation of responsibilities, and managing dependencies deliberately.

These principles are architectural guidelines, not rigid rules. Prioritize maintainability, readability, cohesion, and consistency over unnecessary abstractions or structural compliance.

## 1. Directory Structure: Screaming Architecture

Organize the application around business domains and functional capabilities rather than technical layers. The directory structure should communicate what the application does.

### Recommended Structure

```bash
src/
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── billing/
│   └── checkout/
│
├── components/
│   └── ui/
│       ├── button/
│       ├── input/
│       └── modal/
│
├── core/
│   ├── providers/
│   ├── routing/
│   └── configuration/
│
├── shared/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
│
└── app/
    ├── layouts/
    └── pages/
```

### Directory Responsibilities

- **`/features/[domain]/`**: Feature-centric modules containing domain-specific UI, hooks, API operations, types, and utilities.
- **`/components/`**: Globally reusable, domain-agnostic design system components.
- **`/core/`**: Application infrastructure, including providers, routing configuration, initialization, and application-wide configuration.
- **`/shared/`**: Generic utilities, hooks, types, and functionality genuinely shared across multiple features.
- **`/app/`**: Application entry points, route composition, layouts, and page-level orchestration.

### Architectural Rules

- Organize code by business capability, not by file type across the entire application.
- Keep feature-specific implementation details inside their owning feature.
- Avoid creating directories without a clear organizational purpose.
- Do not promote code into shared modules prematurely.
- Follow the existing project structure when working within an established codebase unless there is a compelling reason to change it.

## 2. Component Design & Granularity

Use Atomic Design as a conceptual model for component composition, not as a mandatory directory structure.

### Atomic Design Principles

- **Atoms:** Fundamental UI primitives such as buttons, inputs, icons, labels, and badges. They should remain independent of business-specific logic.
- **Molecules:** Small, cohesive combinations of atoms that perform a focused UI responsibility, such as search fields or form controls.
- **Organisms:** Complex UI sections composed of smaller components, such as navigation headers, data tables, dashboards, and card grids.
- **Templates:** Layout structures that define page composition without being tightly coupled to specific business data.
- **Pages:** Route-level compositions that connect feature components, layouts, and application state.

### Component File Organization

- Prefer one primary exported React component per file.
- Small, tightly coupled private helper components may be colocated when doing so improves readability.
- Extract components when they have independent responsibilities, meaningful complexity, or potential reuse.
- Keep component-specific styles, types, and tests close to the component when appropriate.
- Avoid creating files for trivial abstractions that reduce readability rather than improve it.

### Component Decomposition

Use approximately 200 lines of code as a review threshold for React components, not a strict maximum.

When a component grows beyond this threshold, evaluate whether it contains multiple responsibilities or complex logic that should be extracted.

Consider decomposition when:
- Rendering logic becomes difficult to follow.
- Multiple independent UI sections exist.
- Business logic is mixed with presentation logic.
- Conditional rendering becomes deeply nested.
- State management becomes difficult to understand.
- A section has independent reuse or testing value.

Do not extract components solely to reduce line counts.

## 3. Component Data Boundaries: Smart vs. Dumb Components

Establish clear boundaries between presentation components and domain-aware components.

### Presentational Components

Atoms and most molecules should remain presentational.

- Receive data and callbacks through props.
- Avoid direct data-fetching responsibilities.
- Avoid dependencies on feature-specific business logic.
- Remain reusable and independently testable.
- Focus on rendering, interaction, and presentation.

### Domain-Aware Components

Feature organisms and widgets may consume their own domain-specific query hooks when appropriate.

For example:

```tsx
function UserProfileCard({ userId }: Props) {
  const { data: user, isPending } = useUser(userId);

  if (isPending) return <UserProfileSkeleton />;

  if (!user) return <UserNotFound />;

  return <UserProfileView user={user} />;
}
```

This allows self-contained feature components to be reused across different pages without unnecessarily passing data through multiple layers.

However:
- Avoid tightly coupling generic design system components to domain data.
- Keep domain-aware components within their owning feature.
- Prefer props when a component needs to support multiple data sources or presentation contexts.

### Pages and Top-Level Containers

Pages act as composition and orchestration layers.

Responsibilities include:
- Composing feature components into page layouts.
- Managing page-level state and URL parameters.
- Coordinating interactions across multiple widgets.
- Handling page-specific loading, error, and empty states.
- Orchestrating workflows involving multiple feature components.

Avoid turning pages into repositories for all application business logic.

## 4. CQRS & Data Management

Separate read operations (Queries) from write operations (Commands) to improve predictability, testability, and separation of responsibilities.

This is a frontend separation-of-concerns pattern and does not require implementing full backend CQRS architecture.

### Queries: Read Operations

All reusable server-state read operations should be encapsulated in dedicated query hooks.

Examples:

- `useUsers()`
- `useUser(userId)`
- `useProjectDetails(projectId)`
- `useBillingProfile()`

Responsibilities:

- Encapsulate data-fetching library interactions.
- Manage query keys and cache configuration.
- Handle loading, error, and background refetching states.
- Expose predictable query results.
- Support cache reuse and deduplication.
- Apply shared domain-level data transformations when appropriate.

Underlying data-fetching libraries such as TanStack Query, RTK Query, and Apollo should be accessed through the established data-access abstraction rather than scattered throughout components.

Query hooks must not:
- Trigger unrelated mutations.
- Perform imperative side effects unrelated to fetching.
- Modify unrelated application state.
- Contain presentation-specific UI behavior.

Keep query hooks focused on reading and synchronizing server state.

### Commands: Write Operations

Write operations must be encapsulated in explicit action handlers or dedicated mutation hooks.

Examples:

- `useCreateUser()`
- `useUpdateBillingProfile()`
- `useDeleteProject()`
- `useCheckoutOrder()`

Responsibilities:

- Encapsulate server-side state changes.
- Manage mutation lifecycle states.
- Handle command-specific errors.
- Coordinate cache synchronization after successful mutations.
- Support optimistic updates when appropriate.

### Cache Management

After successful commands, synchronize affected query caches deliberately.

Choose the appropriate strategy based on the operation:

- **Query invalidation:** When affected data should be refetched.
- **Direct cache updates:** When the resulting data is already available.
- **Optimistic updates:** When immediate UI feedback improves the experience.
- **Rollback:** When an optimistic update fails and previous cache state must be restored.

Avoid unnecessary cache invalidation and uncontrolled local state duplication.

## 5. Hook Granularity & Responsibilities

Custom hooks should encapsulate cohesive, reusable behavior and hide implementation complexity from consuming components.

### Hook Design Principles

- Each hook should have a clear, focused responsibility.
- Prefer composition of smaller hooks over monolithic hooks.
- Keep hooks independent of specific UI implementations where practical.
- Avoid duplicating business logic across multiple hooks.
- Separate server-state management from local UI-state management.
- Keep reusable business logic outside components when it improves testability.

### Hook Decomposition

Use approximately 300 lines of code as a review threshold, not a strict maximum.

Consider extracting sub-hooks when:
- The hook manages unrelated state.
- Validation and transformation logic become complex.
- Multiple asynchronous workflows are combined.
- The hook has multiple independent responsibilities.
- Testing individual behaviors becomes difficult.

Example:

```bash
features/
└── checkout/
    └── hooks/
        ├── use-checkout.ts
        ├── use-checkout-validation.ts
        ├── use-checkout-submission.ts
        └── use-checkout-summary.ts
```

Compose smaller hooks into an orchestrator hook when consumers benefit from a unified interface.

Avoid creating hooks that merely wrap a single line of code without adding meaningful abstraction or reuse.

## 6. Dependency Direction & Feature Isolation

Maintain predictable dependency relationships to prevent architectural coupling and circular dependencies.

### Dependency Rules

- Features must own their domain-specific business logic and implementation.
- Features must not depend on the internal implementation details of other features.
- Shared modules must never depend on feature modules.
- Core infrastructure should remain independent of individual feature implementations.
- Avoid circular dependencies between modules.
- Use explicitly exposed public interfaces for legitimate cross-feature communication.
- Keep internal components, hooks, and utilities private unless external consumption is necessary.

### Public Feature Interfaces

Expose only functionality that other modules genuinely need.

Example:

```bash
features/
└── auth/
    ├── components/
    ├── hooks/
    ├── api/
    ├── types/
    └── index.ts
```

```typescript
// features/auth/index.ts

export { useCurrentUser } from './hooks/use-current-user';
export { LoginForm } from './components/login-form';
export type { User } from './types/user';
```

Consumers should import from the feature's public interface rather than reaching into its internal directory structure.

Avoid unnecessary barrel files that introduce circular dependencies or complicate module resolution.

## 7. State Ownership & Lifecycle

Choose state management strategies according to the nature and ownership of the data.

Avoid using one state management solution for every type of state.

### Server State

Examples:
- Users and projects retrieved from an API.
- Billing information.
- Product catalogs.
- Remote application configuration.

Use dedicated server-state solutions such as TanStack Query, RTK Query, or Apollo.

Do not unnecessarily duplicate server state in local component state or global stores.

### Global Client State

Examples:
- Application-wide preferences.
- Authentication session state when not managed by a server-state solution.
- Global UI configuration.
- Cross-feature client-side workflows.

Use an established global state solution when multiple independent components genuinely need access to the same client-owned state.

### Local UI State

Examples:
- Modal visibility.
- Dropdown state.
- Form interaction state.
- Temporary selections.
- Component-specific toggles.

Prefer React's built-in state mechanisms such as `useState` and `useReducer`.

Keep state as close as possible to the components that own and consume it.

### URL State

Examples:
- Search queries.
- Pagination.
- Sorting.
- Filters.
- Selected tabs when they should be shareable or navigable.

Use URL search parameters or routing mechanisms when state should survive page reloads, support browser navigation, or be shareable.

### State Management Rules

- Establish a single source of truth for each piece of state.
- Avoid unnecessary state duplication and synchronization.
- Derive values instead of storing values that can be calculated.
- Keep transient state local.
- Promote state only when there is a genuine sharing requirement.
- Ensure state lifecycle aligns with component and feature lifecycle.

## 8. Data Transformation & Type Ownership

Maintain clear boundaries between backend contracts, domain models, and presentation models.

### API Layer

The API layer is responsible for:
- HTTP communication.
- Request and response handling.
- Authentication headers and request configuration.
- API-specific error normalization.
- Mapping transport-level responses when necessary.

### Domain Layer

Domain-specific types, schemas, and transformations should belong to the feature that owns them.

- Keep feature-specific types close to their owning feature.
- Use shared types only for genuinely shared contracts.
- Avoid leaking backend-specific response structures throughout the UI.
- Use schema validation where runtime validation is necessary.
- Prefer explicit mapping functions over scattered inline transformations.

### Presentation Layer

Presentation-specific transformations should remain close to their consumers.

Examples include:
- Formatting dates and currencies.
- Generating display labels.
- Deriving visual statuses.
- Mapping domain values to UI-specific representations.

Avoid putting all transformations inside query hooks. Shared domain transformations belong in dedicated functions, while consumer-specific formatting belongs near the presentation layer.

## 9. Error Handling & Loading States

Establish predictable behavior for asynchronous operations and exceptional conditions.

### Guidelines

- Handle loading, success, empty, and error states explicitly.
- Normalize API errors at the appropriate data-access boundary.
- Avoid silently swallowing errors.
- Use error boundaries for unexpected rendering failures.
- Keep user-facing error messages separate from internal debugging details.
- Provide retry mechanisms where appropriate.
- Avoid duplicating error-handling logic across components.

Mutation errors should be handled in the context of the action that initiated them, while global error reporting may be delegated to shared infrastructure.

## 10. Testing & Maintainability

Architecture should make the application easier to test, not introduce unnecessary testing complexity.

## 11. Architectural Decision Guidelines (AI Coding Agents)

When applying these principles, use engineering judgment rather than blindly enforcing structural rules.

### Decision-Making Rules

- Prefer the simplest architecture that satisfies the feature's requirements.
- Inspect the existing project structure and conventions before making changes.
- Follow established patterns unless there is a demonstrable architectural reason to change them.
- Avoid introducing abstractions without a clear benefit.
- Do not create components, hooks, utilities, or directories solely to satisfy file-size or structural rules.
- Prefer composition over unnecessary component nesting.
- Avoid premature optimization and premature abstraction.
- Do not promote feature-specific code into shared modules without genuine reuse.
- Preserve existing functionality and public interfaces when refactoring.
- Optimize for readability, maintainability, testability, and separation of responsibilities.
- Consider project scale and complexity when choosing architectural patterns.
- Avoid introducing additional dependencies when existing project capabilities are sufficient.

### Before Implementing Architectural Changes

1. Inspect the existing project structure.
2. Identify the relevant feature and its ownership boundaries.
3. Understand existing data-fetching and state-management conventions.
4. Identify reusable components, hooks, and utilities before creating new ones.
5. Determine the appropriate dependency direction.
6. Implement the smallest maintainable solution.
7. Verify that the implementation remains consistent with existing architectural conventions.

### Guiding Principle

**Be prescriptive about architectural principles but flexible about implementation details.**

The goal is not to maximize abstractions, minimize file sizes, or enforce a particular folder structure at all costs.

The goal is to build frontend applications that are easy to understand, extend, test, and maintain as business requirements evolve.
---