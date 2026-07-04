// Figma 토큰 매핑 자리(skeleton). Figma MCP 추출값을 여기에 매핑하되,
// 기존 값과 충돌 시 기존 우선 + diff 보고 원칙(design-rules.md)을 따른다.
export const tokens = {
  color: {
    primary: '#3b82f6',
    text: '#1a1a1a',
    background: '#ffffff',
    border: '#e5e7eb',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  font: {
    body: 'system-ui, -apple-system, sans-serif',
  },
} as const
