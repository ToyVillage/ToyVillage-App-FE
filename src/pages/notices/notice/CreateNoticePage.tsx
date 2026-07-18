import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { NoticeForm } from '@/features/create-notice'

export function CreateNoticePage() {
  return (
    <Page>
      <Content>
        <BackLink to="/notices/list">
          <BackIcon viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 4-8 8 8 8" />
          </BackIcon>
          뒤로가기
        </BackLink>
        <Title>공지 생성</Title>
        <NoticeForm />
      </Content>
    </Page>
  )
}

const Page = styled.main`
  min-height: 100vh;
  padding: 0 32px 80px;
  background: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.font.body};
`

const Content = styled.div`
  width: min(100%, 1320px);
  margin: 0 auto;
  padding-top: 80px;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding-left: 6px;
  color: ${({ theme }) => theme.colors.textGuide};
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;

  &:focus-visible {
    outline: 4px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`

const BackIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
`

const Title = styled.h1`
  margin: 36px 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 48px;
  font-weight: 600;
  line-height: 1.2;
`
