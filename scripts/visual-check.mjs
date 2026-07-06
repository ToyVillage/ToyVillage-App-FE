#!/usr/bin/env node
// visual-check.mjs — stage ⑦ 개발자 육안 최종 확인을 durable 기록 + 커밋 경계에서 검증.
// 육안 확인은 사람 몫이라 자동 판정은 못 하지만, "확인했다"는 명시적 서명을
// 요구해 pre-commit 훅이 강제한다(honor-system 아님).
//
// 서명(여러 개 가능, --by 없으면 git user.name 자동):
//   node scripts/visual-check.mjs <feature...> --pass [--by <name>] [--note "..."]
//   node scripts/visual-check.mjs <feature...> --fail [--by <name>] [--note "..."]
//   (짧게)  yarn ok <feature...>          # = --pass, 이름 자동
// 검증(단일):
//   node scripts/visual-check.mjs <feature>     → exit 0 (pass) / 5 (없음·pending·fail)
//
// 기록 위치(durable, Git 커밋): harness/approvals/<feature>.visual-check.json

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const approvalsDir = join(root, 'harness', 'approvals')

const argv = process.argv.slice(2)
const flagValue = (n) => {
  const i = argv.indexOf(n)
  return i >= 0 ? argv[i + 1] : undefined
}
const has = (n) => argv.includes(n)
// positional feature 이름들: --로 시작하지 않고, --by/--note 값이 아닌 것
const valueOf = new Set([flagValue('--by'), flagValue('--note')])
const features = argv.filter((a) => !a.startsWith('--') && !valueOf.has(a))

if (features.length === 0) {
  console.error('usage: visual-check.mjs <feature...> [--pass|--fail] [--by <name>] [--note "..."]')
  process.exit(1)
}

function gitUser() {
  const r = spawnSync('git', ['config', 'user.name'], { encoding: 'utf8' })
  return r.status === 0 ? r.stdout.trim() : ''
}

// 기록 모드
if (has('--pass') || has('--fail')) {
  if (!existsSync(approvalsDir)) mkdirSync(approvalsDir, { recursive: true })
  const by = flagValue('--by') || gitUser() || 'developer'
  const status = has('--pass') ? 'pass' : 'fail'
  for (const feature of features) {
    const rec = {
      feature,
      status,
      checkedBy: by,
      checkedAt: new Date().toISOString(),
      note: flagValue('--note') ?? null,
    }
    writeFileSync(
      join(approvalsDir, `${feature}.visual-check.json`),
      JSON.stringify(rec, null, 2) + '\n',
    )
    console.log(`✓ visual-check ${status}: ${feature} (by ${by})`)
  }
  process.exit(0)
}

// 검증 모드(단일)
const feature = features[0]
const recordPath = join(approvalsDir, `${feature}.visual-check.json`)
if (!existsSync(recordPath)) {
  console.log(JSON.stringify({ feature, ok: false, reason: '육안 확인 기록 없음 — yarn dev로 Figma와 비교 후 확인 서명 필요' }))
  process.exit(5)
}
let rec
try {
  rec = JSON.parse(readFileSync(recordPath, 'utf8'))
} catch {
  console.log(JSON.stringify({ feature, ok: false, reason: 'visual-check JSON 파싱 실패' }))
  process.exit(5)
}
if (rec.status !== 'pass') {
  console.log(JSON.stringify({ feature, ok: false, reason: `육안 확인 status=${rec.status} (pass 아님)` }))
  process.exit(5)
}
console.log(JSON.stringify({ feature, ok: true, checkedBy: rec.checkedBy, checkedAt: rec.checkedAt }))
process.exit(0)
