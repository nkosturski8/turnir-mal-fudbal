import { useEffect, useState } from 'react'
import { Loading, ErrorBox, Empty, PageTitle } from '../components/States'
import { supabase } from '../lib/supabaseClient'
import { GROUPS, groupLabel } from '../lib/constants'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name, group_name, players ( id, name, jersey_number )')
          .order('group_name')
          .order('name')
        if (error) throw error
        if (active) setTeams(data ?? [])
      } catch (e) {
        if (active) setError(e)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Loading />
  if (error) return <ErrorBox error={error} />
  if (teams.length === 0)
    return (
      <>
        <PageTitle>Тимови</PageTitle>
        <Empty text="Сè уште нема додадено тимови." />
      </>
    )

  return (
    <div className="space-y-8">
      <PageTitle sub="16 тима во 4 групи, до 10 играчи по тим.">Тимови и играчи</PageTitle>

      {GROUPS.map((g) => {
        const groupTeams = teams.filter((t) => t.group_name === g)
        if (groupTeams.length === 0) return null
        return (
          <section key={g}>
            <h3 className="text-lg font-bold text-pitch-700 mb-3">Група {groupLabel(g)}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {groupTeams.map((t) => (
                <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-2 bg-slate-800 text-white font-semibold flex items-center justify-between">
                    <span>{t.name}</span>
                    <span className="text-xs text-slate-300">
                      {t.players?.length ?? 0} играчи
                    </span>
                  </div>
                  {t.players?.length ? (
                    <ul className="divide-y divide-slate-100">
                      {[...t.players]
                        .sort((a, b) => (a.jersey_number ?? 99) - (b.jersey_number ?? 99))
                        .map((p) => (
                          <li key={p.id} className="px-4 py-2 flex items-center gap-3 text-sm">
                            <span className="w-6 text-center text-slate-400 tabular-nums">
                              {p.jersey_number ?? '–'}
                            </span>
                            <span className="text-slate-700">{p.name}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-4 text-sm text-slate-400">Нема внесени играчи.</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
