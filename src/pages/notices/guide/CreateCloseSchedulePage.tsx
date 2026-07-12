import styled from '@emotion/styled'

// 슬라이스 스텁: "휴관일 생성하기" 이동 대상. 등록 폼 검증은 추후 구현.
export function CreateCloseSchedulePage() {
  return (
    <Page>
      <Title>휴관 일정 등록</Title>
    </Page>
  )
}

const Page = styled.main`
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`
