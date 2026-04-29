import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Sparkles, Menu, X, MessageCircle, User, Search } from 'lucide-react'

const NAV_LINKS = [
  { path: '/', label: 'Главная', icon: Sparkles },
  { path: '/dashboard', label: 'Матчи', icon: Search },
  { path: '/messages', label: 'Сообщения', icon: MessageCircle },
  { path: '/profile', label: 'Профиль', icon: User },
]

export default function Navigation() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-syndi-bg/90 backdrop-blur-md border-b border-syndi-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-syndi-teal/20 flex items-center justify-center group-hover:bg-syndi-teal/30 transition-colors">
            <Sparkles className="w-5 h-5 text-syndi-teal" />
          </div>
          <span className="font-display text-xl font-bold text-syndi-teal tracking-tight">Syndi AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  active
                    ? 'text-syndi-teal'
                    : 'text-syndi-text-secondary hover:text-syndi-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-syndi-teal rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Avatar + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/profile" className="hidden md:block">
            <img
              src="/avatar-placeholder.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full border border-syndi-border hover:border-syndi-teal transition-colors"
            />
          </Link>
          <button
            className="md:hidden p-2 text-syndi-text-secondary hover:text-syndi-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-syndi-bg/95 backdrop-blur-lg z-40">
          <div className="flex flex-col p-6 gap-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all ${
                    active
                      ? 'bg-syndi-teal/10 text-syndi-teal'
                      : 'text-syndi-text-secondary hover:bg-syndi-surface hover:text-syndi-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
