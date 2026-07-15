// Централни текстови и мапи (на македонски)

export const TOURNAMENT_NAME =
  'Турнир во мал фудбал „БОРИС ТРАЈКОВСКИ“'
export const TOURNAMENT_PLACE = 'Моноспитово'

export const GROUPS = ['A', 'B', 'C', 'D']
export const MAX_PLAYERS_PER_TEAM = 10

export const STAGES = [
  { value: 'group', label: 'Групна фаза' },
  { value: 'quarter', label: 'Четвртфинале' },
  { value: 'semi', label: 'Полуфинале' },
  { value: 'third_place', label: 'Меч за 3. место' },
  { value: 'final', label: 'Финале' },
]

export const STAGE_LABELS = STAGES.reduce((acc, s) => {
  acc[s.value] = s.label
  return acc
}, {})

// Редослед на нокаут фазите за приказ
export const KNOCKOUT_ORDER = ['quarter', 'semi', 'third_place', 'final']

export const STATUS = [
  { value: 'scheduled', label: 'Закажан' },
  { value: 'live', label: 'Во тек' },
  { value: 'finished', label: 'Завршен' },
]

export const STATUS_LABELS = STATUS.reduce((acc, s) => {
  acc[s.value] = s.label
  return acc
}, {})

export function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('mk-MK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return value
  }
}
