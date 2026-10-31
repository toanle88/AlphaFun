# Deployment and rollback

## Application deployment

`.github/workflows/deploy.yml` installs the locked pnpm dependencies, runs
type-checking, lint, tests, and the production build, then deploys `dist/` to
Azure Static Web Apps. Pushes to `main` and pull requests targeting `main`
invoke the workflow; pull-request staging deployments are closed when the
pull request closes.

The production build creates the PWA manifest and service worker. Do not
commit `dist/` or generated service-worker output.

## Infrastructure deployment

Changes under `infra/` use `.github/workflows/infrastructure.yml`. Terraform
plan runs first, and the production apply is protected by the GitHub
`production` environment approval. Required Azure and backend values are
provided through GitHub Actions secrets and OIDC; never add them to the
repository.

## Rollback

1. Confirm the deployed commit and identify the last known-good commit or
   release.
2. For an application regression, revert the offending change on a branch,
   open a pull request, and let the normal checks deploy the revert after it is
   merged to `main`. For an urgent incident, use the workflow's manual run only
   with an already reviewed, known-good revision and the required Azure token.
3. For infrastructure regressions, revert the infrastructure change, run the
   Terraform plan, review the diff and state impact, then approve the protected
   production apply.
4. Verify the deployed site, PWA loading, microphone permission behavior, and
   the affected user flow. Record the incident and follow-up work in the
   relevant issue.

Do not delete Terraform state or manually edit Azure resources as a rollback
shortcut. If a rollback could cause data loss or state drift, stop and involve
the infrastructure maintainers before applying it.
