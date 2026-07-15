import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { TOURNAMENT_NAME, TOURNAMENT_PLACE } from '../lib/constants'
import logo from '../assets/turnir-logo.jpg'

export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-slate-50">
      <Navbar />

      {/* Заглавие на турнирот */}
      <header className="bg-gradient-to-b from-pitch-800 to-pitch-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <img
            src={logo}
            alt="Меморијален турнир Борис Трајковски — Моноспитово"
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white object-cover mx-auto mb-3 ring-4 ring-white/80 shadow-md"
          />
          <p className="text-pitch-200 text-xs uppercase tracking-widest">
            Турнир во мал фудбал
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-1">
            „БОРИС ТРАЈКОВСКИ“
          </h1>
          <p className="text-pitch-100 mt-1 text-sm sm:text-base">
            {TOURNAMENT_PLACE}
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-pitch-900 text-pitch-200 text-center text-xs py-4 px-4">
        {TOURNAMENT_NAME} — {TOURNAMENT_PLACE} · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
