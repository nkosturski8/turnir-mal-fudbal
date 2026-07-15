import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Резултати', end: true },
  { to: '/grupi', label: 'Групи' },
  { to: '/eliminacii', label: 'Елиминации' },
  { to: '/timovi', label: 'Тимови' },
  { to: '/strelci', label: 'Стрелци' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white text-pitch-800'
        : 'text-pitch-50 hover:bg-pitch-600'
    }`

  return (
    <nav className="bg-pitch-700 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="font-bold tracking-tight flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <span className="hidden sm:inline">БОРИС ТРАЈКОВСКИ</span>
            <span className="sm:hidden">Турнир</span>
          </NavLink>

          {/* Десктоп мени */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/admin" className={linkClass}>
                  Админ
                </NavLink>
                <button
                  onClick={signOut}
                  className="ml-1 px-3 py-2 rounded-md text-sm bg-pitch-900 hover:bg-black/40"
                >
                  Одјава
                </button>
              </>
            ) : (
              <NavLink to="/admin/najava" className={linkClass}>
                Админ
              </NavLink>
            )}
          </div>

          {/* Мобилно копче */}
          <button
            className="md:hidden p-2 rounded hover:bg-pitch-600"
            onClick={() => setOpen((o) => !o)}
            aria-label="Мени"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5" />
            <div className="w-6 h-0.5 bg-white mb-1.5" />
            <div className="w-6 h-0.5 bg-white" />
          </button>
        </div>

        {/* Мобилно мени */}
        {open && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
                  Админ панел
                </NavLink>
                <button
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                  className="text-left px-3 py-2 rounded-md text-sm bg-pitch-900"
                >
                  Одјава
                </button>
              </>
            ) : (
              <NavLink to="/admin/najava" className={linkClass} onClick={() => setOpen(false)}>
                Админ најава
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
