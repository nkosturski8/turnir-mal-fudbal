import { useEffect, useState } from 'react'
import MatchCard from '../components/MatchCard'
import { Loading, ErrorBox, Empty, PageTitle } from '../components/States'
import { fetchMatches, fetchGoals, scorersByMatch } from '../lib/queries'

export default function Home() {
  const [matches, setMatches] = useState([])
  const [scorers, setScorers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [m, g] = await Promise.all([fetchMatches(), fetchGoals()])
        if (!active) return
        setMatches(m)
        setScorers(scorersByMatch(m, g))
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

  const live = matches.filter((m) => m.status === 'live')
  const finished = matches.filter((m) => m.status === 'finished')
  const upcoming = matches.filter((m) => m.status === 'scheduled')

  const renderList = (list) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {list.map((m) => (
        <MatchCard
          key={m.id}
          match={m}
          homeScorers={scorers[m.id]?.home ?? []}
          awayScorers={scorers[m.id]?.away ?? []}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      {matches.length === 0 && (
        <Empty text="Сè уште нема закажани мечеви. Админот може да ги додаде од админ панелот." />
      )}

      {live.length > 0 && (
        <section>
          <PageTitle>🔴 Во тек</PageTitle>
          {renderList(live)}
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <PageTitle>Претстојни мечеви</PageTitle>
          {renderList(upcoming)}
        </section>
      )}

      {finished.length > 0 && (
        <section>
          <PageTitle>Одиграни мечеви</PageTitle>
          {renderList(finished)}
        </section>
      )}
    </div>
  )
}
