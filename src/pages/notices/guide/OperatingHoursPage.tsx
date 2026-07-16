import styled from '@emotion/styled'
import { Navigate, useParams } from 'react-router-dom'
import { OperatingHoursForm } from '@/features/edit-operating-hours'
import { GuideBackLink } from './ui/GuideBackLink'

export function OperatingHoursPage() {
  const { date } = useParams()
  if (!date || !isDateKey(date)) {
    return <Navigate to="/notices/guide" replace />
  }

  return (
    <Page>
      <Content>
        <BackRow>
          <GuideBackLink />
        </BackRow>
        <Title>{formatTitle(date)}</Title>
        <OperatingHoursForm date={date} />
      </Content>
    </Page>
  )
}

function isDateKey(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
  )
}

function formatTitle(value: string) {
  const [, month, day] = value.split('-').map(Number)
  return `${month}월 ${day}일 영업시간`
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
  padding-top: ${({ theme }) => theme.layout.operatingTop};
`

const BackRow = styled.div`
  display: flex;
  height: ${({ theme }) => theme.layout.operatingBackHeight};
  align-items: center;
`

const Title = styled.h1`
  margin: ${({ theme }) => theme.layout.operatingTitleGap} 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.pageTitle};
  font-weight: 600;
  line-height: 1.2;
`
