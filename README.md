# ToyVillage App FE

React + TypeScript + Vite + Emotion + TanStack Query + Zustand + React Router, FSD-lite 구조.

## Publishing Harness (Figma → Code)

개발자의 **행동명세 + Figma 프레임**을 FSD-lite 컴포넌트로 퍼블리싱하는 agent-agnostic 하네스.
어떤 AI 에이전트(Claude Code / Codex)든 **`harness/RUNBOOK.md`**를 동일하게 따른다.

- 계약/규칙: `harness/design-rules.md`, `harness/design-input-contract.md`, `harness/no-progress.md`
- 입력: `harness/specs/<feature>.spec.md` (템플릿: `harness/templates/behavioral-spec.md`)
- 스크립트: `scripts/map-tokens.mjs`(raw 토큰 수집·diff, 읽기전용), `verify.mjs`, `gate-check.mjs`(승인 게이트), `loop-guard.mjs`(N=3+무진전), `run-scenarios.mjs`(= `verify:e2e`)
- 명령: `yarn harness:map-tokens <f>`, `yarn harness:gate <f>`, `yarn harness:loop record <f> …`, `yarn verify`, `yarn verify:e2e <f>`

흐름: Figma 추출 ‖ 시나리오 초안 → 🚦개발자 중간 승인 게이트 → 퍼블리싱 → verify 인너루프 → (조건부)Playwright → 가드레일 → 육안 확인.
참고: 이 저장소 Figma는 Variables 미노출 → 토큰은 raw 수집 후 개발자가 명명(`harness/design-input-contract.md`).

레퍼런스 슬라이스: `notice-list` (공지 목록) — `src/pages/notice`, `tests/e2e/notice-list.spec.ts`.

---

## (template) React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
