# Security Policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report vulnerabilities privately through GitHub's
["Report a vulnerability"](../../security/advisories/new) form on this
repository's **Security** 
Include a description, reproduction steps and the potential impact. We aim to
acknowledge reports within 3 business days.

## Handling secrets

- Never commit `.env` files, API keys or credentials. Use `server/.env.example`
  as the template and keep real values in your local `.env` and your hosting
  provider's secret store.
- If a secret is ever committed, **revoke and rotate it immediately**; removing
  it from a later commit does not remove it from Git history.
