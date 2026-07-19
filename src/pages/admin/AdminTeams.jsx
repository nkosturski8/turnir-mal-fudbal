import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { GROUPS, groupLabel } from '../../lib/constants'
import { Input, Select, Field, Button, Card } from '../../components/form'
import { Loading, ErrorBox } from '../../components/States'

export default function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [name, setName] = useState('')
  const [group, setGroup] = useState('A')
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('teams')
      .select('id, name, group_name')
      .order('group_name')
      .order('name')
    if (error) setError(error)
    else setTeams(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function addTeam(e) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    const { error } = await supabase
      .from('teams')
      .insert({ name: name.trim(), group_name: group })
    setBusy(false)
    if (error) return alert('Грешка: ' + error.message)
    setName('')
    load()
  }

  async function updateTeam(id, patch) {
    const { error } = await supabase.from('teams').update(patch).eq('id', id)
    if (error) alert('Грешка: ' + error.message)
    else load()
  }

  async function removeTeam(id) {
    if (!confirm('Да се избрише тимот? Ќе се избришат и играчите и мечевите поврзани со него.')) return
    const { error } = await supabase.from('teams').delete().eq('id', id)
    if (error) alert('Грешка: ' + error.message)
    else load()
  }

  if (error) return <ErrorBox error={error} />

  const counts = GROUPS.map((g) => ({ g, n: teams.filter((t) => t.group_name === g).length }))

  return (
    <div className="space-y-5">
      <Card title="Додај тим">
        <form onSubmit={addTeam} className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <Field label="Име на тим">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="пр. Моноспитово" />
          </Field>
          <Field label="Група">
            <Select value={group} onChange={(e) => setGroup(e.target.value)}>
              {GROUPS.map((g) => (
                <option key={g} value={g}>Група {groupLabel(g)}</option>
              ))}
            </Select>
          </Field>
          <Button type="submit" disabled={busy}>Додај</Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {counts.map(({ g, n }) => (
            <span
              key={g}
              className={`px-2 py-1 rounded-full ${n === 4 ? 'bg-pitch-100 text-pitch-800' : 'bg-slate-100 text-slate-500'}`}
            >
              Група {groupLabel(g)}: {n}/4
            </span>
          ))}
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500">
            Вкупно: {teams.length}/16
          </span>
        </div>
      </Card>

      <Card title="Тимови">
        {loading ? (
          <Loading />
        ) : teams.length === 0 ? (
          <p className="text-sm text-slate-400">Нема тимови.</p>
        ) : (
          <div className="space-y-2">
            {teams.map((t) => (
              <div key={t.id} className="flex items-center gap-2 flex-wrap">
                <Input
                  defaultValue={t.name}
                  onBlur={(e) => {
                    const v = e.target.value.trim()
                    if (v && v !== t.name) updateTeam(t.id, { name: v })
                  }}
                  className="flex-1 min-w-40"
                />
                <Select
                  value={t.group_name}
                  onChange={(e) => updateTeam(t.id, { group_name: e.target.value })}
                  className="w-32"
                >
                  {GROUPS.map((g) => (
                    <option key={g} value={g}>Група {groupLabel(g)}</option>
                  ))}
                </Select>
                <Button variant="danger" onClick={() => removeTeam(t.id)}>Избриши</Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
