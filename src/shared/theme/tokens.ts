// 디자인 토큰. Figma는 Variables를 노출하지 않아(harness/design-input-contract.md),
// map-tokens가 수집한 raw 값을 개발자가 게이트에서 시맨틱 이름으로 명명해 여기에 반영한다.
// (notice-list 프레임 기준, 2026-07-05 명명)
export const tokens = {
  color: {
    primary: '#FF8181', // 핑크 강조 (활성 탭/포인트)
    primaryBg: '#FFDDDD', // 핑크 배경 (활성 pill)
    text: '#000000',
    textSub: '#838383', // 부제목
    textMuted: '#7C7C7C', // 비활성 탭
    textDate: '#747474',
    background: '#F5F5F7', // 페이지 배경
    surface: '#FFFFFF', // 카드/테이블 표면
    tableHeader: '#E1E1E1', // 테이블 헤더
    border: '#A1A1A1',
    divider: '#727272',
  },
  space: {
    xs: '4px',
    pillY: '6px',
    sm: '8px',
    controlY: '10px',
    buttonY: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    tableX: '40px',
    navX: '44px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    table: '20px',
    pill: '25px',
    round: '53px',
  },
  font: {
    body: '"Wanted Sans", system-ui, -apple-system, sans-serif',
    size: {
      category: '18px',
      tableHeader: '20px',
      date: '22px',
      title: '24px',
      subtitle: '32px',
      pageTitle: '60px',
    },
  },
  layout: {
    contentWidth: '1320px',
    noticeTop: '124px',
    menuX: '36px',
    menuY: '32px',
    menuSize: '36px',
    plusIcon: '32px',
    tabOffset: '32px',
    tableOffset: '20px',
    tableHeaderHeight: '52px',
    tableRowHeight: '92px',
    tableCategoryWidth: '240px',
    tableTitleWidth: '840px',
    tableDateWidth: '240px',
  },
} as const
