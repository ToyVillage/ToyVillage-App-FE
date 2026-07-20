import { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createMockNotice,
  noticeCategories,
  type CreateNoticeInput,
} from '@/entities/notice'
import { ValidationDialog } from '@/shared/ui'
import { NoticeAttachmentField } from './NoticeAttachmentField'
import { RemoveIconButton } from './RemoveIconButton'
import { TeamAddDialog } from './TeamAddDialog'

type FieldName = Exclude<keyof CreateNoticeInput, 'category'>

const validationMessages: Record<FieldName, string> = {
  title: '제목을 입력해 주세요',
  content: '내용을 입력해 주세요',
}

const initialCategories = noticeCategories.slice(0, 3)

interface NoticeFormProps {
  onCreated: () => void
  onDirtyChange: (isDirty: boolean) => void
}

export function NoticeForm({ onCreated, onDirtyChange }: NoticeFormProps) {
  const queryClient = useQueryClient()
  const submittingRef = useRef(false)
  const teamAddButtonRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [category, setCategory] = useState(initialCategories[0])
  const [categories, setCategories] = useState(initialCategories)
  const [teamDialogOpen, setTeamDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hasAttachments, setHasAttachments] = useState(false)
  const [validationError, setValidationError] = useState<FieldName | null>(null)
  const mutation = useMutation({ mutationFn: createMockNotice })

  useEffect(() => {
    const categoriesChanged =
      categories.length !== initialCategories.length ||
      categories.some((item, index) => item !== initialCategories[index])
    const isDirty = Boolean(
      title ||
        content ||
        category !== initialCategories[0] ||
        categoriesChanged ||
        hasAttachments,
    )

    onDirtyChange(isDirty)
  }, [category, categories, content, hasAttachments, onDirtyChange, title])

  const handleConfirm = useCallback(() => {
    const error = validationError
    setValidationError(null)

    requestAnimationFrame(() => {
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
        onCreated()
      },
      onError: () => {
        submittingRef.current = false
      },
    })
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <TitleCard>
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
      </TitleCard>

      <CategoryCard aria-required="true">
        <CategoryLegend>분류</CategoryLegend>
        <CategoryOptions>
          {categories.map((option) => (
            <CategoryOption key={option}>
              <CategorySelectLabel>
                <CategoryRadio
                  type="radio"
                  name="notice-category"
                  value={option}
                  required
                  checked={category === option}
                  onChange={(event) => setCategory(event.target.value)}
                />
                <CategoryPill data-has-remove={option !== '전체'}>
                  {categoryDisplayName(option)}
                </CategoryPill>
              </CategorySelectLabel>
              {option !== '전체' && (
                <CategoryRemove
                  type="button"
                  aria-label={`${categoryDisplayName(option)} 삭제`}
                  onClick={() => {
                    setCategories((current) =>
                      current.filter((item) => item !== option),
                    )
                    if (category === option) setCategory(initialCategories[0])
                  }}
                />
              )}
            </CategoryOption>
          ))}
          <TeamAddButton
            ref={teamAddButtonRef}
            type="button"
            onClick={() => setTeamDialogOpen(true)}
          >
            + 팀 추가
          </TeamAddButton>
        </CategoryOptions>
      </CategoryCard>

      <ContentCard>
        <VisuallyHiddenLabel htmlFor="notice-content">
          내용 <Required aria-hidden="true">*</Required>
        </VisuallyHiddenLabel>
        <ContentInput
          ref={contentRef}
          id="notice-content"
          required
          value={content}
          placeholder="여기에 내용을 입력하세요"
          onChange={(event) => {
            setContent(event.target.value)
            resizeTextarea(event.currentTarget)
          }}
        />
      </ContentCard>

      <NoticeAttachmentField onFilesChange={setHasAttachments} />

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

      {teamDialogOpen && (
        <TeamAddDialog
          onCancel={() => {
            setTeamDialogOpen(false)
            requestAnimationFrame(() => teamAddButtonRef.current?.focus())
          }}
          onAdd={(teamName) => {
            setCategories((current) =>
              current.includes(teamName) ? current : [...current, teamName],
            )
            setCategory(teamName)
            setTeamDialogOpen(false)
            requestAnimationFrame(() => teamAddButtonRef.current?.focus())
          }}
        />
      )}
    </Form>
  )
}

function validate(input: CreateNoticeInput): FieldName | null {
  if (!input.title) return 'title'
  if (!input.content) return 'content'
  return null
}

function categoryDisplayName(category: string) {
  return category.replace(/^팀이름\s*/, '팀 이름')
}

function resizeTextarea(textarea: HTMLTextAreaElement) {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

const Form = styled.form`
  width: 100%;
  margin-top: 60px;

  @media (max-width: 980px) {
    margin-top: 40px;
  }
`

const FieldCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  padding: 40px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 980px) {
    padding: 24px;
  }
`

const TitleCard = styled(FieldCard)`
  min-height: 164px;
  margin-top: 0;
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

const TitleInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textStrong};
  font: inherit;
  font-size: 36px;
  font-weight: 500;
  line-height: 1.2;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textGuide};
    opacity: 1;
  }

  @media (max-width: 980px) {
    font-size: 28px;
  }
`

const CategoryCard = styled.fieldset`
  min-height: 170px;
  margin: 32px 0 0;
  padding: 40px;
  border: 0;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 980px) {
    padding: 24px;
  }
`

const CategoryLegend = styled.legend`
  float: left;
  width: 100%;
  padding: 0;
  color: ${({ theme }) => theme.colors.textStrong};
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
`

const CategoryOptions = styled.div`
  display: flex;
  clear: both;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
`

const CategoryOption = styled.div`
  position: relative;
  display: inline-flex;
`

const CategorySelectLabel = styled.label`
  position: relative;
  display: inline-flex;
`

const CategoryRadio = styled.input`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;

  &:focus-visible + span {
    outline: 2px solid ${({ theme }) => theme.colors.textGuide};
    outline-offset: 3px;
  }
`

const CategoryPill = styled.span`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textStrong};
  font-size: 20px;
  font-weight: 500;
  line-height: 1.2;

  &[data-has-remove='true'] {
    padding-right: 46px;
  }
`

const CategoryRemove = styled(RemoveIconButton)`
  position: absolute;
  z-index: 2;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
`

const TeamAddButton = styled.button`
  min-height: 44px;
  padding: 8px 18px;
  border: 1px solid ${({ theme }) => theme.colors.textGuide};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textGuide};
  cursor: pointer;
  font: inherit;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.2;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.textGuide};
    outline-offset: 3px;
  }
`

const ContentCard = styled(FieldCard)`
  min-height: 240px;
`

const VisuallyHiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`

const ContentInput = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textStrong};
  font: inherit;
  font-size: 22px;
  line-height: 1.5;
  overflow: hidden;
  resize: none;

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
  margin-top: 32px;
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
    outline: 2px solid ${({ theme }) => theme.colors.textGuide};
    outline-offset: 3px;
  }
`
