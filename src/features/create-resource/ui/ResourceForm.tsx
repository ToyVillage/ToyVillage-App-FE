import { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createMockResource,
  resourceCategories,
  tabToFileType,
  type CreateResourceInput,
} from '@/entities/resource'
import { ValidationDialog } from '@/shared/ui'
import { ResourceUploadField } from './ResourceUploadField'

const defaultCategory = resourceCategories[0]

interface ResourceFormProps {
  onCreated: () => void
  onDirtyChange: (isDirty: boolean) => void
}

export function ResourceForm({ onCreated, onDirtyChange }: ResourceFormProps) {
  const queryClient = useQueryClient()
  const submittingRef = useRef(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(defaultCategory)
  const [hasFile, setHasFile] = useState(false)
  const [validationError, setValidationError] = useState(false)
  const mutation = useMutation({ mutationFn: createMockResource })

  useEffect(() => {
    onDirtyChange(
      Boolean(title || category !== defaultCategory || hasFile),
    )
  }, [category, hasFile, onDirtyChange, title])

  const handleConfirm = useCallback(() => {
    setValidationError(false)
    requestAnimationFrame(() => titleRef.current?.focus())
  }, [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    if (!title.trim()) {
      setValidationError(true)
      return
    }

    const fileType = tabToFileType[category]
    if (!fileType) return

    const input: CreateResourceInput = { title: title.trim(), fileType }
    setValidationError(false)
    submittingRef.current = true
    mutation.mutate(input, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['resources'] })
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
        <Label htmlFor="resource-title">
          제목 <Required aria-hidden="true">*</Required>
        </Label>
        <TitleInput
          ref={titleRef}
          id="resource-title"
          required
          value={title}
          placeholder="제목을 입력해주세요"
          onChange={(event) => setTitle(event.target.value)}
        />
      </TitleCard>

      <CategoryCard>
        <CategoryLegend>분류</CategoryLegend>
        <CategoryOptions>
          {resourceCategories.map((option) => (
            <CategorySelectLabel key={option}>
              <CategoryRadio
                type="radio"
                name="resource-category"
                value={option}
                checked={category === option}
                onChange={(event) => setCategory(event.target.value)}
              />
              <CategoryPill>{option}</CategoryPill>
            </CategorySelectLabel>
          ))}
        </CategoryOptions>
      </CategoryCard>

      <ResourceUploadField onFilesChange={setHasFile} />

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
        <ValidationDialog message="제목을 입력해 주세요" onConfirm={handleConfirm} />
      )}
    </Form>
  )
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
  padding-top: 20px;
`

const CategorySelectLabel = styled.label`
  display: inline-flex;
`

const CategoryRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;

  &:checked + span {
    background: ${({ theme }) => theme.colors.textStrong};
    color: ${({ theme }) => theme.colors.surface};
  }

  &:focus-visible + span {
    outline: 2px solid ${({ theme }) => theme.colors.textGuide};
    outline-offset: 3px;
  }
`

const CategoryPill = styled.span`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 42px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textStrong};
  cursor: pointer;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.2;
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
