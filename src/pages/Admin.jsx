import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PageTitle } from '../components/States'
import AdminTeams from './admin/AdminTeams'
import AdminPlayers from './admin/AdminPlayers'
import AdminMatches from './admin/AdminMatches'
import AdminGoals from './admin/AdminGoals'

const TABS = [
  { id: 'teams', label: 'Тимови', el: <AdminTeams /> },
  { id: 'players', label: 'Играчи', el: <AdminPlayers /> },
  { id: 'matches', label: 'Мечеви', el: <AdminMatches /> },
  { id: 'goals', label: 'Голови', el: <AdminGoals /> },
]

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('teams')

  return (
    <div>
      <PageTitle sub={`Најавен: ${user?.email ?? ''}`}>Админ панел</PageTitle>

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'bg-pitch-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {TABS.find((t) => t.id === tab)?.el}
    </div>
  )
}
