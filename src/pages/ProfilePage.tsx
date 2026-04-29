import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, MapPin, Briefcase, Github, Link2, Save, X } from 'lucide-react'
import { CURRENT_USER } from '@/data/mockData'
import OceanRadar from '@/components/OceanRadar'

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [user, setUser] = useState(CURRENT_USER)

  const handleSave = () => {
    setEditMode(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-syndi-bg">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src="/profile-banner.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-syndi-bg/20 via-syndi-bg/60 to-syndi-bg" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Avatar + Header */}
        <div className="relative -mt-20 mb-8 flex flex-col md:flex-row md:items-end gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-syndi-bg shadow-lg hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-syndi-teal flex items-center justify-center border-2 border-syndi-bg">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </motion.div>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
              <button
                onClick={() => setEditMode(!editMode)}
                className="p-2 rounded-lg bg-syndi-bg-elevated border border-syndi-border text-syndi-text-muted hover:text-syndi-teal hover:border-syndi-teal transition-colors"
              >
                {editMode ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-syndi-text-secondary text-sm">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                {user.role}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {user.location}
              </span>
            </div>
          </div>

          {editMode && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Сохранить
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-syndi"
            >
              <h2 className="font-display text-lg font-bold text-white mb-3">О себе</h2>
              {editMode ? (
                <textarea
                  className="input-syndi w-full h-24 resize-none"
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                />
              ) : (
                <p className="text-syndi-text-secondary leading-relaxed">{user.bio}</p>
              )}
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-syndi"
            >
              <h2 className="font-display text-lg font-bold text-white mb-3">Навыки</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.length > 0 ? (
                  user.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="px-3 py-1.5 rounded-lg bg-syndi-bg-elevated text-syndi-text-secondary text-sm border border-syndi-border"
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-syndi-text-muted text-sm">Навыки будут добавлены после прохождения онбординга</p>
                )}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-syndi"
            >
              <h2 className="font-display text-lg font-bold text-white mb-3">Опыт</h2>
              {user.experience.length > 0 ? (
                <div className="space-y-3">
                  {user.experience.map((exp, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-syndi-teal mt-2 flex-shrink-0" />
                      <p className="text-syndi-text-secondary">{exp}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-syndi-text-muted text-sm">Опыт будет импортирован из LinkedIn/GitHub</p>
              )}
            </motion.div>

            {/* GitHub Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-syndi"
            >
              <div className="flex items-center gap-2 mb-3">
                <Github className="w-5 h-5 text-syndi-text-muted" />
                <h2 className="font-display text-lg font-bold text-white">Проекты на GitHub</h2>
              </div>
              {user.githubProjects.length > 0 ? (
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
              ) : (
                <p className="text-syndi-text-muted text-sm">Подключите GitHub для импорта репозиториев</p>
              )}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* OCEAN Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-syndi text-center"
            >
              <h2 className="font-display text-lg font-bold text-white mb-2">OCEAN Профиль</h2>
              <p className="text-syndi-text-muted text-sm mb-4">Ваш психометрический отпечаток</p>
              <OceanRadar profile={user.ocean} size={240} color="#00d4aa" className="mx-auto" showLabels />
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(user.ocean).map(([trait, value]) => (
                  <div key={trait} className="flex items-center justify-between p-2 rounded-lg bg-syndi-bg-elevated">
                    <span className="text-syndi-text-muted capitalize">{trait.slice(0, 3)}</span>
                    <span className="font-bold text-syndi-teal">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Avatar Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-syndi text-center"
            >
              <h2 className="font-display text-lg font-bold text-white mb-4">AI Аватар</h2>
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-syndi-teal/20 to-syndi-violet/20 animate-pulse-glow" />
                <img src={user.avatar} alt="Avatar" className="absolute inset-1 w-[7.5rem] h-[7.5rem] rounded-full object-cover" />
              </div>
              <p className="text-syndi-text-muted text-sm mt-3">Цифровой двойник активен</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
