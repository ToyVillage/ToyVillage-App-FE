import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import {
  getMockCloseSchedules,
  mockCloseSchedules,
  type CloseSchedule,
} from '@/entities/close-schedule'
import { CreateCloseScheduleButton } from '@/features/create-close-schedule'
import arrowIcon from './ui/assets/arrow.svg'
import filterIcon from './ui/assets/filter.svg'
import searchIcon from './ui/assets/search.svg'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

interface CalendarDay {
  key: string
  date: Date
  inMonth: boolean
  schedules: CloseSchedule[]
}

export function NoticeGuidePage() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const { data: schedules = mockCloseSchedules } = useQuery({
    queryKey: ['close-schedules'],
    queryFn: getMockCloseSchedules,
    placeholderData: mockCloseSchedules,
  })

  const monthSchedules = useMemo(
    () => filterSchedulesByMonth(schedules, month),
    [month, schedules],
  )
  const filteredSchedules = useMemo(
    () => filterSchedulesByQuery(monthSchedules, query),
    [monthSchedules, query],
  )
  const calendarDays = useMemo(
    () => createCalendarDays(month, monthSchedules),
    [month, monthSchedules],
  )

  return (
    <Page>
      <Content>
        <Header>
          <div>
            <Title>휴관일 관리</Title>
            <Subtitle>토이빌리지의 휴관 일정 확인 및 조율</Subtitle>
          </div>
          <CreateCloseScheduleButton />
        </Header>

        <MainGrid>
          <CalendarSection>
            <CalendarHeader>
              <MonthButton
                type="button"
                aria-label="이전 달"
                onClick={() => setMonth((current) => addMonths(current, -1))}
              >
                <ArrowIcon src={arrowIcon} alt="" $left />
              </MonthButton>
              <MonthTitle>{formatMonthTitle(month)}</MonthTitle>
              <MonthButton
                type="button"
                aria-label="다음 달"
                onClick={() => setMonth((current) => addMonths(current, 1))}
              >
                <ArrowIcon src={arrowIcon} alt="" />
              </MonthButton>
            </CalendarHeader>

            <WeekHeader>
              {DAYS.map((day) => (
                <WeekCell key={day}>{day}</WeekCell>
              ))}
            </WeekHeader>

            <CalendarGrid>
              {calendarDays.map((day) => (
                <DayCell
                  key={day.key}
                  aria-label={`${formatFullDate(day.date)}${
                    day.schedules.length > 0 ? ' 휴관 일정 있음' : ''
                  }`}
                >
                  <DayNumber $muted={!day.inMonth}>
                    {day.date.getDate()}
                  </DayNumber>
                  {day.schedules.length > 0 && (
                    <ClosedMarker aria-hidden="true">휴관</ClosedMarker>
                  )}
                </DayCell>
              ))}
            </CalendarGrid>
          </CalendarSection>

          <Aside>
            <SearchBar>
              <SearchIcon src={searchIcon} alt="" />
              <SearchInput
                aria-label="휴관 일정 검색"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <FilterButton
                type="button"
                aria-label="휴관 일정 필터"
                aria-expanded={filterOpen}
                onClick={() => setFilterOpen((open) => !open)}
              >
                <FilterIcon src={filterIcon} alt="" />
              </FilterButton>
            </SearchBar>

            {filterOpen && (
              <FilterNotice role="status">
                필터 옵션은 준비 중입니다
              </FilterNotice>
            )}

            {filteredSchedules.length > 0 ? (
              <CardList aria-label="휴관 일정 목록">
                {filteredSchedules.map((schedule) => (
                  <ScheduleCard key={schedule.id}>
                    <CardDate>{formatScheduleRange(schedule)}</CardDate>
                    <CardTitle>{schedule.title}</CardTitle>
                  </ScheduleCard>
                ))}
              </CardList>
            ) : (
              <EmptyState>아직 추가된 휴관일이 없습니다</EmptyState>
            )}
          </Aside>
        </MainGrid>
      </Content>
    </Page>
  )
}

function createCalendarDays(month: Date, schedules: CloseSchedule[]) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index): CalendarDay => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)

    return {
      key: toDateKey(date),
      date,
      inMonth: date.getMonth() === month.getMonth(),
      schedules: schedules.filter((schedule) =>
        isDateWithinSchedule(date, schedule),
      ),
    }
  })
}

function filterSchedulesByMonth(schedules: CloseSchedule[], month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1)
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)

  return schedules.filter((schedule) => {
    const scheduleStart = parseDate(schedule.startDate)
    const scheduleEnd = parseDate(schedule.endDate)
    return scheduleStart <= end && scheduleEnd >= start
  })
}

function filterSchedulesByQuery(schedules: CloseSchedule[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return schedules

  return schedules.filter((schedule) => {
    const label = `${formatScheduleRange(schedule)} ${schedule.title}`
    return label.toLowerCase().includes(normalizedQuery)
  })
}

function isDateWithinSchedule(date: Date, schedule: CloseSchedule) {
  const start = parseDate(schedule.startDate)
  const end = parseDate(schedule.endDate)
  return start <= date && date <= end
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatMonthTitle(date: Date) {
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}월`
}

function formatFullDate(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function formatScheduleRange(schedule: CloseSchedule) {
  const start = parseDate(schedule.startDate)
  const end = parseDate(schedule.endDate)
  const startLabel = formatShortDate(start)
  const endLabel = formatShortDate(end)

  return schedule.startDate === schedule.endDate
    ? startLabel
    : `${startLabel} ~ ${endLabel}`
}

function formatShortDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

const Page = styled.main`
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.font.body};
`

const Content = styled.div`
  width: min(100%, ${({ theme }) => theme.layout.contentWidth});
  margin: 0 auto;
  padding-top: calc(
    ${({ theme }) => theme.layout.noticeTop} - ${({ theme }) => theme.space.xl}
  );
`

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.lg};
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.pageTitle};
  font-weight: 600;
  line-height: 1.2;
`

const Subtitle = styled.p`
  margin: ${({ theme }) => theme.space.buttonY} 0 0;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.font.size.subtitle};
  font-weight: 500;
  line-height: 1.2;
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(520px, 756px) minmax(360px, 532px);
  gap: 24px;
  margin-top: 28px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const CalendarSection = styled.section`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.table};
`

const CalendarHeader = styled.div`
  display: flex;
  min-height: 80px;
  align-items: center;
  justify-content: space-between;
  padding: 17px 40px;
  background: ${({ theme }) => theme.colors.surface};
`

const MonthButton = styled.button`
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #848491;
  cursor: pointer;
`

const ArrowIcon = styled.img<{ $left?: boolean }>`
  width: 13px;
  height: 22px;
  transform: rotate(${({ $left }) => ($left ? '180deg' : '0deg')});
`

const MonthTitle = styled.h2`
  margin: 0;
  color: #36363f;
  font-size: ${({ theme }) => theme.font.size.subtitle};
  font-weight: 500;
  line-height: 1.2;
`

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: #dddde3;
`

const WeekCell = styled.div`
  display: flex;
  min-height: 31px;
  align-items: center;
  justify-content: center;
  color: #36363f;
  font-size: ${({ theme }) => theme.font.size.date};
  font-weight: 500;
  line-height: 1.2;
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: ${({ theme }) => theme.colors.surface};
`

const DayCell = styled.div`
  display: flex;
  min-height: 112px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: ${({ theme }) => theme.space.buttonY};
  overflow: hidden;

  @media (min-width: 1280px) {
    min-height: 152px;
  }
`

const DayNumber = styled.span<{ $muted: boolean }>`
  width: 100%;
  color: ${({ $muted }) => ($muted ? '#848491' : '#36363f')};
  font-size: ${({ $muted }) => ($muted ? '18px' : '20px')};
  font-weight: ${({ $muted }) => ($muted ? 500 : 600)};
  line-height: 1.2;
`

const ClosedMarker = styled.span`
  display: inline-flex;
  width: min(100%, 84px);
  min-height: 32px;
  align-items: center;
  justify-content: center;
  background: #ff7d7d;
  color: ${({ theme }) => theme.colors.surface};
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
`

const Aside = styled.aside`
  position: relative;
  min-height: 360px;
`

const SearchBar = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: 12px 16px;
  border-radius: 44px;
  background: ${({ theme }) => theme.colors.surface};
`

const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #36363f;
  font: inherit;
`

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
`

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #848491;
  cursor: pointer;
`

const FilterIcon = styled.img`
  width: 22px;
  height: 20px;
  flex: 0 0 22px;
`

const FilterNotice = styled.p`
  margin: ${({ theme }) => theme.space.sm} 0 0;
  padding: 0 ${({ theme }) => theme.space.md};
  color: #848491;
  font-size: ${({ theme }) => theme.font.size.category};
  font-weight: 500;
`

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: ${({ theme }) => theme.space.lg};
`

const ScheduleCard = styled.article`
  display: flex;
  min-height: 88px;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 18px 40px;
  border-radius: ${({ theme }) => theme.radius.table};
  background: ${({ theme }) => theme.colors.surface};
  color: #36363f;
`

const CardDate = styled.strong`
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
`

const CardTitle = styled.span`
  font-size: ${({ theme }) => theme.font.size.tableHeader};
  font-weight: 500;
  line-height: 1.2;
`

const EmptyState = styled.p`
  position: absolute;
  top: 250px;
  left: 50%;
  margin: 0;
  color: #afafba;
  font-size: ${({ theme }) => theme.font.size.date};
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  transform: translateX(-50%);
`
