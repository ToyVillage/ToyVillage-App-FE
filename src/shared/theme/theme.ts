import { tokens } from './tokens'

// Emotion ThemeProvider에 주입되는 테마 객체.
export const theme = {
  colors: tokens.color,
  space: tokens.space,
  radius: tokens.radius,
  font: tokens.font,
  layout: tokens.layout,
} as const

export type AppTheme = typeof theme
