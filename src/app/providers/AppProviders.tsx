import type { ReactNode } from 'react'
import { ThemeProvider } from '@emotion/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { theme } from '@/shared/theme/theme'
import { queryClient } from '@/shared/config/queryClient'

// 앱 전역 Provider 조립: 서버상태(TanStack) / 테마(Emotion) / 라우팅(React Router)
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
