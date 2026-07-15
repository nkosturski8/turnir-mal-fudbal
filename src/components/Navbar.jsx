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
    <nav className="sticky top-0 z-30 bg-transparent md:bg-pitch-700 md:text-white md:shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        {/* Десктоп мени — центрирано */}
        <div className="hidden md:flex items-center justify-center gap-1 h-14">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {user && (
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
          )}
        </div>
      </div>

      {/* Мобилно копче — горе десно, лебди врз заглавието */}
      <button
        className="md:hidden absolute top-2.5 right-3 z-40 flex items-center gap-1.5 px-3 py-2 rounded-md text-white bg-pitch-900/50 hover:bg-pitch-900/70 backdrop-blur-sm text-sm font-medium"
        onClick={() => setOpen((o) => !o)}
        aria-label="Мени"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">{open ? '✕' : '☰'}</span>
        Мени
      </button>

      {/* Мобилно мени — паѓачки панел десно */}
      {open && (
        <div className="md:hidden absolute top-14 right-3 z-40 w-52 rounded-lg bg-pitch-700 text-white shadow-xl ring-1 ring-black/20 p-2 flex flex-col gap-1">
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
          {user && (
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
          )}
        </div>
      )}
    </nav>
  )
}
