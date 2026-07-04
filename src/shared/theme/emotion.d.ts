import '@emotion/react'
import type { AppTheme } from './theme'

// styled/css의 ({ theme }) 자동완성을 위해 Emotion Theme을 앱 테마로 확장.
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends AppTheme {}
}
