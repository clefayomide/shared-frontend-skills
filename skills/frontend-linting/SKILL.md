---
name: frontend-linting
description: Standards and guidelines for frontend static analysis, linting, type safety, formatting, architectural boundary enforcement, and automated code quality gates. Use when configuring ESLint, TypeScript, Prettier, Biome, pre-commit hooks, CI pipelines, or reviewing and resolving frontend code quality issues.
---

# Frontend Linting & Static Analysis Standards

## 1. Core Principles & Tooling

- **Automated Code Quality**: Use static analysis to detect correctness issues, unsafe patterns, maintainability problems, and violations of established project conventions.
- **Separation of Concerns**:
  - **ESLint**: Enforce code correctness, framework rules, architectural boundaries, accessibility, security patterns, and import hygiene.
  - **TypeScript Compiler**: Enforce static type correctness and configured type-system constraints.
  - **Formatter**: Use Prettier or Biome to enforce consistent formatting.
  - **Testing Tools**: Use appropriate test runners and accessibility tools to validate behavior that static analysis cannot establish.
- **Consistent Configuration**: Centralize shared tooling configuration where practical, especially in monorepos.
- **Modern ESLint Configuration**: Prefer ESLint flat configuration (`eslint.config.js`, `eslint.config.mjs`, or supported TypeScript configuration) for modern ESLint projects. Maintain existing supported configurations when migration offers insufficient value.
- **Configuration Reuse**: Share common ESLint presets across applications and packages while allowing justified project-specific overrides.
- **Deterministic Results**: Ensure local development and CI use compatible tool versions and configuration.
- **Avoid Tool Duplication**: Do not configure multiple tools to enforce identical rules unnecessarily.
- **Incremental Adoption**: When introducing stricter rules into an existing codebase, establish a baseline and progressively eliminate existing violations without weakening standards for new code.

## 2. ESLint & Formatting Standards

- **Rule Selection**: Use maintained ESLint plugins and recommended configurations where appropriate.
- **Recommended Configurations**: Prefer established presets from ESLint, typescript-eslint, React, React Hooks, JSX Accessibility, and other relevant plugins.
- **Formatter Integration**:
  - Use one primary formatter for the project.
  - Configure ESLint and the formatter to avoid conflicting formatting rules.
  - Use `eslint-config-prettier` when combining ESLint with Prettier to disable conflicting stylistic rules.
- **Formatting Consistency**: Enforce consistent indentation, quotes, semicolons, trailing commas, line endings, and other formatting decisions through the selected formatter.
- **Zero-Warning Policy**:
  - Aim for zero lint warnings in new or actively maintained code.
  - Use `--max-warnings=0` in CI when the project has reached a clean baseline.
  - For legacy repositories, track existing warnings and prevent new violations while progressively reducing the baseline.
- **Autofix**: Use ESLint autofix and formatter commands where safe. Review transformations that may change behavior or application semantics.
- **Rule Documentation**: Document custom rules, non-obvious overrides, and important exceptions.

## 3. TypeScript & Type-Safety Rules

- **Strict Compiler Settings**: Enable TypeScript strictness where practical, including:
  - `strict`
  - `strictNullChecks`
  - `noImplicitAny`
  - `noImplicitReturns`
  - `noFallthroughCasesInSwitch`
  - `noUncheckedIndexedAccess` where appropriate
  - `exactOptionalPropertyTypes` where appropriate
- **Type-Aware Linting**: Use `typescript-eslint` type-aware rules when their additional analysis value justifies the configuration and performance cost.
- **Recommended Configurations**: Consider `recommendedTypeChecked` or `strictTypeChecked` configurations according to project requirements.
- **Avoid Explicit Any**:
  - Prefer `unknown` when the type is not known.
  - Avoid explicit `any` unless there is a documented technical reason.
  - Validate and narrow unknown values before using them.
- **Non-Null Assertions**: Avoid unnecessary non-null assertions (`!`). Prefer explicit guards, optional chaining, and safe type narrowing. Allow justified assertions when an invariant is established and cannot be represented adequately through the type system.
- **Type-Only Imports**: Use `import type` for type-only imports where required by the project's module and compiler configuration. Enforce consistency through `@typescript-eslint/consistent-type-imports`.
- **Promise Safety**:
  - Detect unhandled promises using `@typescript-eslint/no-floating-promises`.
  - Detect incorrectly used asynchronous callbacks using `@typescript-eslint/no-misused-promises`.
  - Handle rejected promises intentionally.
- **Type Assertions**: Avoid unsafe type assertions that bypass compiler checks. Prefer runtime validation and proper type guards.
- **Type Duplication**: Avoid unnecessary duplication of shared domain and API types. Keep types close to their ownership boundary and expose them through appropriate public interfaces.
- **Type Suppressions**: Avoid `@ts-ignore`. Prefer `@ts-expect-error` with a clear explanation when a known compiler limitation or intentional exception requires suppression.

## 4. React, Hooks & Component Standards

- **React Rules**: Enforce the official React Hooks rules and relevant React-specific linting configurations.
- **Hooks Integrity**:
  - Enforce `react-hooks/rules-of-hooks`.
  - Enforce `react-hooks/exhaustive-deps`.
  - Avoid stale closures and unintended effect dependencies.
  - Do not suppress dependency warnings merely to silence the linter.
  - Allow narrowly justified suppressions when the dependency is intentionally excluded and the effect's lifecycle semantics are documented.
- **Component Naming**: Use `PascalCase` for React components and `useCamelCase` for custom hooks.
- **Component Boundaries**: Prefer clear component responsibilities and avoid unnecessary coupling between unrelated features.
- **Component Co-location**: Co-locate small, tightly related helper components when it improves readability. Avoid treating multiple component declarations in a file as an automatic violation.
- **Complexity Detection**: Use appropriate rules to identify deeply nested conditions, excessive branching, duplicated logic, and difficult-to-maintain functions.
- **File Size Signals**:
  - Consider approximately 200 LOC for components and 300 LOC for hooks as review thresholds, not hard rejection criteria.
  - Use rules such as `max-lines` to identify files that may need decomposition.
  - Evaluate actual responsibility, readability, cohesion, and complexity before splitting files.
  - Do not introduce unnecessary abstractions or fragmentation merely to satisfy LOC limits.
- **React-Specific Rules**: Apply relevant rules for JSX correctness, key usage, component definitions, and other framework-specific issues according to the React version and project configuration.

## 5. Import Hygiene & Architectural Boundaries

- **Deterministic Import Ordering**: Establish a consistent import order and enforce it through a dedicated ESLint plugin or equivalent tooling.
- **Import Grouping**: Where appropriate, group imports into:
  - Built-in modules.
  - External dependencies.
  - Internal workspace packages.
  - Application aliases.
  - Relative parent and sibling imports.
  - Styles and assets.
  - Type-only imports.
- **Unused Imports**: Detect and remove unused imports and variables.
- **Circular Dependencies**: Detect problematic circular dependencies using tools such as `import/no-cycle` or dedicated dependency analysis tools.
- **Screaming Architecture**: Align automated boundary rules with the project's feature-based architecture and domain ownership.
- **Monorepo Boundaries**:
  - Shared packages must not depend on application-specific implementations.
  - Applications should consume shared packages through their public APIs.
  - Enforce permitted dependency directions between applications, features, and shared modules.
  - Prevent unintended dependencies between unrelated features.
- **Atomic Design Boundaries**:
  - Atoms and molecules should remain reusable and presentation-focused.
  - Presentational components must not depend directly on feature-specific query or mutation hooks.
  - Domain-specific organisms and widgets may own feature-related presentation and behavior where appropriate.
- **Public Module APIs**: Enforce public exports for modules where encapsulation and package boundaries require them.
- **Deep Imports**: Prevent cross-feature imports that bypass intended public APIs. Do not prohibit legitimate internal imports within the same feature without a clear architectural reason.
- **Tooling**: Use `eslint-plugin-boundaries`, Nx module boundary rules (`@nx/enforce-module-boundaries`), or equivalent tooling where appropriate.
- **Architecture Consistency**: Ensure linting boundaries reflect the actual architecture rather than introducing arbitrary restrictions that make legitimate dependencies difficult.

## 6. Code Quality & Maintainability Rules

- **Unused Code**: Detect unused variables, imports, parameters, and unreachable code.
- **Naming Consistency**: Enforce consistent naming conventions for components, hooks, functions, variables, constants, types, and interfaces.
- **Function Complexity**: Identify excessive cognitive complexity, deeply nested conditions, and functions with too many responsibilities.
- **Duplication**: Flag repeated logic where extraction would improve maintainability. Do not force abstractions for trivial or coincidental similarities.
- **Function Length**: Use function-length rules as indicators of possible complexity rather than automatic rejection criteria.
- **Control Flow**: Prefer clear, predictable control flow over deeply nested conditionals and unnecessary branching.
- **Dead Code**: Remove obsolete implementations, unreachable branches, and unused feature flags when no longer required.
- **Magic Values**: Extract repeated or meaningful hardcoded values into appropriately named constants or configuration.
- **Comments**: Avoid redundant comments that simply restate the code. Use comments to explain intent, constraints, and non-obvious decisions.
- **Maintainability**: Prefer straightforward implementations over clever abstractions that make code harder to understand.

## 7. Accessibility & Security Static Checks

- **JSX Accessibility**: Use `eslint-plugin-jsx-a11y` or equivalent rules to identify common accessibility problems.
- **Accessibility Rules**:
  - Detect missing accessible labels and invalid ARIA attributes.
  - Identify non-semantic interactive elements where possible.
  - Detect invalid or suspicious accessibility properties.
  - Flag common keyboard interaction issues detectable through static analysis.
- **Security Rules**:
  - Flag unsafe HTML rendering such as `dangerouslySetInnerHTML` for explicit review.
  - Detect dangerous dynamic execution patterns such as `eval()` and `new Function()`.
  - Identify unsafe URL handling and suspicious redirect patterns where supported.
  - Flag insecure handling of external links and iframe integrations where detectable.
- **Contextual Review**: Static rules cannot establish complete accessibility or application security. Review flagged patterns in context and supplement linting with dedicated security and accessibility testing.
- **Shared Standards**: Align lint rules with the project's `frontend-accessibility` and `frontend-security` standards.

## 8. Testing & Test Convention Enforcement

- **Testing Standards**: Align test linting and naming conventions with the project's `frontend-testing` skill.
- **Unit Tests**:
  - Place unit tests inside the relevant component or module's `__tests__` directory.
  - Use descriptive behavior-focused `.test` filenames.
  - Example: `login-form-validation.test.ts`.
- **Integration Tests**:
  - Place integration tests inside the relevant template or page's `__tests__` directory.
  - Include `.integration` in the filename before `.test`.
  - Example: `login-page-authentication.integration.test.tsx`.
- **Mocks**:
  - Keep related mock files in the same `__tests__` directory as their associated unit or integration tests.
  - Use descriptive names that identify the mocked dependency or behavior.
- **End-to-End Tests**:
  - Use `.spec` extensions for E2E test files.
  - Keep E2E tests in the project's dedicated E2E directory.
  - Example: `login.spec.ts`.
- **Test Naming**: Prefer descriptive names that communicate the behavior or outcome being verified.
- **Linting Tests**: Apply appropriate lint rules to test files while allowing justified test-specific exceptions.
- **Test Quality**: Avoid lint rules that encourage implementation-detail assertions or excessive mocking.
- **Automated Enforcement**: Use ESLint overrides, restricted patterns, or custom tooling to enforce test directory and naming conventions where practical.

## 9. Performance & Tooling Efficiency

- **Lint Performance**: Keep lint execution efficient enough for regular local development and CI usage.
- **Scope Control**: Exclude generated files, build outputs, dependencies, coverage reports, and other irrelevant artifacts from linting.
- **Type-Aware Performance**: Avoid enabling expensive type-aware rules across files that do not need them.
- **Caching**: Enable ESLint caching where appropriate to reduce repeated analysis time.
- **Incremental Execution**: In monorepos, prefer affected-project linting and task caching where supported.
- **Parallel Execution**: Use parallel task execution where it improves performance without causing resource contention.
- **Configuration Complexity**: Avoid excessive overrides, duplicate rules, and unnecessary plugin dependencies.
- **Tool Maintenance**: Keep ESLint, plugins, TypeScript, and formatter versions compatible and maintained.

## 10. Rule Suppression & Exceptions

- **No Blanket Disables**: Avoid file-wide `/* eslint-disable */` comments. Require explicit justification and review for exceptional cases.
- **Narrow Scope**: Suppress only the specific rule and the smallest relevant code section.
- **Justification**: Every suppression must explain why the rule cannot reasonably be satisfied in that context.
- **Prefer Refactoring**: Before suppressing a rule, determine whether the underlying implementation can be improved.
- **TypeScript Suppressions**: Avoid `@ts-ignore`. Prefer documented `@ts-expect-error` when suppression is necessary.
- **Reviewability**: Suppressions should be easy to locate, understand, and reassess.
- **Periodic Cleanup**: Review temporary suppressions and remove them when their underlying constraints no longer exist.
- **No Silent Suppression**: Do not disable rules globally merely to make CI pass or accommodate one problematic implementation.

## 11. Pre-Commit Hooks & Local Quality Gates

- **Pre-Commit Automation**: Use tools such as Husky and lint-staged where appropriate to run fast quality checks on changed files.
- **Staged File Checks**: Run applicable formatting, linting, and other file-scoped checks against staged files.
- **Type Checking**: Do not assume `tsc --noEmit` can correctly type-check an arbitrary subset of staged files. Run TypeScript checks against the appropriate project or workspace configuration.
- **Fast Feedback**: Keep pre-commit checks fast enough to avoid disrupting normal development.
- **Developer Experience**: Provide clear error messages and documented commands for resolving quality gate failures.
- **Bypass Controls**: Do not rely exclusively on local hooks, since they can be bypassed. CI must independently enforce required checks.

## 12. CI/CD Quality Gates

- **Linting**: Run ESLint against all relevant changed or affected projects.
- **Type Checking**: Run TypeScript type checking against the appropriate application and package configurations.
- **Formatting**: Verify formatting consistency using the project's chosen formatter.
- **Testing**: Run the relevant unit, integration, and E2E test suites according to the project's CI strategy.
- **Architecture Validation**: Enforce monorepo dependency boundaries and other architectural constraints.
- **Security Checks**: Run dependency vulnerability and secret scanning where configured.
- **Affected Projects**: Use workspace tooling such as `nx affected -t lint typecheck` where appropriate.
- **Quality Gate Independence**: Keep linting, type checking, formatting, testing, and security checks as distinct, observable CI steps.
- **Failure Handling**: Do not silently ignore failed quality gates or mark incomplete checks as successful.
- **Baseline Management**: Track existing violations separately and prevent new violations from entering the codebase.

## 13. AI-Assisted Development & Code Review

- **Generated Code**: AI-generated code must satisfy the same linting, formatting, type-safety, and architectural standards as manually written code.
- **No Rule Circumvention**: Do not introduce unnecessary suppressions, weaken shared configurations, or disable checks simply to make generated code pass.
- **Review Autofixes**: Review automated fixes for unintended behavior changes.
- **Configuration Changes**: Treat modifications to ESLint, TypeScript, formatter, and CI configuration as engineering changes that require review.
- **Rule Selection**: Do not add new lint rules without understanding their purpose, false-positive behavior, maintenance implications, and performance cost.
- **Human Review**: Passing lint and type checks does not replace code review, testing, or security assessment.

## 14. Linting Review & Reporting

When reviewing linting configuration or static-analysis violations:

- Identify the affected file, rule, configuration, or CI step.
- Explain the issue and its impact on correctness, maintainability, or consistency.
- Distinguish:
  - **Defects**: Actual correctness, safety, or architectural violations.
  - **Standards Violations**: Breaches of explicitly established project conventions.
  - **Recommendations**: Improvements that may increase maintainability but are not mandatory.
- Classify findings by severity:
  - **Critical**: A configuration or tooling defect that permits serious security or correctness failures or disables essential quality controls.
  - **High**: A significant issue that weakens type safety, architectural boundaries, or important automated checks.
  - **Medium**: A violation that creates maintainability problems, inconsistent enforcement, or avoidable developer friction.
  - **Low**: A minor consistency or configuration improvement.
  - **Informational**: An optional recommendation or observation.
- Provide the relevant rule name or configuration location when possible.
- Include an actionable remediation recommendation.
- Avoid treating subjective preferences as blocking defects.
- Do not recommend adding a lint rule when an existing test, compiler check, or architectural tool is more appropriate.

## 15. Final Linting Checklist

Before considering a frontend linting setup complete, verify:

- [ ] ESLint configuration is maintained and consistently applied.
- [ ] A single primary formatting strategy is configured.
- [ ] ESLint and formatter rules do not conflict.
- [ ] TypeScript compiler strictness is configured intentionally.
- [ ] Type-aware linting is enabled where appropriate.
- [ ] Unsafe TypeScript patterns are detected or appropriately constrained.
- [ ] React and Hooks rules are configured.
- [ ] Component complexity and file size are monitored without arbitrary hard rejection thresholds.
- [ ] Import ordering, unused imports, and circular dependencies are checked.
- [ ] Monorepo and feature boundaries are enforced where applicable.
- [ ] Accessibility and security static checks are configured.
- [ ] Testing directory and filename conventions are consistently followed.
- [ ] Rule suppressions are narrow, justified, and reviewable.
- [ ] Pre-commit checks provide fast feedback on changed files.
- [ ] CI independently enforces linting, type checking, formatting, and relevant tests.
- [ ] Existing violations are tracked without allowing new violations to accumulate.
- [ ] Tool versions and shared configurations are maintained.
- [ ] AI-generated code is subject to the same quality gates.