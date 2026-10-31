import { readdir, stat, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const distDirectory = new URL('../dist/', import.meta.url)
const maxBytes = 750 * 1024
const measuredExtensions = new Set(['.js', '.css', '.html'])

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(directory.pathname, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(new URL(`${entry.name}/`, directory.href))))
    } else if (measuredExtensions.has(entry.name.slice(entry.name.lastIndexOf('.')))) {
      files.push(path)
    }
  }

  return files
}

const files = await collectFiles(distDirectory)
const assets = await Promise.all(
  files.map(async (path) => ({
    file: relative(distDirectory.pathname, path),
    bytes: (await stat(path)).size,
  })),
)
const totalBytes = assets.reduce((total, asset) => total + asset.bytes, 0)
const report = { maxBytes, totalBytes, assets: assets.sort((a, b) => b.bytes - a.bytes) }

await writeFile('asset-size-report.json', `${JSON.stringify(report, null, 2)}\n`)
console.log(
  `Measured ${assets.length} JS/CSS/HTML assets: ${totalBytes} bytes (budget: ${maxBytes})`,
)

if (totalBytes > maxBytes) {
  console.error('Asset-size budget exceeded.')
  process.exitCode = 1
}
