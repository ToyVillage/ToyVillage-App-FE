import type { CreateResourceInput, FileType, Resource } from './types'

export const resourceStorageKey = 'toyvillage:resources'

// 슬라이스용 mock. 추후 TanStack Query + Axios.
export const mockResources: Resource[] = [
  { id: '1', fileType: 'pdf', title: '근무지침요령 1', date: '2026.06.30' },
  { id: '2', fileType: 'pdf', title: '근무안내서 1', date: '2026.06.28' },
  { id: '3', fileType: 'jpg', title: '근무 중 행동 요령', date: '2026.06.25' },
  { id: '4', fileType: 'png', title: '시설 안내도', date: '2026.06.20' },
  { id: '5', fileType: 'etc', title: '기타 참고자료.zip', date: '2026.06.18' },
]

// 파일 유형 탭(전체 포함)
export const fileTypeTabs = ['전체', 'pdf', 'jpg/jpeg', 'png', '기타'] as const

// 탭 라벨 → fileType (전체는 필터 안 함)
export const tabToFileType: Record<string, FileType | null> = {
  전체: null,
  pdf: 'pdf',
  'jpg/jpeg': 'jpg',
  png: 'png',
  기타: 'etc',
}

// fileType → 테이블 pill 라벨
export const fileTypeLabel: Record<FileType, string> = {
  pdf: 'pdf',
  jpg: 'jpg/jpeg',
  png: 'png',
  etc: '기타',
}

// 생성 페이지 분류 칩(전체 제외). tabToFileType 으로 FileType 매핑.
export const resourceCategories = fileTypeTabs.slice(1)

export async function getMockResources(): Promise<Resource[]> {
  return [...readStoredResources(), ...mockResources]
}

export async function createMockResource(
  input: CreateResourceInput,
): Promise<Resource> {
  const resource: Resource = {
    id: `created-${crypto.randomUUID()}`,
    ...input,
    date: formatDisplayDate(new Date()),
  }
  const storedResources = readStoredResources()

  localStorage.setItem(
    resourceStorageKey,
    JSON.stringify([resource, ...storedResources]),
  )

  return resource
}

function readStoredResources(): Resource[] {
  const rawResources = localStorage.getItem(resourceStorageKey)
  if (!rawResources) return []

  try {
    const resources: unknown = JSON.parse(rawResources)
    return Array.isArray(resources) ? resources.filter(isResource) : []
  } catch {
    return []
  }
}

function isResource(value: unknown): value is Resource {
  if (!value || typeof value !== 'object') return false

  const resource = value as Record<string, unknown>
  return (
    typeof resource.id === 'string' &&
    typeof resource.fileType === 'string' &&
    typeof resource.title === 'string' &&
    typeof resource.date === 'string'
  )
}

function formatDisplayDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
