#!/usr/bin/env node
// pre-commit-gate.mjs — 커밋 경계에서 게이트 강제(#2). 에이전트 선의에 의존하지 않는 실제 강제점.
// 스테이징된 feature 코드가 있으면, 대응 승인(harness/approvals/<feature>.approved.json)이
// 유효해야만 커밋을 허용한다. (Claude/Codex/사람 모두 동일)
//
// feature → 소유 경로 매핑은 harness/specs/<feature>.spec.md frontmatter 의 `paths:` 로 선언한다.
// paths 미선언 feature 는 강제 대상에서 제외(경고).

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// 스테이징된 파일
const staged = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], {
  encoding: 'utf8',
})
  .stdout.split('\n')
  .map((s) => s.trim())
  .filter(Boolean)

// specs 로드 → feature + paths
const specsDir = join(root, 'harness', 'specs')
const features = []
if (existsSync(specsDir)) {
  for (const f of readdirSync(specsDir)) {
    if (!f.endsWith('.spec.md')) continue
    const src = readFileSync(join(specsDir, f), 'utf8')
    const feature = (src.match(/^feature:\s*(.+)$/m)?.[1] ?? f.replace('.spec.md', '')).trim()
    const pathsLine = src.match(/^paths:\s*(.+)$/m)?.[1]
    const paths = pathsLine
      ? pathsLine.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean)
      : []
    features.push({ feature, paths })
  }
}

const blocked = []
const warned = []
for (const { feature, paths } of features) {
  if (paths.length === 0) continue // 강제 불가(경고는 아래)
  const touched = staged.some((s) => paths.some((p) => s === p || s.startsWith(p + '/') || s.startsWith(p)))
  if (!touched) continue
  const gate = spawnSync('node', [join(root, 'scripts', 'gate-check.mjs'), feature], {
    encoding: 'utf8',
  })
  if (gate.status !== 0) {
    let reason = ''
    try {
      reason = JSON.parse(gate.stdout).reason ?? ''
    } catch {
      reason = (gate.stdout || gate.stderr || '').trim()
    }
    blocked.push({ feature, reason })
  }
}

// paths 미선언인데 src 변경이 있는 feature 는 경고(강제는 못 함)
const stagedSrc = staged.some((s) => s.startsWith('src/'))
for (const { feature, paths } of features) {
  if (paths.length === 0 && stagedSrc) warned.push(feature)
}

if (warned.length) {
  console.warn(
    `[pre-commit] ⚠️ paths 미선언 feature(${warned.join(', ')}) — 게이트 강제 불가. spec frontmatter에 paths 추가 권장.`,
  )
}

if (blocked.length) {
  console.error('\n[pre-commit] ❌ 승인 게이트 미통과 — 커밋 거부:')
  for (const b of blocked) console.error(`  - ${b.feature}: ${b.reason}`)
  console.error('\n해결: node scripts/approve.mjs <feature> --by <name> --scenarios ...  (또는 --freeze)')
  process.exit(1)
}
process.exit(0)
