import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.yarn/**', '.pnp.*', 'node_modules/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // FSD-lite 레이어 경계 규칙: app → pages → features → entities → shared (하향식)
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
    },
    rules: {
      // v6에서 boundaries/dependencies로 리네임 예정(deprecation 경고). 기능은 정상.
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['app', 'pages', 'features', 'entities', 'shared'],
            },
            {
              from: 'pages',
              allow: ['pages', 'features', 'entities', 'shared'],
            },
            { from: 'features', allow: ['features', 'entities', 'shared'] },
            { from: 'entities', allow: ['entities', 'shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },
  // Prettier와 충돌하는 포맷 규칙 비활성화 (항상 마지막)
  prettier,
])
