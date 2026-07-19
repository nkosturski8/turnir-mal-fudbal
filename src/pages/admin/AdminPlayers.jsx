import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { MAX_PLAYERS_PER_TEAM, groupLabel } from '../../lib/constants'
import { Input, Select, Field, Button, Card } from '../../components/form'
import { ErrorBox } from '../../components/States'

export default function AdminPlayers() {
  const [teams, setTeams] = useState([])
  const [teamId, setTeamId] = useState('')
  const [players, setPlayers] = useState([])
  const [error, setError] = useState(null)
  const [name, setName] = useState('')
  const [num, setNum] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name, group_name')
      .order('group_name')
      .order('name')
    if (error) return setError(error)
    setTeams(data ?? [])
    if (!teamId && data?.length) setTeamId(String(data[0].id))
  }

  async function loadPlayers(id) {
    if (!id) return setPlayers([])
    const { data, error } = await supabase
      .from('players')
      .select('id, name, jersey_number')
      .eq('team_id', id)
      .order('jersey_number', { nullsFirst: false })
    if (error) return setError(error)
    setPlayers(data ?? [])
  }

  useEffect(() => {
    loadTeams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadPlayers(teamId)
  }, [teamId])

  async function addPlayer(e) {
    e.preventDefault()
    if (!name.trim() || !teamId) return
    if (players.length >= MAX_PLAYERS_PER_TEAM) return
    setBusy(true)
    const { error } = await supabase.from('players').insert({
      team_id: Number(teamId),
      name: name.trim(),
      jersey_number: num ? Number(num) : null,
    })
    setBusy(false)
    if (error) return alert('Грешка: ' + error.message)
    setName('')
    setNum('')
    loadPlayers(teamId)
  }

  async function removePlayer(id) {
    if (!confirm('Да се избрише играчот?')) return
    const { error } = await supabase.from('players').delete().eq('id', id)
    if (error) alert('Грешка: ' + error.message)
    else loadPlayers(teamId)
  }

  if (error) return <ErrorBox error={error} />

  const full = players.length >= MAX_PLAYERS_PER_TEAM

  return (
    <div className="space-y-5">
      <Card title="Играчи по тим">
        <Field label="Избери тим">
          <Select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {teams.length === 0 && <option value="">Прво додај тимови</option>}
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (Група {groupLabel(t.group_name)})
              </option>
            ))}
          </Select>
        </Field>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Играчи: {players.length}/{MAX_PLAYERS_PER_TEAM}
            </span>
          </div>

          {players.length === 0 ? (
            <p className="text-sm text-slate-400 mb-3">Нема внесени играчи за овој тим.</p>
          ) : (
            <ul className="divide-y divide-slate-100 mb-3 border border-slate-100 rounded-lg">
              {players.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="w-7 text-center text-slate-400 tabular-nums">
                    {p.jersey_number ?? '–'}
                  </span>
                  <span className="flex-1 text-slate-700">{p.name}</span>
                  <Button variant="danger" onClick={() => removePlayer(p.id)}>Избриши</Button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={addPlayer} className="grid grid-cols-[1fr_5rem_auto] gap-2 items-end">
            <Field label="Име на играч">
              <Input value={name} onChange={(e) => setName(e.target.value)} disabled={full || !teamId} placeholder="Име и презиме" />
            </Field>
            <Field label="Број">
              <Input type="number" min="0" value={num} onChange={(e) => setNum(e.target.value)} disabled={full || !teamId} placeholder="#" />
            </Field>
            <Button type="submit" disabled={busy || full || !teamId}>Додај</Button>
          </form>
          {full && <p className="text-xs text-amber-600 mt-2">Тимот е полн (10 играчи).</p>}
        </div>
      </Card>
    </div>
  )
}
