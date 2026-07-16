import { useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  getDefaultOperatingHours,
  getMockOperatingHours,
  updateMockOperatingHours,
  type OperatingHours,
} from '@/entities/operating-hours'
import {
  OperatingTimeField,
  type Meridiem,
  type TimeParts,
} from './OperatingTimeField'

interface OperatingHoursFormProps {
  date: string
}

interface OperatingHoursEditorProps {
  initialHours: OperatingHours
}

export function OperatingHoursForm({ date }: OperatingHoursFormProps) {
  const defaultHours = getDefaultOperatingHours(date)
  const { data: hours = defaultHours } = useQuery({
    queryKey: ['operating-hours', date],
    queryFn: () => getMockOperatingHours(date),
    placeholderData: defaultHours,
  })

  return (
    <OperatingHoursEditor
      key={`${hours.date}-${hours.opensAt}-${hours.closesAt}`}
      initialHours={hours}
    />
  )
}

function OperatingHoursEditor({ initialHours }: OperatingHoursEditorProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [openingTime, setOpeningTime] = useState(() =>
    from24HourTime(initialHours.opensAt),
  )
  const [closingTime, setClosingTime] = useState(() =>
    from24HourTime(initialHours.closesAt),
  )
  const [validationError, setValidationError] = useState('')
  const mutation = useMutation({ mutationFn: updateMockOperatingHours })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidTime(openingTime) || !isValidTime(closingTime)) {
      setValidationError('시간을 확인해 주세요')
      return
    }

    const opensAt = to24HourTime(openingTime)
    const closesAt = to24HourTime(closingTime)
    if (toMinutes(closesAt) <= toMinutes(opensAt)) {
      setValidationError('영업 종료 시간은 시작 시간보다 늦어야 합니다')
      return
    }

    setValidationError('')
    mutation.mutate(
      { date: initialHours.date, opensAt, closesAt },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['operating-hours', initialHours.date],
          })
          navigate('/notices/guide')
        },
      },
    )
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Fields>
        <OperatingTimeField
          label="영업 시작"
          value={openingTime}
          onChange={setOpeningTime}
        />
        <OperatingTimeField
          label="영업 종료"
          value={closingTime}
          onChange={setClosingTime}
        />
      </Fields>
      <Actions>
        <SaveButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '저장 중' : '저장하기'}
        </SaveButton>
      </Actions>
      {(validationError || mutation.isError) && (
        <Status role="status">
          {validationError || '저장하지 못했습니다. 다시 시도해 주세요.'}
        </Status>
      )}
    </Form>
  )
}

function from24HourTime(value: string): TimeParts {
  const [hourValue, minute = '00'] = value.split(':')
  const hour = Number(hourValue)
  const meridiem: Meridiem = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return {
    hour: String(displayHour).padStart(2, '0'),
    minute,
    meridiem,
  }
}

function to24HourTime(value: TimeParts) {
  const hour = (Number(value.hour) % 12) + (value.meridiem === 'PM' ? 12 : 0)
  return `${String(hour).padStart(2, '0')}:${value.minute.padStart(2, '0')}`
}

function isValidTime(value: TimeParts) {
  const hour = Number(value.hour)
  const minute = Number(value.minute)
  return (
    /^\d{1,2}$/.test(value.hour) &&
    /^\d{1,2}$/.test(value.minute) &&
    hour >= 1 &&
    hour <= 12 &&
    minute >= 0 &&
    minute <= 59
  )
}

function toMinutes(value: string) {
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

const Form = styled.form`
  width: 100%;
  margin-top: ${({ theme }) => theme.layout.operatingFormGap};
`

const Fields = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.layout.operatingCardGap};

  @media (max-width: ${({ theme }) => theme.layout.createBreakpoint}) {
    flex-direction: column;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.layout.operatingFormGap};
`

const SaveButton = styled.button`
  width: ${({ theme }) => theme.layout.createButtonWidth};
  height: ${({ theme }) => theme.layout.createButtonHeight};
  padding: 0 ${({ theme }) => theme.space.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  font: inherit;
  font-size: ${({ theme }) => theme.font.size.title};
  font-weight: 600;

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`

const Status = styled.p`
  margin: ${({ theme }) => theme.space.sm} 0 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.size.category};
  text-align: right;
`
