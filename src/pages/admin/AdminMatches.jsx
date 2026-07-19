import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { MATCH_SELECT } from '../../lib/queries'
import { GROUPS, STAGES, STATUS, STAGE_LABELS, STATUS_LABELS, formatDate, groupLabel } from '../../lib/constants'
import { Input, Select, Field, Button, Card } from '../../components/form'
import { ErrorBox } from '../../components/States'

// ISO -> вредност за <input type="datetime-local">
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

export default function AdminMatches() {
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const [form, setForm] = useState({
    stage: 'group',
    group_name: 'A',
    round_label: '',
    home_team_id: '',
    away_team_id: '',
    match_date: '',
  })

  async function loadAll() {
    const [tRes, mRes] = await Promise.all([
      supabase.from('teams').select('id, name, group_name').order('group_name').order('name'),
      supabase.from('matches').select(MATCH_SELECT).order('created_at', { ascending: false }),
    ])
    if (tRes.error) return setError(tRes.error)
    if (mRes.error) return setError(mRes.error)
    setTeams(tRes.data ?? [])
    setMatches(mRes.data ?? [])
  }

  useEffect(() => {
    loadAll()
  }, [])

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function createMatch(e) {
    e.preventDefault()
    if (!form.home_team_id || !form.away_team_id) return alert('Избери ги двата тима.')
    if (form.home_team_id === form.away_team_id) return alert('Тимовите мора да се различни.')
    setBusy(true)
    const { error } = await supabase.from('matches').insert({
      stage: form.stage,
      group_name: form.stage === 'group' ? form.group_name : null,
      round_label: form.round_label.trim() || null,
      home_team_id: Number(form.home_team_id),
      away_team_id: Number(form.away_team_id),
      match_date: form.match_date ? new Date(form.match_date).toISOString() : null,
      status: 'scheduled',
    })
    setBusy(false)
    if (error) return alert('Грешка: ' + error.message)
    setForm((f) => ({ ...f, round_label: '', home_team_id: '', away_team_id: '', match_date: '' }))
    loadAll()
  }

  async function saveMatch(id, patch) {
    const { error } = await supabase.from('matches').update(patch).eq('id', id)
    if (error) alert('Грешка: ' + error.message)
    else loadAll()
  }

  async function removeMatch(id) {
    if (!confirm('Да се избрише мечот? Ќе се избришат и головите за него.')) return
    const { error } = await supabase.from('matches').delete().eq('id', id)
    if (error) alert('Грешка: ' + error.message)
    else loadAll()
  }

  if (error) return <ErrorBox error={error} />

  const teamOptions = (filterGroup) =>
    (filterGroup ? teams.filter((t) => t.group_name === filterGroup) : teams).map((t) => (
      <option key={t.id} value={t.id}>
        {t.name} ({groupLabel(t.group_name)})
      </option>
    ))

  return (
    <div className="space-y-5">
      <Card title="Креирај меч">
        <form onSubmit={createMatch} className="grid sm:grid-cols-2 gap-3">
          <Field label="Фаза">
            <Select value={form.stage} onChange={(e) => setF('stage', e.target.value)}>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </Field>

          {form.stage === 'group' ? (
            <Field label="Група">
              <Select value={form.group_name} onChange={(e) => setF('group_name', e.target.value)}>
                {GROUPS.map((g) => (
                  <option key={g} value={g}>Група {groupLabel(g)}</option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label="Ознака (пр. Полуфинале 1)">
              <Input value={form.round_label} onChange={(e) => setF('round_label', e.target.value)} />
            </Field>
          )}

          {form.stage === 'group' && (
            <Field label="Коло (опционално)">
              <Input value={form.round_label} onChange={(e) => setF('round_label', e.target.value)} placeholder="пр. 1 коло" />
            </Field>
          )}

          <Field label="Домашен тим">
            <Select value={form.home_team_id} onChange={(e) => setF('home_team_id', e.target.value)}>
              <option value="">— избери —</option>
              {teamOptions(form.stage === 'group' ? form.group_name : null)}
            </Select>
          </Field>

          <Field label="Гостин тим">
            <Select value={form.away_team_id} onChange={(e) => setF('away_team_id', e.target.value)}>
              <option value="">— избери —</option>
              {teamOptions(form.stage === 'group' ? form.group_name : null)}
            </Select>
          </Field>

          <Field label="Датум и час (опционално)">
            <Input type="datetime-local" value={form.match_date} onChange={(e) => setF('match_date', e.target.value)} />
          </Field>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>Креирај меч</Button>
          </div>
        </form>
      </Card>

      <Card title={`Мечеви (${matches.length})`}>
        {matches.length === 0 ? (
          <p className="text-sm text-slate-400">Нема креирани мечеви.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <MatchEditor key={m.id} m={m} teams={teams} onSave={saveMatch} onDelete={removeMatch} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function MatchEditor({ m, teams = [], onSave, onDelete }) {
  const [home, setHome] = useState(m.home_score)
  const [away, setAway] = useState(m.away_score)
  const [status, setStatus] = useState(m.status)
  const [date, setDate] = useState(toLocalInput(m.match_date))

  // Полиња за уредување на самиот меч (фаза, група, тимови...)
  const [editing, setEditing] = useState(false)
  const [stage, setStage] = useState(m.stage)
  const [groupName, setGroupName] = useState(m.group_name ?? 'A')
  const [roundLabel, setRoundLabel] = useState(m.round_label ?? '')
  const [homeTeamId, setHomeTeamId] = useState(String(m.home_team_id ?? ''))
  const [awayTeamId, setAwayTeamId] = useState(String(m.away_team_id ?? ''))

  const scoreDirty =
    home !== m.home_score ||
    away !== m.away_score ||
    status !== m.status ||
    toLocalInput(m.match_date) !== date

  const detailsDirty =
    stage !== m.stage ||
    (stage === 'group' && groupName !== (m.group_name ?? 'A')) ||
    roundLabel !== (m.round_label ?? '') ||
    homeTeamId !== String(m.home_team_id ?? '') ||
    awayTeamId !== String(m.away_team_id ?? '')

  const dirty = scoreDirty || detailsDirty

  const label =
    m.stage === 'group'
      ? `Група ${groupLabel(m.group_name)}${m.round_label ? ' · ' + m.round_label : ''}`
      : STAGE_LABELS[m.stage] + (m.round_label ? ' · ' + m.round_label : '')

  const homeName = m.home_team?.name ?? 'ТБД'
  const awayName = m.away_team?.name ?? 'ТБД'

  // Тимови за избор: за групна фаза само од таа група (плус тековно избраниот),
  // за елиминации сите тимови.
  const selectableTeams =
    stage === 'group'
      ? teams.filter((t) => t.group_name === groupName || String(t.id) === homeTeamId || String(t.id) === awayTeamId)
      : teams

  const teamOptions = selectableTeams.map((t) => (
    <option key={t.id} value={t.id}>
      {t.name} ({groupLabel(t.group_name)})
    </option>
  ))

  function save() {
    if (!homeTeamId || !awayTeamId) return alert('Избери ги двата тима.')
    if (homeTeamId === awayTeamId) return alert('Тимовите мора да се различни.')
    onSave(m.id, {
      stage,
      group_name: stage === 'group' ? groupName : null,
      round_label: roundLabel.trim() || null,
      home_team_id: Number(homeTeamId),
      away_team_id: Number(awayTeamId),
      home_score: home,
      away_score: away,
      status,
      match_date: date ? new Date(date).toISOString() : null,
    })
    setEditing(false)
  }

  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span className="font-medium text-pitch-700">{label}</span>
        <div className="flex items-center gap-3">
          <span>{m.match_date ? formatDate(m.match_date) : STATUS_LABELS[m.status]}</span>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-pitch-700 hover:underline font-medium"
          >
            {editing ? 'Затвори' : 'Измени меч'}
          </button>
        </div>
      </div>

      <div className="text-center text-sm font-semibold text-slate-800 mb-2">
        {homeName} <span className="text-slate-400">vs</span> {awayName}
      </div>

      {editing && (
        <div className="grid sm:grid-cols-2 gap-2 mb-3 p-3 bg-slate-50 rounded-lg">
          <Field label="Фаза">
            <Select value={stage} onChange={(e) => setStage(e.target.value)}>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </Field>
          {stage === 'group' ? (
            <Field label="Група">
              <Select value={groupName} onChange={(e) => setGroupName(e.target.value)}>
                {GROUPS.map((g) => (
                  <option key={g} value={g}>Група {groupLabel(g)}</option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label="Ознака (пр. Полуфинале 1)">
              <Input value={roundLabel} onChange={(e) => setRoundLabel(e.target.value)} />
            </Field>
          )}
          {stage === 'group' && (
            <Field label="Коло (опционално)">
              <Input value={roundLabel} onChange={(e) => setRoundLabel(e.target.value)} placeholder="пр. 1 коло" />
            </Field>
          )}
          <Field label="Домашен тим">
            <Select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}>
              <option value="">— избери —</option>
              {teamOptions}
            </Select>
          </Field>
          <Field label="Гостин тим">
            <Select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}>
              <option value="">— избери —</option>
              {teamOptions}
            </Select>
          </Field>
        </div>
      )}

      <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2">
        <span className="text-right text-sm font-medium">{homeName}</span>
        <Input type="number" min="0" value={home} onChange={(e) => setHome(Number(e.target.value))} className="w-16 text-center" />
        <span className="text-slate-400">:</span>
        <Input type="number" min="0" value={away} onChange={(e) => setAway(Number(e.target.value))} className="w-16 text-center" />
        <span className="text-left text-sm font-medium">{awayName}</span>
      </div>

      <div className="flex flex-wrap items-end gap-2 mt-3">
        <Field label="Статус">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
            {STATUS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Датум/час">
          <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Button disabled={!dirty} onClick={save}>
          Зачувај
        </Button>
        <Button variant="danger" onClick={() => onDelete(m.id)}>Избриши</Button>
      </div>
    </div>
  )
}
