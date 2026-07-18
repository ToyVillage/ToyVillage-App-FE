import { useCallback, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  createMockNotice,
  noticeCategories,
  type CreateNoticeInput,
} from '@/entities/notice'
import { ValidationDialog } from '@/shared/ui'

type FieldName = keyof CreateNoticeInput

const validationMessages: Record<FieldName, string> = {
  category: '분류를 선택해 주세요',
  title: '제목을 입력해 주세요',
  content: '내용을 입력해 주세요',
}

const createCategories = noticeCategories.filter(
  (category) => category !== '전체',
)

export function NoticeForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const submittingRef = useRef(false)
  const categoryRef = useRef<HTMLSelectElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [validationError, setValidationError] = useState<FieldName | null>(null)
  const mutation = useMutation({ mutationFn: createMockNotice })

  const handleConfirm = useCallback(() => {
    const error = validationError
    setValidationError(null)

    requestAnimationFrame(() => {
      if (error === 'category') {
        categoryRef.current?.focus()
        return
      }

      if (error === 'title') {
        titleRef.current?.focus()
        return
      }

      contentRef.current?.focus()
    })
  }, [validationError])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    const input: CreateNoticeInput = {
      category,
      title: title.trim(),
      content: content.trim(),
    }
    const nextError = validate(input)

    if (nextError) {
      setValidationError(nextError)
      return
    }

    setValidationError(null)
    submittingRef.current = true
    mutation.mutate(input, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['notices'] })
        navigate('/notices/list')
      },
      onError: () => {
        submittingRef.current = false
      },
    })
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FieldCard>
        <Label htmlFor="notice-category">
          분류 <Required aria-hidden="true">*</Required>
        </Label>
        <Select
          ref={categoryRef}
          id="notice-category"
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">분류를 선택해주세요</option>
          {createCategories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </FieldCard>

      <FieldCard>
        <Label htmlFor="notice-title">
          제목 <Required aria-hidden="true">*</Required>
        </Label>
        <TitleInput
          ref={titleRef}
          id="notice-title"
          required
          value={title}
          placeholder="제목을 입력해주세요"
          onChange={(event) => setTitle(event.target.value)}
        />
      </FieldCard>

      <FieldCard>
        <Label htmlFor="notice-content">
          내용 <Required aria-hidden="true">*</Required>
        </Label>
        <ContentInput
          ref={contentRef}
          id="notice-content"
          required
          value={content}
          placeholder="내용을 입력해주세요"
          onChange={(event) => setContent(event.target.value)}
        />
      </FieldCard>

      {mutation.isError && (
        <SubmitStatus role="status">
          생성하지 못했습니다. 다시 시도해 주세요.
        </SubmitStatus>
      )}

      <Actions>
        <SubmitButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '생성 중' : '생성하기'}
        </SubmitButton>
      </Actions>

      {validationError && (
        <ValidationDialog
          message={validationMessages[validationError]}
          onConfirm={handleConfirm}
        />
      )}
    </Form>
  )
}

function validate(input: CreateNoticeInput): FieldName | null {
  if (!input.category) return 'category'
  if (!input.title) return 'title'
  if (!input.content) return 'content'
  return null
}

const Form = styled.form`
  width: 100%;
`

const FieldCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding: 32px 40px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textStrong};
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
`

const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger};
`

const Select = styled.select`
  width: 100%;
  min-height: 60px;
  padding: 14px 20px;
  border: 1px solid transparent;
  border-radius: 8px;
  outline: 0;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textStrong};
  font: inherit;
  font-size: 22px;
  line-height: 1.4;
`

const TitleInput = styled.input`
  width: 100%;
  min-height: 60px;
  padding: 14px 20px;
  border: 1px solid transparent;
  border-radius: 8px;
  outline: 0;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textStrong};
  font: inherit;
  font-size: 22px;
  line-height: 1.4;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textGuide};
    opacity: 1;
  }
`

const ContentInput = styled.textarea`
  width: 100%;
  min-height: 240px;
  padding: 20px;
  border: 1px solid transparent;
  border-radius: 8px;
  outline: 0;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textStrong};
  font: inherit;
  font-size: 22px;
  line-height: 1.5;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textGuide};
    opacity: 1;
  }
`

const SubmitStatus = styled.p`
  margin: 16px 0 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 18px;
  text-align: right;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
`

const SubmitButton = styled.button`
  min-width: 123px;
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
