import { useEffect, useState } from 'react'
import { Loading, ErrorBox, Empty, PageTitle } from '../components/States'
import { supabase } from '../lib/supabaseClient'

export default function TopScorers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('top_scorers')
          .select('*')
          .order('goals', { ascending: false })
        if (error) throw error
        if (active) setRows(data ?? [])
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

  const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`)

  return (
    <div>
      <PageTitle sub="Списокот се ажурира автоматски од внесените голови.">
        Најдобри стрелци
      </PageTitle>

      {rows.length === 0 ? (
        <Empty text="Сè уште нема постигнато голови." />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200 text-xs">
                <th className="text-left px-4 py-2 font-medium w-12">#</th>
                <th className="text-left px-4 py-2 font-medium">Играч</th>
                <th className="text-left px-4 py-2 font-medium">Тим</th>
                <th className="text-right px-4 py-2 font-medium">Голови</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.player_id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 text-slate-400">{medal(i)}</td>
                  <td className="px-4 py-2 font-medium text-slate-800">{r.player_name}</td>
                  <td className="px-4 py-2 text-slate-500">{r.team_name}</td>
                  <td className="px-4 py-2 text-right font-bold text-pitch-700 tabular-nums">
                    {r.goals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
