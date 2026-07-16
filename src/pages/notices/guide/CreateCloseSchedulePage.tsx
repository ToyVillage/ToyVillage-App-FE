import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { CloseScheduleForm } from '@/features/create-close-schedule'

export function CreateCloseSchedulePage() {
  return (
    <Page>
      <Content>
        <BackLink to="/notices/guide">
          <BackIcon viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 4-8 8 8 8" />
          </BackIcon>
          뒤로가기
        </BackLink>
        <CloseScheduleForm />
      </Content>
    </Page>
  )
}

const Page = styled.main`
  min-height: 100vh;
  padding: 0 ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.font.body};
`

const Content = styled.div`
  width: min(100%, ${({ theme }) => theme.layout.contentWidth});
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.layout.createTop};
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  margin: 0 0 ${({ theme }) => theme.layout.createBackGap};
  padding-left: ${({ theme }) => theme.layout.createBackInset};
  color: ${({ theme }) => theme.colors.textGuide};
  font-size: ${({ theme }) => theme.font.size.title};
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;

  &:focus-visible {
    outline: ${({ theme }) => theme.radius.sm} solid
      ${({ theme }) => theme.colors.primary};
    outline-offset: ${({ theme }) => theme.space.xs};
  }
`

const BackIcon = styled.svg`
  width: ${({ theme }) => theme.layout.createBackIconSize};
  height: ${({ theme }) => theme.layout.createBackIconSize};
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
`
