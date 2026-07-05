#!/usr/bin/env node
// install-hooks.mjs — git hooks 경로를 .githooks 로 설정(커밋되는 훅, husky 불필요).
// postinstall 에서 자동 실행. git repo 가 아니면 조용히 건너뜀.

import { spawnSync } from 'node:child_process'

const inRepo = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' })
if (inRepo.status !== 0) process.exit(0)

const res = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], { encoding: 'utf8' })
if (res.status === 0) console.log('[hooks] core.hooksPath=.githooks 설정됨')
else process.exit(0)
