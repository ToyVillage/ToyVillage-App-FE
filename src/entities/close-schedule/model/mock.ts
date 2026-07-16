import type { CloseSchedule, CreateCloseScheduleInput } from './types'

export const closeScheduleStorageKey = 'toyvillage:close-schedules'

export const mockCloseSchedules: CloseSchedule[] = [
  {
    id: 'animal-checkup',
    startDate: '2026-07-13',
    endDate: '2026-07-14',
    title: '토이빌리지 동물 정기검진',
  },
  {
    id: 'seunghyun-birthday',
    startDate: '2026-07-13',
    endDate: '2026-07-13',
    title: '이승현 생일',
  },
  {
    id: 'hansaem-birthday',
    startDate: '2026-03-23',
    endDate: '2026-03-23',
    title: '이한샘 생일',
  },
  {
    id: 'jeonguk-birthday',
    startDate: '2026-07-09',
    endDate: '2026-07-09',
    title: '김정욱 생일',
  },
  {
    id: 'dayeon-birthday',
    startDate: '2026-08-25',
    endDate: '2026-08-25',
    title: '이다연 생일',
  },
]

export async function getMockCloseSchedules(): Promise<CloseSchedule[]> {
  return [...mockCloseSchedules, ...readCreatedSchedules()]
}

export async function createMockCloseSchedule(
  input: CreateCloseScheduleInput,
): Promise<CloseSchedule> {
  const schedule = {
    id: `created-${crypto.randomUUID()}`,
    ...input,
  }
  const schedules = readCreatedSchedules()

  localStorage.setItem(
    closeScheduleStorageKey,
    JSON.stringify([...schedules, schedule]),
  )

  return schedule
}

function readCreatedSchedules(): CloseSchedule[] {
  const rawSchedules = localStorage.getItem(closeScheduleStorageKey)
  if (!rawSchedules) return []

  try {
    const schedules: unknown = JSON.parse(rawSchedules)
    return Array.isArray(schedules) ? schedules.filter(isCloseSchedule) : []
  } catch {
    return []
  }
}

function isCloseSchedule(value: unknown): value is CloseSchedule {
  if (!value || typeof value !== 'object') return false

  const schedule = value as Record<string, unknown>
  return (
    typeof schedule.id === 'string' &&
    typeof schedule.startDate === 'string' &&
    typeof schedule.endDate === 'string' &&
    typeof schedule.title === 'string'
  )
}
