---
name: git-commit
description: Write, review, and improve Git commit messages using the Conventional Commits specification. Use when creating commits, reviewing commit messages, preparing pull requests, or determining the semantic impact of changes.
---

# Conventional Commits

## 1. Objective

Produce clear, consistent, and meaningful Git commit messages following the Conventional Commits specification.

Commit messages must communicate:
- The nature of a change.
- The area of the codebase affected.
- The reason or impact of the change.
- Whether the change introduces a breaking change.

Prioritize clarity, consistency, and accurate representation of the actual changes. Never invent functionality or claim changes that are not present in the implementation.

## 2. Commit Message Format

Follow this structure:

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

Components:

- `type`: Categorizes the change.
- `scope`: Optional identifier describing the affected feature, module, package, or area.
- `!`: Indicates a breaking change.
- `description`: Concise summary written in imperative mood.
- `body`: Optional explanation of the motivation and relevant implementation details.
- `footer`: Optional metadata, references, and breaking change descriptions.

Examples:

```text
feat(auth): add OAuth token refresh support

fix(api): handle expired access tokens

refactor(ui): simplify button variant handling

feat(api)!: replace legacy authentication endpoints

BREAKING CHANGE: Remove the legacy token exchange endpoint.
```

## 3. Commit Types

Use the following types consistently.

| Type | Purpose | Semantic meaning |
|---|---|---|
| `feat` | Introduces new functionality | Minor |
| `fix` | Fixes a bug | Patch |
| `perf` | Improves performance | Usually patch |
| `refactor` | Restructures code without changing external behaviour | No automatic release by default |
| `docs` | Documentation-only changes | No automatic release by default |
| `test` | Adds or modifies tests | No automatic release by default |
| `build` | Changes build system or dependencies | No automatic release by default |
| `ci` | Changes CI/CD configuration | No automatic release by default |
| `chore` | Maintenance tasks that do not affect application behaviour | No automatic release by default |
| `style` | Formatting or stylistic changes without behavioural impact | No automatic release by default |
| `revert` | Reverts a previous commit | Depends on the reverted change and release policy |

Use the most specific and accurate type.

Do not use `feat` or `fix` simply to make a commit appear more significant.

## 4. Scope

Scopes identify the area affected by a change.

Use short, meaningful identifiers that reflect the project's architecture.

Examples:

```text
feat(auth): add session expiration handling

fix(button): correct disabled state styling

test(forms): cover validation edge cases

build(typescript): update compiler configuration

ci(publish): automate npm publishing
```

Guidelines:

- Use lowercase identifiers.
- Prefer existing feature, package, module, or domain names.
- Keep scopes concise.
- Use a scope when it adds useful context.
- Omit the scope when the change affects the project generally or no meaningful scope exists.
- Avoid introducing arbitrary scope names or unnecessary nested scopes.

For monorepos, prefer the affected package or workspace name where appropriate.

## 5. Description

The description should summarize the change in a concise and understandable way.

Guidelines:

- Use imperative mood: describe what the commit does.
- Start with a lowercase letter.
- Do not end with a period.
- Prefer specific descriptions over generic summaries.
- Avoid unnecessary filler.
- Keep the description concise, ideally within 72 characters.
- Avoid using emojis or icons.

Good examples:

```text
feat(auth): add refresh token support

fix(button): prevent clicks when disabled

docs(api): document webhook signature validation

ci(release): add automated package publishing
```

Avoid:

```text
feat: added some new features

fix: fixed a bug

chore: updates

feat: changes to the authentication implementation
```

Descriptions should remain meaningful when viewed independently in Git history.

## 6. Commit Body

Use a body when the subject alone does not adequately explain the change.

The body should explain:

- Why the change was necessary.
- What important implementation decisions were made.
- Any relevant behavioural implications.
- Important constraints or trade-offs.

Example:

```text
fix(auth): prevent expired sessions from being reused

Previously, expired sessions could remain in the client-side
state after token refresh failures.

Clear the session and redirect users to authentication when
the refresh operation cannot be completed.
```

Do not repeat the subject in the body.

Avoid unnecessary implementation details that do not help future maintainers understand the change.

## 7. Breaking Changes

A breaking change is any modification that introduces an incompatibility for consumers or requires them to change existing usage.

Indicate breaking changes using `!` after the type or scope.

Example:

```text
feat(api)!: replace legacy webhook payload structure
```

Include a `BREAKING CHANGE:` footer explaining the incompatibility and migration requirements.

```text
feat(api)!: replace legacy webhook payload structure

BREAKING CHANGE: The `event_type` property has been renamed
to `eventType`. Consumers must update their payload handling.
```

Guidelines:

- Use `!` when the change is breaking.
- Include a `BREAKING CHANGE:` footer with a clear explanation.
- Describe what changed and what consumers must do.
- Do not classify internal refactoring as breaking when the public contract remains compatible.

A breaking change can accompany any commit type, not only `feat`.

## 8. Footer Conventions

Use footers for metadata and references.

### Issue references

```text
fix(auth): handle invalid refresh tokens

Fixes #123
```

Other examples:

```text
Refs #123
Closes #456
```

Use issue references only when the relationship is genuine.

### Breaking change footer

```text
BREAKING CHANGE: Remove support for the deprecated configuration option.
```

### Multiple footers

```text
feat(api): add webhook retry support

Introduce configurable retry handling for failed webhook deliveries.

Refs #123
Reviewed-by: Jane Doe
```

Do not invent issue numbers, reviewers, or other metadata.

## 9. Commit Granularity

Prefer commits that represent one logical change.

A commit may contain multiple files when they contribute to the same logical outcome.

Guidelines:

- Avoid combining unrelated changes.
- Separate independent features and fixes where practical.
- Keep refactoring separate from behavioural changes when doing so improves reviewability.
- Do not create artificial commits simply to satisfy a particular file count.
- Ensure the commit message describes the complete logical change.

## 10. Choosing the Correct Type

When several types appear applicable, classify the commit based on its primary intent.

Examples:

| Change | Recommended commit |
|---|---|
| Add a new React component | `feat(ui)` |
| Fix a form validation bug | `fix(forms)` |
| Improve rendering performance | `perf(ui)` |
| Extract shared logic without behaviour changes | `refactor(core)` |
| Add component tests | `test(ui)` |
| Update README documentation | `docs` |
| Update pnpm dependencies | `build(deps)` |
| Add GitHub Actions workflow | `ci` |
| Reformat files without behaviour changes | `style` |
| Remove unused development configuration | `chore` |

When a change introduces both a new feature and supporting refactoring, classify it by the primary user-facing outcome.

## 11. Semantic Versioning

Conventional Commits provides a convention for communicating semantic impact.

The typical mapping is:

| Commit | Semantic version impact |
|---|---|
| `fix` | PATCH |
| `feat` | MINOR |
| Any type with `!` | MAJOR |
| `BREAKING CHANGE:` footer | MAJOR |

Other commit types do not automatically imply a release.

Important:
- These mappings depend on the release tool's configuration.
- A commit message does not itself update package versions.
- Release tooling must be configured to interpret the commit conventions.
- A repository using Changesets should use Changeset files as its source of truth for package versioning unless its release process explicitly combines both systems.

## 12. Changesets Integration

When the repository uses Changesets:

- Conventional Commits describe the intent of individual commits.
- Changeset files declare the release impact of package changes.
- Changesets determines package version updates and changelog generation.
- The presence of a `feat` or `fix` commit does not replace the requirement for a Changeset where repository policy requires one.

Example commit:

```text
feat(auth): add OAuth token refresh support
```

Corresponding Changeset:

```markdown
---
"@scope/package": minor
---

Add OAuth token refresh support.
```

Do not infer that every commit type must produce a Changeset. Follow the repository's Changesets contribution policy.

## 13. Reviewing Existing Commit Messages

When reviewing a proposed commit message:

1. Check that it follows the required structure.
2. Verify that the type accurately describes the change.
3. Verify that the scope reflects the affected area.
4. Check that the description is concise and specific.
5. Identify missing breaking change indicators or explanations.
6. Check that issue references and metadata are accurate.
7. Ensure the message reflects the actual code changes.

When a message is invalid or unclear, provide a corrected version and briefly explain the improvement.

Do not rewrite valid messages merely to enforce personal stylistic preferences.

## 14. AI-Assisted Commit Generation

When asked to generate a commit message:

1. Inspect the staged changes or supplied diff.
2. Identify the primary purpose of the changes.
3. Determine the appropriate commit type and scope.
4. Check whether the change introduces a breaking change.
5. Produce a message that accurately describes the changes.
6. Include a body only when additional context is useful.
7. Include issue references only when supplied or verifiable.

If the diff contains unrelated changes, identify the distinct logical changes rather than hiding them under a generic commit message.

Never assume a change is a feature simply because it adds files.

Never claim a bug was fixed without evidence of the original behaviour and the correction.

### Output format

When asked for a commit message, return the recommended message in a code block.

When useful, provide a short explanation of the selected type and scope.

Do not generate or execute a Git commit unless explicitly requested.

## 15. Final Checklist

Before accepting a commit message, verify:

- [ ] Uses the Conventional Commits structure.
- [ ] Has an accurate commit type.
- [ ] Uses a meaningful scope where appropriate.
- [ ] Has a clear, concise imperative description.
- [ ] Does not end the subject with a period.
- [ ] Includes a body only when useful.
- [ ] Identifies breaking changes correctly.
- [ ] Includes valid footers and issue references.
- [ ] Describes the actual changes.
- [ ] Follows the repository's release and Changesets conventions.
