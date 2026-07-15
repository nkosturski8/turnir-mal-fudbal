import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Groups from './pages/Groups'
import Bracket from './pages/Bracket'
import Teams from './pages/Teams'
import TopScorers from './pages/TopScorers'
import Login from './pages/Login'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="grupi" element={<Groups />} />
        <Route path="eliminacii" element={<Bracket />} />
        <Route path="timovi" element={<Teams />} />
        <Route path="strelci" element={<TopScorers />} />
        <Route path="admin/najava" element={<Login />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
