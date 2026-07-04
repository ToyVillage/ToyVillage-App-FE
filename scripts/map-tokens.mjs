#!/usr/bin/env node
// map-tokens.mjs — raw 토큰 수집기 + 기존 tokens.ts diff (읽기 전용).
// 이 저장소의 Figma는 Variables를 노출하지 않으므로(설계: design-input-contract.md),
// figma dump에서 raw 값(색/폰트/간격/반경)을 수집해 기존 tokens.ts와 대조만 한다.
// 시맨틱 이름은 자동으로 붙이지 않는다(개발자가 게이트에서 명명).
//
// 사용: node scripts/map-tokens.mjs <feature>
//   입력:  harness/artifacts/<feature>.figma.txt   (에이전트가 get_figma_data 결과를 저장)
//   출력:  harness/artifacts/<feature>.token-candidates.json
//          harness/artifacts/<feature>.token-diff.report.md
// tokens.ts 는 절대 수정하지 않는다.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const feature = process.argv[2]
if (!feature) {
  console.error('usage: node scripts/map-tokens.mjs <feature>')
  process.exit(1)
}

const artifactsDir = join(root, 'harness', 'artifacts')
const figmaPath = join(artifactsDir, `${feature}.figma.txt`)
const tokensPath = join(root, 'src', 'shared', 'theme', 'tokens.ts')

if (!existsSync(figmaPath)) {
  console.error(`[map-tokens] missing figma dump: ${figmaPath}`)
  console.error('  → 에이전트가 get_figma_data 결과를 이 경로에 저장해야 합니다.')
  process.exit(1)
}
if (!existsSync(artifactsDir)) mkdirSync(artifactsDir, { recursive: true })

const figma = readFileSync(figmaPath, 'utf8')
const tokensSrc = existsSync(tokensPath) ? readFileSync(tokensPath, 'utf8') : ''

// 기존 tokens.ts 값 집합 (단일 인용부호 문자열 전부)
const existing = new Set(
  [...tokensSrc.matchAll(/'([^']*)'/g)].map((m) => m[1].toLowerCase()),
)

// --- harvest helpers ---
function countBy(values) {
  const map = new Map()
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map.entries()]
    .map(([value, count]) => ({
      value,
      count,
      matched: existing.has(String(value).toLowerCase()),
    }))
    .sort((a, b) => b.count - a.count)
}

// 색: #RRGGBB
const colors = countBy(
  [...figma.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0].toUpperCase()),
)

// 폰트 family / size / weight
const fontFamilies = countBy(
  [...figma.matchAll(/fontFamily:\s*"?([^"\n,}]+)"?/g)].map((m) => m[1].trim()),
)
const fontSizes = countBy(
  [...figma.matchAll(/fontSize:\s*(\d+)/g)].map((m) => `${m[1]}px`),
)
const fontWeights = countBy(
  [...figma.matchAll(/fontWeight:\s*(\d+)/g)].map((m) => m[1]),
)

// 간격: padding / gap 의 px 값
const spacingRaw = []
for (const m of figma.matchAll(/padding[:=]\s*"?([0-9px\s]+?)"?[,}\n]/g)) {
  for (const px of m[1].matchAll(/(\d+)px/g)) spacingRaw.push(`${px[1]}px`)
}
for (const m of figma.matchAll(/gap[:=]\s*"?(\d+)px/g)) spacingRaw.push(`${m[1]}px`)
const spacing = countBy(spacingRaw)

// 반경: borderRadius
const radius = countBy(
  [...figma.matchAll(/borderRadius[:=]\s*"?(\d+)px/g)].map((m) => `${m[1]}px`),
)

const candidates = { feature, colors, fontFamilies, fontSizes, fontWeights, spacing, radius }
writeFileSync(
  join(artifactsDir, `${feature}.token-candidates.json`),
  JSON.stringify(candidates, null, 2) + '\n',
)

// --- diff report (markdown) ---
function section(title, rows, tokenPathHint) {
  if (rows.length === 0) return `### ${title}\n(없음)\n`
  const lines = rows.map(
    (r) =>
      `| \`${r.value}\` | ${r.count} | ${r.matched ? '✅ matched' : '🆕 new'} | ${r.matched ? '(기존)' : tokenPathHint} |`,
  )
  return [
    `### ${title}`,
    `| 값 | 사용 | 상태 | 제안 tokens.ts 경로 |`,
    `|----|------|------|---------------------|`,
    ...lines,
    '',
  ].join('\n')
}

const newCount = [colors, fontFamilies, fontSizes, fontWeights, spacing, radius]
  .flat()
  .filter((r) => !r.matched).length

const report = [
  `# Token Diff Report — ${feature}`,
  '',
  `> Figma Variables 미노출 → raw 수집 + 기존값 대조. 시맨틱 이름은 개발자가 figma-review.md에서 부여.`,
  `> tokens.ts 는 수정되지 않았습니다(읽기 전용). new 항목은 개발자 확인 후 직접 반영.`,
  '',
  `- matched: 기존 tokens.ts 값과 동일`,
  `- new: 기존에 없는 값 → 개발자가 이름 부여(color.* / space.* / radius.* / font.*) 후 반영`,
  `- 신규 후보 개수: **${newCount}**`,
  '',
  section('Colors → color.*', colors, 'color.<name>'),
  section('Font families → font.*', fontFamilies, 'font.<name>'),
  section('Font sizes', fontSizes, '(font size 스케일 검토)'),
  section('Font weights', fontWeights, '(weight)'),
  section('Spacing → space.*', spacing, 'space.<name>'),
  section('Radius → radius.*', radius, 'radius.<name>'),
  '',
  `> 참고: 확정 시 \`color.*\`는 theme.ts에서 \`colors.*\`로 투영됨(color→colors 리네임).`,
].join('\n')

writeFileSync(join(artifactsDir, `${feature}.token-diff.report.md`), report + '\n')

console.log(
  JSON.stringify({
    feature,
    colors: colors.length,
    new: newCount,
    wroteTokens: false,
    outputs: [`${feature}.token-candidates.json`, `${feature}.token-diff.report.md`],
  }),
)
