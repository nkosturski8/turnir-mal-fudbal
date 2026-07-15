import { useEffect, useState } from 'react'
import { Loading, ErrorBox, Empty, PageTitle } from '../components/States'
import { supabase } from '../lib/supabaseClient'
import { MATCH_SELECT } from '../lib/queries'
import { KNOCKOUT_ORDER, STAGE_LABELS } from '../lib/constants'

function KnockoutMatch({ m }) {
  const finished = m.status === 'finished'
  const homeWin = finished && m.home_score > m.away_score
  const awayWin = finished && m.away_score > m.home_score
  const row = (name, score, win) => (
    <div className="flex items-center justify-between gap-2">
      <span className={`truncate ${win ? 'font-bold text-pitch-700' : 'text-slate-700'}`}>
        {name || 'ТБД'}
      </span>
      <span className={`tabular-nums ${win ? 'font-bold text-pitch-700' : 'text-slate-500'}`}>
        {finished || m.status === 'live' ? score : '–'}
      </span>
    </div>
  )
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-sm w-full">
      {row(m.home_team?.name, m.home_score, homeWin)}
      <div className="my-1 border-t border-slate-100" />
      {row(m.away_team?.name, m.away_score, awayWin)}
    </div>
  )
}

export default function Bracket() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select(MATCH_SELECT)
          .neq('stage', 'group')
          .order('match_date', { ascending: true, nullsFirst: false })
        if (error) throw error
        if (active) setMatches(data ?? [])
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

  const stagesWithMatches = KNOCKOUT_ORDER.filter((s) =>
    matches.some((m) => m.stage === s)
  )

  return (
    <div>
      <PageTitle sub="Четвртфинале · Полуфинале · Финале">Елиминации</PageTitle>

      {stagesWithMatches.length === 0 ? (
        <Empty text="Елиминационите мечеви ќе се појават откако админот ќе ги додаде." />
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-max">
            {stagesWithMatches.map((stage) => (
              <div key={stage} className="w-56 flex-shrink-0">
                <h3 className="text-center text-sm font-semibold text-pitch-700 mb-3">
                  {STAGE_LABELS[stage]}
                </h3>
                <div className="flex flex-col gap-3 justify-around h-full">
                  {matches
                    .filter((m) => m.stage === stage)
                    .map((m) => (
                      <KnockoutMatch key={m.id} m={m} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
