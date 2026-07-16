import styled from '@emotion/styled'

// 슬라이스 스텁: "공지 생성하기" 이동 대상. 폼은 추후 구현.
export function CreateNoticePage() {
  return (
    <Page>
      <Title>공지 생성</Title>
    </Page>
  )
}

const Page = styled.main`
  padding: 32px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`
