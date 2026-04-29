import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import AvatarStudioPage from './pages/AvatarStudioPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import MatchDetailPage from './pages/MatchDetailPage'
import MessagesPage from './pages/MessagesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/avatar" element={<AvatarStudioPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/match/:id" element={<MatchDetailPage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Route>
    </Routes>
  )
}
