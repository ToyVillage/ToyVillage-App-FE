import styled from '@emotion/styled'

export type Meridiem = 'AM' | 'PM'

export interface TimeParts {
  hour: string
  minute: string
  meridiem: Meridiem
}

interface OperatingTimeFieldProps {
  label: string
  value: TimeParts
  onChange: (value: TimeParts) => void
}

export function OperatingTimeField({
  label,
  value,
  onChange,
}: OperatingTimeFieldProps) {
  function updateNumber(part: 'hour' | 'minute', nextValue: string) {
    onChange({
      ...value,
      [part]: nextValue.replace(/\D/g, '').slice(0, 2),
    })
  }

  function normalizeNumber(part: 'hour' | 'minute') {
    const nextValue = value[part]
    if (!nextValue) return
    onChange({ ...value, [part]: nextValue.padStart(2, '0') })
  }

  return (
    <Card role="group" aria-label={label}>
      <Label>{label}</Label>
      <TimeRow>
        <TimeInput
          aria-label={`${label} 시`}
          inputMode="numeric"
          maxLength={2}
          value={value.hour}
          onBlur={() => normalizeNumber('hour')}
          onChange={(event) => updateNumber('hour', event.target.value)}
        />
        <TimeInput
          aria-label={`${label} 분`}
          inputMode="numeric"
          maxLength={2}
          value={value.minute}
          onBlur={() => normalizeNumber('minute')}
          onChange={(event) => updateNumber('minute', event.target.value)}
        />
        <PeriodGroup role="group" aria-label={`${label} 오전 오후 선택`}>
          <PeriodButton
            type="button"
            aria-pressed={value.meridiem === 'AM'}
            $selected={value.meridiem === 'AM'}
            onClick={() => onChange({ ...value, meridiem: 'AM' })}
          >
            오전
          </PeriodButton>
          <PeriodButton
            type="button"
            aria-pressed={value.meridiem === 'PM'}
            $selected={value.meridiem === 'PM'}
            onClick={() => onChange({ ...value, meridiem: 'PM' })}
          >
            오후
          </PeriodButton>
        </PeriodGroup>
      </TimeRow>
    </Card>
  )
}

const Card = styled.div`
  display: flex;
  width: ${({ theme }) => theme.layout.createDateWidth};
  min-width: 0;
  min-height: ${({ theme }) => theme.layout.createDateHeight};
  flex-direction: column;
  gap: ${({ theme }) => theme.space.buttonY};
  padding: ${({ theme }) => theme.space.tableX};
  border-radius: ${({ theme }) => theme.radius.table};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.layout.createBreakpoint}) {
    width: 100%;
  }
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textStrong};
  font-size: ${({ theme }) => theme.font.size.tableHeader};
  font-weight: 500;
  line-height: 1.2;
  text-decoration: underline;
`

const TimeRow = styled.div`
  display: flex;
  width: ${({ theme }) => theme.layout.operatingTimeRowWidth};
  max-width: 100%;
  gap: ${({ theme }) => theme.space.buttonY};
`

const TimeInput = styled.input`
  width: 0;
  min-width: 0;
  height: ${({ theme }) => theme.layout.createFieldHeight};
  flex: 1 1 0;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  outline: 0;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: ${({ theme }) => theme.font.size.subtitle};
  font-weight: 500;
  line-height: 1.2;
  text-align: center;

  &:focus-visible {
    outline: ${({ theme }) => theme.radius.sm} solid
      ${({ theme }) => theme.colors.primary};
    outline-offset: ${({ theme }) => theme.space.xs};
  }
`

const PeriodGroup = styled.div`
  display: flex;
  width: ${({ theme }) => theme.layout.operatingPeriodWidth};
  height: ${({ theme }) => theme.layout.createFieldHeight};
  flex: 0 0 ${({ theme }) => theme.layout.operatingPeriodWidth};
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
`

const PeriodButton = styled.button<{ $selected: boolean }>`
  display: flex;
  min-height: 0;
  flex: 1 1 50%;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.text : theme.colors.textFaint};
  cursor: pointer;
  font: inherit;
  font-size: ${({ theme }) => theme.font.size.category};
  font-weight: 500;
  line-height: 1;

  &:focus-visible {
    outline: ${({ theme }) => theme.radius.sm} solid
      ${({ theme }) => theme.colors.primary};
    outline-offset: calc(-1 * ${({ theme }) => theme.space.xs});
  }
`
