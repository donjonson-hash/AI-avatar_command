import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Heart, X, LayoutGrid, Layers, MapPin, Code2, Palette, BarChart3, Globe, Briefcase } from 'lucide-react'
import { MOCK_USERS, CURRENT_USER, calculateCompatibility } from '@/data/mockData'
import type { UserProfile } from '@/data/mockData'
import OceanRadar from '@/components/OceanRadar'

const ROLE_COLORS: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  Founder: { bg: 'bg-syndi-teal/10', text: 'text-syndi-teal', icon: Briefcase },
  Developer: { bg: 'bg-syndi-violet/10', text: 'text-syndi-violet', icon: Code2 },
  Designer: { bg: 'bg-syndi-pink/10', text: 'text-syndi-pink', icon: Palette },
  Investor: { bg: 'bg-syndi-orange/10', text: 'text-syndi-orange', icon: BarChart3 },
  'Product Manager': { bg: 'bg-syndi-cyan/10', text: 'text-syndi-cyan', icon: Globe },
}

function MatchCard({ user, compatibility, index }: { user: UserProfile; compatibility: number; index: number }) {
  const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.Founder
  const RoleIcon = roleStyle.icon

  const compatColor = compatibility >= 90 ? 'text-syndi-teal' : compatibility >= 70 ? 'text-syndi-orange' : 'text-syndi-text-muted'
  const compatBg = compatibility >= 90 ? 'bg-syndi-teal/10' : compatibility >= 70 ? 'bg-syndi-orange/10' : 'bg-syndi-surface'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card-syndi group relative overflow-hidden"
    >
      <Link to={`/match/${user.id}`} className="block">
        {/* Header with avatar */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-syndi-border group-hover:border-syndi-teal transition-colors"
            />
            <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold ${compatBg} ${compatColor}`}>
              {compatibility}%
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
            <RoleIcon className="w-3 h-3" />
            {user.role}
          </div>
        </div>

        {/* Info */}
        <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-syndi-teal transition-colors">
          {user.name}
        </h3>
        <div className="flex items-center gap-1 text-syndi-text-muted text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          {user.location}
        </div>
        <p className="text-syndi-text-secondary text-sm line-clamp-2 mb-4">{user.bio}</p>

        {/* Mini radar */}
        <div className="flex items-center gap-4">
          <OceanRadar profile={user.ocean} size={60} color={compatibility >= 90 ? '#00d4aa' : compatibility >= 70 ? '#ff9f1c' : '#9ca3af'} showLabels={false} animated={false} />
          <div className="flex-1 flex flex-wrap gap-1.5">
            {user.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded-md bg-syndi-bg-elevated text-syndi-text-muted text-xs border border-syndi-border">
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-syndi-text-muted text-xs">+{user.skills.length - 3}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-syndi-border">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-syndi-pink/10 text-syndi-pink hover:bg-syndi-pink/20 transition-colors text-sm font-medium">
          <Heart className="w-4 h-4" />
          Нравится
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-syndi-surface text-syndi-text-muted hover:text-syndi-text-primary hover:bg-syndi-bg-elevated transition-colors text-sm font-medium">
          <X className="w-4 h-4" />
          Пропустить
        </button>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [, setLiked] = useState<Set<string>>(new Set())
  const [skipped, setSkipped] = useState<Set<string>>(new Set())

  const roles = Array.from(new Set(MOCK_USERS.map((u) => u.role)))

  const matches = useMemo(() => {
    return MOCK_USERS.map((user) => ({
      ...user,
      compatibility: calculateCompatibility(CURRENT_USER.ocean, user.ocean),
    }))
      .filter((user) => {
        if (skipped.has(user.id)) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          return (
            user.name.toLowerCase().includes(q) ||
            user.bio.toLowerCase().includes(q) ||
            user.skills.some((s) => s.toLowerCase().includes(q))
          )
        }
        if (selectedRoles.length > 0 && !selectedRoles.includes(user.role)) return false
        return true
      })
      .sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0))
  }, [searchQuery, selectedRoles, skipped])

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const handleLike = (id: string) => {
    setLiked((prev) => new Set(prev).add(id))
  }

  const handleSkip = (id: string) => {
    setSkipped((prev) => new Set(prev).add(id))
  }

  const swipeCard = matches[0]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-syndi-bg">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
              Подбор <span className="text-gradient-teal">сооснователей</span>
            </h1>
            <p className="text-syndi-text-secondary">{matches.length} потенциальных совпадений на основе вашего профиля</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-syndi-bg-elevated rounded-lg border border-syndi-border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-syndi-surface text-syndi-teal' : 'text-syndi-text-muted hover:text-syndi-text-primary'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('swipe')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'swipe' ? 'bg-syndi-surface text-syndi-teal' : 'text-syndi-text-muted hover:text-syndi-text-primary'}`}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`btn-secondary flex items-center gap-2 ${filterOpen ? 'border-syndi-teal text-syndi-teal' : ''}`}
            >
              <Filter className="w-4 h-4" />
              Фильтры
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-syndi-text-muted" />
            <input
              type="text"
              placeholder="Поиск по имени, навыкам, описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-syndi w-full pl-12"
            />
          </div>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-syndi-bg-elevated border border-syndi-border">
                  <p className="text-sm font-medium text-syndi-text-secondary mb-3">Роли</p>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => {
                      const active = selectedRoles.includes(role)
                      const style = ROLE_COLORS[role] || ROLE_COLORS.Founder
                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole(role)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            active
                              ? `${style.bg} ${style.text} border-transparent`
                              : 'bg-transparent text-syndi-text-muted border-syndi-border hover:border-syndi-teal/50'
                          }`}
                        >
                          {role}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        {matches.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-syndi-bg-elevated flex items-center justify-center">
              <Search className="w-10 h-10 text-syndi-text-muted" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Нет совпадений</h3>
            <p className="text-syndi-text-secondary mb-6">Попробуйте изменить фильтры или сбросить поиск</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRoles([]); setSkipped(new Set()) }}
              className="btn-primary"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((user, i) => (
              <MatchCard key={user.id} user={user} compatibility={user.compatibility || 0} index={i} />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {swipeCard ? (
              <motion.div
                key={swipeCard.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 120) handleLike(swipeCard.id)
                  else if (info.offset.x < -120) handleSkip(swipeCard.id)
                }}
                className="card-syndi cursor-grab active:cursor-grabbing"
              >
                <div className="text-center mb-6">
                  <img
                    src={swipeCard.avatar}
                    alt={swipeCard.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-syndi-border"
                  />
                  <h2 className="font-display text-2xl font-bold text-white">{swipeCard.name}</h2>
                  <p className="text-syndi-text-secondary">{swipeCard.role} • {swipeCard.location}</p>
                  <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-lg font-bold ${
                    (swipeCard.compatibility || 0) >= 90 ? 'bg-syndi-teal/10 text-syndi-teal' : 'bg-syndi-orange/10 text-syndi-orange'
                  }`}>
                    {swipeCard.compatibility}% совместимости
                  </div>
                </div>
                <p className="text-syndi-text-secondary text-center mb-6">{swipeCard.bio}</p>
                <OceanRadar profile={swipeCard.ocean} size={200} color="#00d4aa" className="mx-auto mb-6" />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSkip(swipeCard.id)}
                    className="flex-1 py-3 rounded-xl bg-syndi-surface text-syndi-text-muted hover:text-white hover:bg-syndi-red/20 transition-colors font-medium"
                  >
                    <X className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleLike(swipeCard.id)}
                    className="flex-1 py-3 rounded-xl bg-syndi-pink/10 text-syndi-pink hover:bg-syndi-pink/20 transition-colors font-medium"
                  >
                    <Heart className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-24 text-syndi-text-secondary">Все карточки просмотрены!</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
