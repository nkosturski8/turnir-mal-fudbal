import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { MATCH_SELECT } from '../../lib/queries'
import { STAGE_LABELS, groupLabel } from '../../lib/constants'
import { Input, Select, Field, Button, Card } from '../../components/form'
import { ErrorBox } from '../../components/States'

export default function AdminGoals() {
  const [matches, setMatches] = useState([])
  const [matchId, setMatchId] = useState('')
  const [players, setPlayers] = useState([])
  const [goals, setGoals] = useState([])
  const [error, setError] = useState(null)
  const [playerId, setPlayerId] = useState('')
  const [minute, setMinute] = useState('')
  const [busy, setBusy] = useState(false)

  const match = matches.find((m) => String(m.id) === String(matchId))

  async function loadMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select(MATCH_SELECT)
      .order('created_at', { ascending: false })
    if (error) return setError(error)
    setMatches(data ?? [])
    if (!matchId && data?.length) setMatchId(String(data[0].id))
  }

  async function loadPlayers(m) {
    if (!m) return setPlayers([])
    const ids = [m.home_team_id, m.away_team_id].filter(Boolean)
    if (ids.length === 0) return setPlayers([])
    const { data, error } = await supabase
      .from('players')
      .select('id, name, team_id')
      .in('team_id', ids)
      .order('name')
    if (error) return setError(error)
    setPlayers(data ?? [])
  }

  async function loadGoals(id) {
    if (!id) return setGoals([])
    const { data, error } = await supabase
      .from('goals')
      .select('id, minute, player:players ( id, name, team_id )')
      .eq('match_id', id)
      .order('minute', { nullsFirst: true })
    if (error) return setError(error)
    setGoals(data ?? [])
  }

  useEffect(() => {
    loadMatches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (match) {
      loadPlayers(match)
      loadGoals(match.id)
      setPlayerId('')
      setMinute('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, matches.length])

  async function addGoal(e) {
    e.preventDefault()
    if (!playerId || !matchId) return
    setBusy(true)
    const { error } = await supabase.from('goals').insert({
      match_id: Number(matchId),
      player_id: Number(playerId),
      minute: minute ? Number(minute) : null,
    })
    setBusy(false)
    if (error) return alert('Грешка: ' + error.message)
    setPlayerId('')
    setMinute('')
    loadGoals(matchId)
  }

  async function removeGoal(id) {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (error) alert('Грешка: ' + error.message)
    else loadGoals(matchId)
  }

  if (error) return <ErrorBox error={error} />

  const teamName = (tid) =>
    tid === match?.home_team_id ? match?.home_team?.name : match?.away_team?.name

  const label = (m) =>
    `${m.home_team?.name ?? 'ТБД'} — ${m.away_team?.name ?? 'ТБД'} · ${
      m.stage === 'group' ? 'Група ' + groupLabel(m.group_name) : STAGE_LABELS[m.stage]
    }`

  return (
    <div className="space-y-5">
      <Card title="Голови по меч">
        <Field label="Избери меч">
          <Select value={matchId} onChange={(e) => setMatchId(e.target.value)}>
            {matches.length === 0 && <option value="">Прво креирај мечеви</option>}
            {matches.map((m) => (
              <option key={m.id} value={m.id}>{label(m)}</option>
            ))}
          </Select>
        </Field>

        {match && (
          <>
            <div className="mt-4 mb-3 text-center">
              <span className="text-sm text-slate-500">Тековен резултат: </span>
              <span className="font-bold text-slate-800">
                {match.home_team?.name} {match.home_score} : {match.away_score} {match.away_team?.name}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Забелешка: головите тука се за списокот на стрелци. Резултатот го внесуваш во делот „Мечеви“.
              </p>
            </div>

            {goals.length === 0 ? (
              <p className="text-sm text-slate-400 mb-3">Нема внесени голови за овој меч.</p>
            ) : (
              <ul className="divide-y divide-slate-100 mb-3 border border-slate-100 rounded-lg">
                {goals.map((g) => (
                  <li key={g.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <span className="w-10 text-slate-400 tabular-nums">
                      {g.minute != null ? `${g.minute}'` : '—'}
                    </span>
                    <span className="flex-1">
                      <span className="text-slate-800 font-medium">{g.player?.name}</span>
                      <span className="text-slate-400 text-xs ml-2">
                        {teamName(g.player?.team_id)}
                      </span>
                    </span>
                    <Button variant="danger" onClick={() => removeGoal(g.id)}>Избриши</Button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={addGoal} className="grid grid-cols-[1fr_5rem_auto] gap-2 items-end">
              <Field label="Стрелец">
                <Select value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
                  <option value="">— избери играч —</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({teamName(p.team_id)})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Минута">
                <Input type="number" min="0" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="'" />
              </Field>
              <Button type="submit" disabled={busy || !playerId}>Додај гол</Button>
            </form>
            {players.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                Овие тимови немаат внесено играчи. Додај играчи во делот „Играчи“.
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
