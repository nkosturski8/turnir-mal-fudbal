import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Пушта само најавени корисници; инаку враќа на најавната страница
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">Се вчитува…</div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/najava" replace />
  }

  return children
}
