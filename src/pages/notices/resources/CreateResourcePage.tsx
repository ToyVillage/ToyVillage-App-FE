import styled from '@emotion/styled'

// 슬라이스 스텁: "자료 추가하기" 이동 대상. 업로드 폼(pdf/jpg·jpeg/png/기타 제한)은 추후.
export function CreateResourcePage() {
  return (
    <Page>
      <Title>자료 추가</Title>
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
