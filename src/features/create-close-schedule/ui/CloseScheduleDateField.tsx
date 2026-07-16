import { forwardRef } from 'react'
import styled from '@emotion/styled'

interface CloseScheduleDateFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onTabForward: () => void
}

export const CloseScheduleDateField = forwardRef<
  HTMLInputElement,
  CloseScheduleDateFieldProps
>(function CloseScheduleDateField(
  { id, label, value, onChange, onTabForward },
  ref,
) {
  return (
    <Card>
      <Label htmlFor={id}>{label}</Label>
      <Field>
        <DateText $empty={!value} aria-hidden="true">
          {value ? formatDate(value) : '연도. 일. 월'}
        </DateText>
        <CalendarIcon viewBox="0 0 28 28" aria-hidden="true">
          <path d="M2.333 22.167c0 1.983 1.517 3.5 3.5 3.5h16.334c1.983 0 3.5-1.517 3.5-3.5v-9.334H2.333v9.334Zm19.834-17.5h-2.334V3.5c0-.7-.466-1.167-1.166-1.167S17.5 2.8 17.5 3.5v1.167h-7V3.5c0-.7-.467-1.167-1.167-1.167S8.167 2.8 8.167 3.5v1.167H5.833c-1.983 0-3.5 1.516-3.5 3.5V10.5h23.334V8.167c0-1.984-1.517-3.5-3.5-3.5Z" />
        </CalendarIcon>
        <NativeInput
          ref={ref}
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => {
            if (typeof event.currentTarget.showPicker === 'function') {
              event.currentTarget.showPicker()
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Tab' && !event.shiftKey) {
              event.preventDefault()
              onTabForward()
            }
          }}
        />
      </Field>
    </Card>
  )
})

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${year}. ${month}. ${day}`
}

const Card = styled.div`
  display: flex;
  width: ${({ theme }) => theme.layout.createDateWidth};
  min-height: ${({ theme }) => theme.layout.createDateHeight};
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.layout.createDateLabelGap};
  padding: ${({ theme }) => theme.space.tableX};
  border-radius: ${({ theme }) => theme.radius.table};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.layout.createBreakpoint}) {
    width: 100%;
  }
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textStrong};
  font-size: ${({ theme }) => theme.font.size.title};
  font-weight: 500;
  line-height: 1.2;
`

const Field = styled.div`
  position: relative;
  display: flex;
  min-height: ${({ theme }) => theme.layout.createFieldHeight};
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};

  &:focus-within {
    outline: ${({ theme }) => theme.radius.sm} solid
      ${({ theme }) => theme.colors.primary};
    outline-offset: ${({ theme }) => theme.space.xs};
  }
`

const DateText = styled.span<{ $empty: boolean }>`
  color: ${({ theme, $empty }) =>
    $empty ? theme.colors.textGuide : theme.colors.textStrong};
  font-size: ${({ theme }) => theme.font.size.title};
  font-weight: 500;
  line-height: 1.2;
`

const CalendarIcon = styled.svg`
  width: ${({ theme }) => theme.layout.createCalendarIconSize};
  height: ${({ theme }) => theme.layout.createCalendarIconSize};
  fill: ${({ theme }) => theme.colors.textStrong};
`

const NativeInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
`
