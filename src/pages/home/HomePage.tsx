import styled from '@emotion/styled'

export function HomePage() {
  return (
    <Main>
      <Title>ToyVillage</Title>
      <Desc>FSD-lite 구조로 초기화된 프로젝트입니다.</Desc>
    </Main>
  )
}

const Main = styled.main`
  padding: 32px;
  font-family: ${({ theme }) => theme.font.body};
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 8px;
`

const Desc = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`
