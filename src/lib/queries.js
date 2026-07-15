import { supabase } from './supabaseClient'

// Избор на меч заедно со имињата на двата тима.
// Двата FK кон "teams" се разликуваат преку името на колоната.
export const MATCH_SELECT = `
  id, stage, group_name, round_label,
  home_team_id, away_team_id, home_score, away_score,
  status, match_date, created_at,
  home_team:teams!home_team_id ( id, name ),
  away_team:teams!away_team_id ( id, name )
`

export async function fetchMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT)
    .order('match_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Сите голови со играч + тим (за приказ на стрелци под мечот)
export async function fetchGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select('id, match_id, minute, player:players ( id, name, team_id )')
    .order('minute', { ascending: true, nullsFirst: true })
  if (error) throw error
  return data ?? []
}

// Групира голови по меч, поделено на домашен/гостин тим
export function scorersByMatch(matches, goals) {
  const map = {}
  for (const m of matches) map[m.id] = { home: [], away: [] }

  for (const g of goals) {
    const m = matches.find((x) => x.id === g.match_id)
    if (!m || !g.player) continue
    const entry = { name: g.player.name, minute: g.minute }
    if (g.player.team_id === m.home_team_id) map[m.id].home.push(entry)
    else if (g.player.team_id === m.away_team_id) map[m.id].away.push(entry)
  }
  return map
}
