# Deployment and rollback

## Application deployment

Pull requests targeting `main` run `.github/workflows/ci.yml`, which installs
the locked pnpm dependencies, runs type-checking, lint, tests, and the
production build. `.github/workflows/preview.yml` separately manages the
explicitly named Azure pull-request staging preview and closes it when the
pull request closes.

`.github/workflows/deploy.yml` repeats those validation steps for approved
production candidates, uploads the verified `dist/` artifact once, and deploys
that artifact to Azure Static Web Apps. Production deployment is limited to
pushes to `main`, published releases targeting `main`, or a manually approved
run on `main`; the `production` environment supplies the approval gate.
The deploy job is the only application job that receives the production Azure
token. The separate preview workflow uses the `preview` environment and its
`AZURE_STATIC_WEB_APPS_PREVIEW_API_TOKEN` secret.

Every production run writes its result, source ref, and Azure URL (when the
action returns one) to the workflow run summary. The run's deployment job and
the protected `production` environment are the authoritative status records.

The production build creates the PWA manifest and service worker. Do not
commit `dist/` or generated service-worker output.

Repository administrators must configure the GitHub `production` environment
with required reviewers and a deployment branch/tag rule limited to approved
production refs (normally `main` and published releases). Store
`AZURE_STATIC_WEB_APPS_API_TOKEN` only in that environment. Configure the
separate `preview` environment with its own
`AZURE_STATIC_WEB_APPS_PREVIEW_API_TOKEN`; never reuse the production token for
pull-request previews.

## Infrastructure deployment

Changes under `infra/` use `.github/workflows/infrastructure.yml`. Terraform
plan runs first, and the production apply is protected by the GitHub
`production` environment approval. Required Azure and backend values are
provided through GitHub Actions secrets and OIDC; never add them to the
repository.

## Rollback

1. Open the latest `02 - App Deploy (Production)` run, record its source ref,
   job status, environment approval, and URL from the run summary, and identify
   the last known-good commit or release.
2. Prefer reverting the offending change on a branch, opening a pull request,
   and merging it through the normal checks. For an urgent application rollback,
   run the workflow manually from `main`, enter the reviewed known-good commit
   SHA in the optional `source_ref` input, and wait for the required
   `production` environment approval. The workflow accepts only a full
   40-character commit SHA, verifies that checkout resolved to that exact
   commit, and requires it to be an ancestor of `main`. This input changes
   only the checked-out build source; it does not bypass validation or
   approval.
3. For an infrastructure regression, revert the Terraform change, run the
   Terraform plan, review the diff and state impact, then approve the protected
   production apply. Do not use the application rollback input for Terraform.
4. Verify the restored URL and run summary, app/PWA loading, the configured
   security headers (including CSP, referrer, and permissions policy),
   microphone permission behavior, and the affected user flow. Record the
   incident and follow-up work in the relevant issue.

Do not delete Terraform state or manually edit Azure resources as a rollback
shortcut. If a rollback could cause data loss or state drift, stop and involve
the infrastructure maintainers before applying it.
