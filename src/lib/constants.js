// Централни текстови и мапи (на македонски)

export const TOURNAMENT_NAME =
  'Турнир во мал фудбал „БОРИС ТРАЈКОВСКИ“'
export const TOURNAMENT_PLACE = 'Моноспитово'

export const GROUPS = ['A', 'B', 'C']

// Прикажани (кирилични) имиња на групите. Во базата остануваат A/B/C.
export const GROUP_LABELS = { A: 'А', B: 'Б', C: 'Ц' }
export const groupLabel = (g) => GROUP_LABELS[g] ?? g ?? ''

export const MAX_PLAYERS_PER_TEAM = 10

// Од секоја група директно продолжуваат првите 2 тима...
export const QUALIFY_PER_GROUP = 2
// ...плус најдобрите 2 меѓу третопласираните (вкупно 8 за четвртфинале).
export const THIRD_PLACE_QUALIFIERS = 2

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
