import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, MessageCircle, MapPin, Github, Link2, Zap } from 'lucide-react'
import { MOCK_USERS, CURRENT_USER, calculateCompatibility } from '@/data/mockData'
import OceanRadar from '@/components/OceanRadar'

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Founder: { bg: 'bg-syndi-teal/10', text: 'text-syndi-teal' },
  Developer: { bg: 'bg-syndi-violet/10', text: 'text-syndi-violet' },
  Designer: { bg: 'bg-syndi-pink/10', text: 'text-syndi-pink' },
  Investor: { bg: 'bg-syndi-orange/10', text: 'text-syndi-orange' },
  'Product Manager': { bg: 'bg-syndi-cyan/10', text: 'text-syndi-cyan' },
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = MOCK_USERS.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-syndi-bg">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Профиль не найден</h2>
          <Link to="/dashboard" className="btn-primary">Вернуться к матчам</Link>
        </div>
      </div>
    )
  }

  const compatibility = calculateCompatibility(CURRENT_USER.ocean, user.ocean)
  const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.Founder

  // Generate compatibility text based on traits
  const getCompatibilityText = () => {
    const diffs = {
      openness: Math.abs(CURRENT_USER.ocean.openness - user.ocean.openness),
      conscientiousness: Math.abs(CURRENT_USER.ocean.conscientiousness - user.ocean.conscientiousness),
      extraversion: Math.abs(CURRENT_USER.ocean.extraversion - user.ocean.extraversion),
      agreeableness: Math.abs(CURRENT_USER.ocean.agreeableness - user.ocean.agreeableness),
      neuroticism: Math.abs(CURRENT_USER.ocean.neuroticism - user.ocean.neuroticism),
    }
    const bestTrait = Object.entries(diffs).sort((a, b) => a[1] - b[1])[0][0]
    const traitNames: Record<string, string> = {
      openness: 'креативности и открытости новому',
      conscientiousness: 'дисциплине и организованности',
      extraversion: 'стилю коммуникации и энергии',
      agreeableness: 'подходе к командной работе',
      neuroticism: 'стрессоустойчивости и эмоциональному балансу',
    }
    return `Вы сильно дополняете друг друга в ${traitNames[bestTrait]}. ${compatibility >= 80 ? 'Это отличная основа для стартап-команды.' : 'Есть потенциал для синергии при правильном распределении ролей.'}`
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-syndi-bg">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-syndi-text-secondary hover:text-syndi-teal transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к матчам
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-syndi-border"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                {user.role}
              </span>
            </div>
            <div className="flex items-center gap-1 text-syndi-text-secondary text-sm mb-3">
              <MapPin className="w-4 h-4" />
              {user.location}
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-syndi-teal/10 border border-syndi-teal/20"
            >
              <Zap className="w-5 h-5 text-syndi-teal" />
              <span className="text-2xl font-bold text-syndi-teal">{compatibility}%</span>
              <span className="text-sm text-syndi-text-secondary">совместимости</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Написать
            </button>
            <button className="p-3 rounded-xl bg-syndi-pink/10 text-syndi-pink hover:bg-syndi-pink/20 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Compatibility + OCEAN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="card-syndi">
              <h2 className="font-display text-lg font-bold text-white mb-3">Анализ совместимости</h2>
              <p className="text-syndi-text-secondary leading-relaxed mb-6">{getCompatibilityText()}</p>
              <OceanRadar profile={user.ocean} size={280} color="#00d4aa" className="mx-auto" showLabels />
            </div>

            {/* Trait breakdown */}
            <div className="card-syndi">
              <h2 className="font-display text-lg font-bold text-white mb-4">Разбор по чертам</h2>
              <div className="space-y-4">
                {([
                  { key: 'openness', label: 'Открытость (Openness)', emoji: '🎨' },
                  { key: 'conscientiousness', label: 'Добросовестность (Conscientiousness)', emoji: '📋' },
                  { key: 'extraversion', label: 'Экстраверсия (Extraversion)', emoji: '🎤' },
                  { key: 'agreeableness', label: 'Доброжелательность (Agreeableness)', emoji: '🤝' },
                  { key: 'neuroticism', label: 'Нейротизм (Neuroticism)', emoji: '🧘' },
                ] as const).map((trait) => {
                  const userVal = CURRENT_USER.ocean[trait.key]
                  const matchVal = user.ocean[trait.key]
                  const diff = Math.abs(userVal - matchVal)
                  const good = diff >= 15 && diff <= 40
                  return (
                    <div key={trait.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-syndi-text-secondary">
                          {trait.emoji} {trait.label}
                        </span>
                        <span className={`text-xs font-medium ${good ? 'text-syndi-teal' : 'text-syndi-orange'}`}>
                          {good ? 'Дополняют' : 'Схожи'}
                        </span>
                      </div>
                      <div className="h-2 bg-syndi-surface rounded-full overflow-hidden relative">
                        <div
                          className="absolute h-full rounded-full bg-syndi-teal/40"
                          style={{ left: `${Math.min(userVal, matchVal)}%`, width: `${Math.abs(userVal - matchVal)}%` }}
                        />
                        <div className="absolute top-0 w-1 h-full bg-syndi-teal rounded-full" style={{ left: `${userVal}%` }} />
                        <div className="absolute top-0 w-1 h-full bg-syndi-violet rounded-full" style={{ left: `${matchVal}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-syndi-text-muted mt-1">
                        <span>Вы: {userVal}</span>
                        <span>{user.name}: {matchVal}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: About + Skills + Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card-syndi">
              <h2 className="font-display text-lg font-bold text-white mb-3">О себе</h2>
              <p className="text-syndi-text-secondary leading-relaxed">{user.bio}</p>
            </div>

            <div className="card-syndi">
              <h2 className="font-display text-lg font-bold text-white mb-3">Навыки</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-syndi-bg-elevated text-syndi-text-secondary text-sm border border-syndi-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-syndi">
              <h2 className="font-display text-lg font-bold text-white mb-3">Опыт</h2>
              <div className="space-y-3">
                {user.experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-syndi-teal mt-2 flex-shrink-0" />
                    <p className="text-syndi-text-secondary">{exp}</p>
                  </div>
                ))}
              </div>
            </div>

            {user.githubProjects.length > 0 && (
              <div className="card-syndi">
                <div className="flex items-center gap-2 mb-3">
                  <Github className="w-5 h-5 text-syndi-text-muted" />
                  <h2 className="font-display text-lg font-bold text-white">GitHub проекты</h2>
                </div>
                <div className="space-y-2">
                  {user.githubProjects.map((proj, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex items-center gap-2 p-3 rounded-lg bg-syndi-bg-elevated hover:bg-syndi-surface transition-colors group"
                    >
                      <Link2 className="w-4 h-4 text-syndi-text-muted group-hover:text-syndi-teal" />
                      <span className="text-syndi-text-secondary group-hover:text-white transition-colors">{proj}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
