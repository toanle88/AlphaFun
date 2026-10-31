# Security policy

## Supported versions

Only the latest patch release in the `0.1.x` line is currently supported with
security fixes. The initial release is `0.1.0`; versions older than `0.1.x`
are not supported.

| Version | Supported |
| --- | --- |
| `0.1.x` (latest patch) | Yes |
| `< 0.1.0` | No |

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
