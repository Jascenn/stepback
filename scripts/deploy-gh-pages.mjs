import { execSync } from 'node:child_process'
import { cpSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const deployDir = join(root, '.gh-pages')
const repo = 'Jascenn/stepback'

rmSync(deployDir, { recursive: true, force: true })
mkdirSync(deployDir, { recursive: true })
cpSync(dist, deployDir, { recursive: true })
writeFileSync(join(deployDir, '.nojekyll'), '')

execSync('git init', { cwd: deployDir, stdio: 'inherit' })
execSync('git checkout -b gh-pages', { cwd: deployDir, stdio: 'inherit' })
execSync('git add -A', { cwd: deployDir, stdio: 'inherit' })
execSync('git commit -m "Deploy StepBack MVP"', { cwd: deployDir, stdio: 'inherit' })
execSync(`git push -f https://github.com/${repo}.git gh-pages`, { cwd: deployDir, stdio: 'inherit' })

console.log(`\n✅ Deployed: https://jascenn.github.io/stepback/`)