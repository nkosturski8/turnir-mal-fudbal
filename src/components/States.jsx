import { isSupabaseConfigured } from '../lib/supabaseClient'

export function Loading({ text = 'Се вчитува…' }) {
  return <div className="py-16 text-center text-slate-400">{text}</div>
}

export function ErrorBox({ error }) {
  return (
    <div className="my-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
      <p className="font-semibold">Грешка при вчитување</p>
      <p className="mt-1 break-words">{String(error?.message || error)}</p>
      {!isSupabaseConfigured && (
        <p className="mt-2">
          Изгледа Supabase не е поврзан. Провери го <code>.env</code> фајлот и
          рестартирај го серверот.
        </p>
      )}
    </div>
  )
}

export function Empty({ text = 'Сè уште нема податоци.' }) {
  return (
    <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
      {text}
    </div>
  )
}

export function PageTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-slate-800">{children}</h2>
      {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}
