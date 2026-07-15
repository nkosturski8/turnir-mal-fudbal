import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Ако веќе е најавен, префрли кон админ
  useEffect(() => {
    if (user) navigate('/admin', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) {
      setError('Погрешен емаил или лозинка.')
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 text-center">Админ најава</h2>
        <p className="text-sm text-slate-500 text-center mt-1 mb-5">
          Само организаторот има пристап.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Емаил</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pitch-500"
              placeholder="admin@primer.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Лозинка</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pitch-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-pitch-600 hover:bg-pitch-700 text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Најавување…' : 'Најави се'}
          </button>
        </form>
      </div>
    </div>
  )
}
