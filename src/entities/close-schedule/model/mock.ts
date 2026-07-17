import type {
  CloseSchedule,
  CreateCloseScheduleInput,
  UpdateCloseScheduleInput,
} from './types'

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
  const schedulesById = new Map(
    mockCloseSchedules.map((schedule) => [schedule.id, schedule]),
  )

  for (const schedule of readStoredSchedules()) {
    schedulesById.set(schedule.id, schedule)
  }

  return [...schedulesById.values()]
}

export async function getMockCloseSchedule(
  id: string,
): Promise<CloseSchedule | undefined> {
  const schedules = await getMockCloseSchedules()
  return schedules.find((schedule) => schedule.id === id)
}

export async function createMockCloseSchedule(
  input: CreateCloseScheduleInput,
): Promise<CloseSchedule> {
  const schedule = {
    id: `created-${crypto.randomUUID()}`,
    ...input,
  }
  const schedules = readStoredSchedules()

  localStorage.setItem(
    closeScheduleStorageKey,
    JSON.stringify([...schedules, schedule]),
  )

  return schedule
}

export async function updateMockCloseSchedule(
  input: UpdateCloseScheduleInput,
): Promise<CloseSchedule> {
  const currentSchedule = await getMockCloseSchedule(input.id)
  if (!currentSchedule) throw new Error('Close schedule not found')

  const schedules = readStoredSchedules()
  const storedIndex = schedules.findIndex(
    (schedule) => schedule.id === input.id,
  )
  const nextSchedules = [...schedules]

  if (storedIndex >= 0) {
    nextSchedules[storedIndex] = input
  } else {
    nextSchedules.push(input)
  }

  localStorage.setItem(closeScheduleStorageKey, JSON.stringify(nextSchedules))
  return input
}

function readStoredSchedules(): CloseSchedule[] {
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
