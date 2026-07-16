import { GROUPS, QUALIFY_PER_GROUP } from './constants'

// Рангирање: бодови -> гол-разлика -> дадени голови -> име
export function sortStandings(rows) {
  return [...rows].sort(
    (a, b) =>
      b.points - a.points ||
      b.goal_diff - a.goal_diff ||
      b.goals_for - a.goals_for ||
      a.team_name.localeCompare(b.team_name, 'mk')
  )
}

// Третопласираните тимови од сите групи, рангирани меѓу себе.
// Најдобрите 2 продолжуваат во четвртфинале.
export function thirdPlacedRanking(rows, groups = GROUPS) {
  const thirds = []
  for (const g of groups) {
    const sorted = sortStandings(rows.filter((r) => r.group_name === g))
    const third = sorted[QUALIFY_PER_GROUP] // индекс 2 = третото место
    if (third) thirds.push(third)
  }
  return sortStandings(thirds)
}
