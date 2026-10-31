import staticWebAppConfig from '../public/staticwebapp.config.json'
import packageJson from '../package.json'
import ciWorkflow from '../.github/workflows/ci.yml?raw'
import deployWorkflow from '../.github/workflows/deploy.yml?raw'
import infrastructureWorkflow from '../.github/workflows/infrastructure.yml?raw'
import previewWorkflow from '../.github/workflows/preview.yml?raw'
import dependencyReviewWorkflow from '../.github/workflows/dependency-review.yml?raw'
import codeqlWorkflow from '../.github/workflows/codeql.yml?raw'
import workflowSecurityWorkflow from '../.github/workflows/workflow-security.yml?raw'
import repositorySecurityWorkflow from '../.github/workflows/repository-security.yml?raw'
import dependabotConfig from '../.github/dependabot.yml?raw'
import codeowners from '../.github/CODEOWNERS?raw'
import eslintConfig from '../eslint.config.js?raw'

const workflows = [
  ciWorkflow,
  deployWorkflow,
  infrastructureWorkflow,
  previewWorkflow,
  dependencyReviewWorkflow,
  codeqlWorkflow,
  workflowSecurityWorkflow,
  repositorySecurityWorkflow,
]

describe('deployment security configuration', () => {
  it('pins every third-party action to a full commit SHA', () => {
    const actionRefs = workflows.flatMap((workflow) =>
      [...workflow.matchAll(/^\s{1,}uses:\s{1,}([^\s#]+)(?:\s{1,}#.*)?$/gm)].map(
        (match) => match[1],
      ),
    )

    expect(actionRefs.length).toBeGreaterThan(0)
    actionRefs.forEach((actionRef) => {
      expect(actionRef).toMatch(/^[^@]+@[0-9a-f]{40}$/)
    })
  })

  it('enforces formatting in package scripts and application validation workflows', () => {
    expect(packageJson.scripts['format:check']).toBe('prettier --check .')
    expect(ciWorkflow).toContain('run: pnpm format:check')
    expect(deployWorkflow).toContain('run: pnpm format:check')
  })

  it('does not lint generated test and browser output', () => {
    expect(eslintConfig).toContain("'coverage'")
    expect(eslintConfig).toContain("'playwright-report'")
    expect(eslintConfig).toContain("'test-results'")
  })

  it('keeps production and preview Azure credentials separate', () => {
    expect(deployWorkflow).toContain('secrets.AZURE_STATIC_WEB_APPS_API_TOKEN')
    expect(previewWorkflow).toContain('secrets.AZURE_STATIC_WEB_APPS_PREVIEW_API_TOKEN')
    expect(previewWorkflow).not.toContain('secrets.AZURE_STATIC_WEB_APPS_API_TOKEN')
    expect(deployWorkflow).not.toContain('secrets.AZURE_STATIC_WEB_APPS_PREVIEW_API_TOKEN')
  })

  it('validates manual rollback commits before building', () => {
    expect(deployWorkflow).toContain('source_ref must be a 40-character commit SHA')
    expect(deployWorkflow).toContain('fetch-depth: 0')
    expect(deployWorkflow).toContain('checked_out_sha="$(git rev-parse HEAD)"')
    expect(deployWorkflow).toContain('git merge-base --is-ancestor "${SOURCE_REF}" origin/main')
    expect(deployWorkflow).toContain("source_ref != ''")
  })

  it('scopes OIDC write permission to Terraform jobs', () => {
    expect(infrastructureWorkflow).not.toMatch(/^\s{2}id-token:\s{1,}write$/m)
    expect(infrastructureWorkflow.match(/^\s{6}id-token:\s{1,}write$/gm)).toHaveLength(2)
  })

  it('reviews dependency changes on pull requests', () => {
    expect(dependencyReviewWorkflow).toContain('pull_request:')
    expect(dependencyReviewWorkflow).toContain('actions/dependency-review-action@')
    expect(dependencyReviewWorkflow).toContain('fail-on-severity: high')
  })

  it('runs CodeQL for JavaScript and TypeScript', () => {
    expect(codeqlWorkflow).toContain('pull_request:')
    expect(codeqlWorkflow).toContain('push:')
    expect(codeqlWorkflow).toContain('schedule:')
    expect(codeqlWorkflow).toContain('languages: javascript-typescript')
    expect(codeqlWorkflow).toContain('security-events: write')
  })

  it('checks workflow action pins as a supply-chain control', () => {
    expect(workflowSecurityWorkflow).toContain('pull_request:')
    expect(workflowSecurityWorkflow).toContain('Require full commit SHA action pins')
    expect(workflowSecurityWorkflow).toContain('contents: read')
    expect(workflowSecurityWorkflow).not.toContain('id-token: write')
  })

  it('audits repository security settings and gates lockfile reviews', () => {
    expect(repositorySecurityWorkflow).toContain('pull_request_review:')
    expect(repositorySecurityWorkflow).toContain('pnpm-lock\\.yaml')
    expect(repositorySecurityWorkflow).toContain('infra/\\.terraform\\.lock\\.hcl')
    expect(repositorySecurityWorkflow).toContain('secret_scanning_push_protection')
    expect(repositorySecurityWorkflow).toContain('require_code_owner_reviews')
    expect(repositorySecurityWorkflow).toContain(
      'A lockfile change requires an approving review',
    )
  })

  it('configures dependency monitoring for every supported ecosystem', () => {
    expect(dependabotConfig).toContain('package-ecosystem: npm')
    expect(dependabotConfig).toContain('package-ecosystem: github-actions')
    expect(dependabotConfig).toContain('package-ecosystem: terraform')
    expect(dependabotConfig).toContain('directory: /infra')
    expect(dependabotConfig).toContain('package-ecosystem: devcontainers')
  })

  it('requires maintainer review for dependency and security configuration', () => {
    expect(codeowners).toContain('/package.json @alphafun/maintainers')
    expect(codeowners).toContain('/pnpm-lock.yaml @alphafun/maintainers')
    expect(codeowners).toContain('/infra/.terraform.lock.hcl @alphafun/maintainers')
    expect(codeowners).toContain('/.devcontainer/ @alphafun/maintainers')
    expect(codeowners).toContain('/.github/workflows/ @alphafun/maintainers')
  })

  it('keeps dependency installs and privileged Terraform plans safe for PRs', () => {
    expect(ciWorkflow).toContain('pnpm install --frozen-lockfile')
    expect(infrastructureWorkflow).toContain('terraform init -backend=false')
    expect(infrastructureWorkflow).toContain(
      'github.event.pull_request.head.repo.full_name == github.repository',
    )
  })

  it('validates and promotes one exact Terraform plan', () => {
    expect(infrastructureWorkflow).toContain('pull_request:')
    expect(infrastructureWorkflow).toContain('terraform fmt -check -recursive')
    expect(infrastructureWorkflow).toContain('terraform validate -no-color')
    expect(infrastructureWorkflow).toContain('tflint --format compact')
    expect(infrastructureWorkflow).toContain('checkov --directory . --quiet')
    expect(infrastructureWorkflow).toContain('terraform plan -input=false -no-color -out=tfplan')
    expect(infrastructureWorkflow).toContain('GITHUB_STEP_SUMMARY')
    expect(infrastructureWorkflow).toContain('Comment plan on pull request')
    expect(infrastructureWorkflow).toContain('tfplan-summary.txt')
    expect(infrastructureWorkflow).toContain('(redacted)')
    expect(infrastructureWorkflow).toContain('name: terraform-plan-${{ github.run_id }}')
    expect(infrastructureWorkflow).toContain('terraform apply -input=false plan-artifact/tfplan')
    expect(infrastructureWorkflow).not.toContain('terraform apply -auto-approve')
  })

  it('keeps Terraform backend and environment settings out of source defaults', () => {
    expect(infrastructureWorkflow).toContain('TF_STATE_RESOURCE_GROUP_NAME')
    expect(infrastructureWorkflow).toContain('TF_STATE_STORAGE_ACCOUNT_NAME')
    expect(infrastructureWorkflow).toContain('TF_STATE_CONTAINER_NAME')
    expect(infrastructureWorkflow).toContain('TF_STATE_KEY')
    expect(infrastructureWorkflow).toContain('TF_VAR_resource_group_name')
    expect(infrastructureWorkflow).not.toContain('toanle88sharedsa')
    expect(infrastructureWorkflow).not.toContain('shared-rg')
  })

  it('defines the required Static Web Apps security headers', () => {
    const headers = staticWebAppConfig.globalHeaders

    expect(headers['Content-Security-Policy']).toContain("default-src 'self'")
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'")
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['Permissions-Policy']).toBe('camera=(), geolocation=(), microphone=(self)')
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
  })
})
