import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl mb-3">⚽</p>
      <h2 className="text-xl font-bold text-slate-800">Страницата не е пронајдена</h2>
      <Link to="/" className="inline-block mt-4 text-pitch-700 font-medium hover:underline">
        ← Назад на почетна
      </Link>
    </div>
  )
}
