# Changesets

Add a Changeset to each pull request that changes the published package. Run
`pnpm changeset` and select the package and semantic version bump, or add a
Markdown file containing frontmatter such as:

```md
---
"@victorolorunfemi/shared-frontend-skills": patch
---

Describe the user-facing change.
```

Changesets are required for changes to `src/`, `skills/`, and release-affecting
package metadata. Documentation-only and CI/configuration-only changes do not
need one.
