import { useCallback, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createMockCloseSchedule } from '@/entities/close-schedule'
import { CloseScheduleDateField } from './CloseScheduleDateField'
import { ValidationDialog } from './ValidationDialog'

type ValidationError = 'date' | 'title' | 'range'

const validationMessages: Record<ValidationError, string> = {
  date: '휴관일을 입력해 주세요',
  title: '제목을 입력해 주세요',
  range: '종료일은 시작일과 같거나 이후여야 합니다',
}

export function CloseScheduleForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [title, setTitle] = useState('')
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null)
  const mutation = useMutation({ mutationFn: createMockCloseSchedule })

  const handleConfirm = useCallback(() => {
    const error = validationError
    setValidationError(null)

    requestAnimationFrame(() => {
      if (error === 'title') {
        titleRef.current?.focus()
        return
      }

      if (!startDate) {
        startDateRef.current?.focus()
        return
      }

      endDateRef.current?.focus()
    })
  }, [startDate, validationError])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!startDate || !endDate) {
      setValidationError('date')
      return
    }

    if (endDate < startDate) {
      setValidationError('range')
      return
    }

    const normalizedTitle = title.trim()
    if (!normalizedTitle) {
      setValidationError('title')
      return
    }

    mutation.mutate(
      { startDate, endDate, title: normalizedTitle },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['close-schedules'],
          })
          navigate('/notices/guide')
        },
      },
    )
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <DateFields>
        <CloseScheduleDateField
          ref={startDateRef}
          id="close-schedule-start-date"
          label="시작일"
          value={startDate}
          onChange={setStartDate}
          onTabForward={() => endDateRef.current?.focus()}
        />
        <CloseScheduleDateField
          ref={endDateRef}
          id="close-schedule-end-date"
          label="종료일"
          value={endDate}
          onChange={setEndDate}
          onTabForward={() => titleRef.current?.focus()}
        />
      </DateFields>

      <TitleCard>
        <TitleLabel htmlFor="close-schedule-title">
          제목 <Required aria-hidden="true">*</Required>
        </TitleLabel>
        <TitleInput
          ref={titleRef}
          id="close-schedule-title"
          required
          value={title}
          placeholder="제목을 입력해주세요"
          onChange={(event) => setTitle(event.target.value)}
        />
      </TitleCard>

      <Actions>
        <SubmitButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '생성 중' : '생성하기'}
        </SubmitButton>
      </Actions>

      {mutation.isError && (
        <Status role="status">생성하지 못했습니다. 다시 시도해 주세요.</Status>
      )}

      {validationError && (
        <ValidationDialog
          message={validationMessages[validationError]}
          onConfirm={handleConfirm}
        />
      )}
    </Form>
  )
}

const Form = styled.form`
  width: 100%;
`

const DateFields = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 980px) {
    flex-direction: column;
  }
`

const TitleCard = styled.div`
  display: flex;
  min-height: 164px;
  flex-direction: column;
  gap: 8px;
  margin-top: 32px;
  padding: 40px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};
`

const TitleLabel = styled.label`
  color: ${({ theme }) => theme.colors.textStrong};
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
`

const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger};
`

const TitleInput = styled.input`
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textStrong};
  font: inherit;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.2;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textGuide};
    opacity: 1;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 29px;
`

const SubmitButton = styled.button`
  width: 123px;
  height: 61px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  font: inherit;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 4px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`

const Status = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 18px;
  text-align: right;
`
