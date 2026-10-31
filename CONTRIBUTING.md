# Contributing

## Development setup

```bash
npm ci
npm run dev
```

Before opening a pull request, run:

```bash
npm run lint
npm run build
git diff --check
```

## Branches and commits

- Create short-lived branches from `main`, for example `feat/recovery-export`.
- Use Conventional Commits, for example `fix: correct weight-bearing label`.
- Keep each pull request focused on one problem.
- Do not commit secrets, generated build output, or personal recovery data.

## Pull requests

Describe the motivation, scope, verification evidence, user impact, and
rollback plan. Link related issues with `Closes #123`.

By contributing, you agree that your contribution is licensed under the
repository's MIT License.
