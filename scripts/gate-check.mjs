#!/usr/bin/env node
// gate-check.mjs — 승인 게이트 집행. sentinel <feature>.approved.json 유효성 검사.
// RUNBOOK "Sentinel 유효성 계약" 구현. exit 0=valid, 3=missing, 4=invalid.
//
// 사용: node scripts/gate-check.mjs <feature>

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const feature = process.argv[2]
if (!feature) {
  console.error('usage: node scripts/gate-check.mjs <feature>')
  process.exit(2)
}

function fail(code, reason) {
  console.log(JSON.stringify({ feature, valid: false, reason }))
  process.exit(code)
}

// requires_functional_test 읽기 (spec frontmatter)
const specPath = join(root, 'harness', 'specs', `${feature}.spec.md`)
let requiresFunctional = true
if (existsSync(specPath)) {
  const spec = readFileSync(specPath, 'utf8')
  const m = spec.match(/requires_functional_test:\s*(true|false)/)
  if (m) requiresFunctional = m[1] === 'true'
}

const sentinelPath = join(root, 'harness', 'artifacts', `${feature}.approved.json`)
if (!existsSync(sentinelPath)) fail(3, 'sentinel 없음 — 개발자 승인 필요(게이트 미통과)')

let data
try {
  data = JSON.parse(readFileSync(sentinelPath, 'utf8'))
} catch {
  fail(4, 'sentinel JSON 파싱 실패')
}

for (const k of ['feature', 'approvedAt', 'approvedBy', 'scenarioIds']) {
  if (!(k in data)) fail(4, `필수 필드 누락: ${k}`)
}
if (data.feature !== feature) fail(4, `feature 불일치: ${data.feature} != ${feature}`)
if (!Array.isArray(data.scenarioIds)) fail(4, 'scenarioIds 는 배열이어야 함')
if (requiresFunctional && data.scenarioIds.length === 0)
  fail(4, 'requires_functional_test=true 인데 scenarioIds 가 비어있음')

console.log(
  JSON.stringify({
    feature,
    valid: true,
    requiresFunctional,
    scenarioIds: data.scenarioIds,
  }),
)
process.exit(0)
