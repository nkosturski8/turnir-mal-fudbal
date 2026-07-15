import { useEffect, useState } from 'react'
import StandingsTable from '../components/StandingsTable'
import { Loading, ErrorBox, PageTitle } from '../components/States'
import { supabase } from '../lib/supabaseClient'
import { GROUPS } from '../lib/constants'

export default function Groups() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data, error } = await supabase.from('group_standings').select('*')
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

  return (
    <div>
      <PageTitle sub="Бодови се доделуваат: победа 3, нерешено 1, пораз 0.">
        Табели по групи
      </PageTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {GROUPS.map((g) => (
          <StandingsTable
            key={g}
            groupName={g}
            rows={rows.filter((r) => r.group_name === g)}
          />
        ))}
      </div>
    </div>
  )
}
