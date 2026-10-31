# Security policy

## Supported versions

Only the latest patch release in the `0.1.x` line is currently supported with
security fixes. The current package baseline is `0.1.0`; the GitHub publication
status is maintained in the [SemVer release process](docs/release-process.md).
Versions older than `0.1.x` are not supported.

| Version                | Supported |
| ---------------------- | --------- |
| `0.1.x` (latest patch) | Yes       |
| `< 0.1.0`              | No        |

## Reporting a vulnerability

Please do not open a public issue, pull request, or discussion for a suspected
vulnerability. Use the repository's **Security** tab to create a private
security advisory and include:

- a clear description of the issue and its impact;
- affected versions, browsers, environments, or workflow paths;
- reproducible steps or a minimal proof of concept;
- any suggested mitigation; and
- whether the report is already known or publicly disclosed.

If private vulnerability reporting is not enabled, contact a maintainer
privately through the repository contact mechanism or a maintainer listed in
[CODEOWNERS](.github/CODEOWNERS). Do not send sensitive details through a
public channel.

Maintainers will acknowledge a report within 5 business days, provide an
initial assessment within 10 business days, and coordinate disclosure after a
fix or mitigation is available. Timelines can change when a report requires
coordination with a hosting or browser provider.

## Scope notes

The deployed app is a static client application. Reports involving microphone
permissions, browser speech behavior, third-party fonts, Azure Static Web Apps,
GitHub Actions, or Terraform are in scope when AlphaFun's configuration or
code creates the risk.

## Security alert review and closure

The maintainer team owns alerts in the repository's Security tab. Maintainers
review new Dependabot, dependency-review, CodeQL, secret-scanning, and
workflow-pinning alerts at least weekly and triage them as follows:

- Critical and high severity alerts are acknowledged immediately and assigned
  an owner. The owner records the affected package, workflow, or file; the
  vulnerable version; exploitability in AlphaFun; and the planned mitigation.
- Moderate and low severity alerts are reviewed during the next weekly
  maintenance pass. False positives are closed only after the maintainer
  records why the vulnerable code is unreachable, not shipped, or otherwise
  mitigated.
- Fixes are made through reviewed pull requests. Dependency updates must keep
  `pnpm-lock.yaml` and `infra/.terraform.lock.hcl` consistent; CI's frozen
  install and Terraform validation are required checks. Changes to workflows,
  dependency configuration, lockfiles, and devcontainer definitions require
  CODEOWNERS review.
- An accepted temporary exception must name an owner, affected alert, reason,
  compensating control, and expiry date. Expired exceptions are re-triaged;
  exceptions are never used to suppress secret-scanning findings without
  documented administrator approval.
- An alert is closed only after the remediation or exception is recorded and
  the relevant scanner has passed on the default branch. Reopened alerts are
  treated as new alerts.

Repository administrators must enable GitHub secret scanning and push
protection in the repository or organization settings, where the plan supports
those features. Push protection bypasses require a documented reason and
maintainer review. The `Security - Repository settings` workflow audits these
settings weekly or when manually dispatched and fails when they are disabled.

The active `Main Protect` branch ruleset must require at least one approving
review, CODEOWNERS review, and these pull-request checks:

- `Validate: Pull Request`
- `Browser and PWA`
- `Review dependency changes`
- `Analyze JavaScript and TypeScript`
- `Verify workflow action pins`

These settings cannot be enabled by a repository file, so an administrator must
configure the ruleset and private vulnerability reporting before the workflow
can pass.
