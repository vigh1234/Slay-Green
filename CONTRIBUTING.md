# Contributing

## Workflow

1. Branch from `main`: `git switch -c feat/short-description`
   (prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`).
2. Make focused commits using [Conventional Commits](https://www.conventionalcommits.org):
   `feat(client): add battery swap filter`, `fix(server): validate payment amount`.
3. Push the branch and open a Pull Request against `main`.
4. CI (lint + build) must pass and at least one reviewer must approve before merging.
   `main` is protected: no direct pushes.

## Local setup

See the [README](README.md#quick-start). Copy `server/.env.example` to
`server/.env` and `client/.env.example` to `client/.env`.

## Before you push

```bash
cd client && npm run lint && npm run build
```

Never commit secrets. If you spot a leaked key, follow [SECURITY.md](SECURITY.md).
