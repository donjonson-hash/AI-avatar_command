import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Users, ArrowRight, Search, MessageCircle, Zap, Globe, Code2, Palette } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Психометрический анализ OCEAN',
    description: 'Научная модель Big Five для измерения 5 ключевых черт личности. Алгоритм находит тех, кто дополняет вас, а не дублирует.',
    color: '#00d4aa',
  },
  {
    icon: Sparkles,
    title: 'Живой AI-аватар',
    description: 'Ваш цифровой двойник с уникальным характером. Аватар общается от вашего имени, помогая отсеять несовместимых кандидатов до первой встречи.',
    color: '#c77dff',
  },
  {
    icon: Users,
    title: 'Алгоритм дополнения',
    description: 'Мы ищем не похожих, а дополняющих. Хакер + Хастлер, Дизайнер + Инженер. Командная синергия через науку о личности.',
    color: '#ff6b9d',
  },
]

const steps = [
  { img: '/how-it-step-1.jpg', title: 'Создай профиль', desc: 'Пройди OCEAN-тест из 15 вопросов' },
  { img: '/how-it-step-2.jpg', title: 'Сгенерируй аватар', desc: 'AI создаст твой цифровой двойник' },
  { img: '/how-it-step-3.jpg', title: 'Найди пару', desc: 'Алгоритм подберет идеального сооснователя' },
  { img: '/how-it-step-4.jpg', title: 'Начни строить', desc: 'Общайся через аватаров или вживую' },
]

const stats = [
  { value: '247', label: 'Команд уже нашли друг друга' },
  { value: '89%', label: 'Совместимость при первом матче' },
  { value: '12', label: 'Недель до MVP в среднем' },
]

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-syndi-bg/40 via-syndi-bg/60 to-syndi-bg" />
        </div>

        {/* Floating avatars */}
        <div className="absolute inset-0 pointer-events-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 rounded-full border-2 border-syndi-teal/30 overflow-hidden"
              style={{
                top: `${15 + i * 12}%`,
                left: `${10 + i * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              <img src="/avatar-placeholder.jpg" alt="" className="w-full h-full object-cover opacity-70" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-syndi-teal/10 border border-syndi-teal/20 text-syndi-teal text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              AI-нативная платформа для стартап-команд
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Найди сооснователя,{' '}
            <span className="text-gradient-teal">который дополняет тебя</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="text-lg md:text-xl text-syndi-text-secondary max-w-2xl mx-auto mb-10"
          >
            AI-платформа для подбора идеальных стартап-команд. Психометрическая совместимость + живые цифровые аватары.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/onboarding" className="btn-primary text-lg px-8 py-4 rounded-xl shadow-glow flex items-center gap-2">
              Начать подбор
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="#features" className="btn-secondary text-lg px-8 py-4 rounded-xl">
              Узнать больше
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 border-y border-syndi-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-syndi-teal mb-2">{stat.value}</div>
                <div className="text-syndi-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Почему Syndi AI <span className="text-gradient-teal">работает</span>
            </h2>
            <p className="text-syndi-text-secondary max-w-xl mx-auto">
              Традиционные платформы ищут по ключевым словам. Мы ищем по психологической совместимости.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="card-syndi group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-syndi-text-secondary leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-syndi-bg-elevated/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Как это <span className="text-gradient-teal">работает</span>
            </h2>
            <p className="text-syndi-text-secondary max-w-xl mx-auto">4 шага от регистрации до идеальной команды</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative"
              >
                <div className="card-syndi overflow-hidden">
                  <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden">
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-syndi-teal/20 text-syndi-teal flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-syndi-text-secondary text-sm">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-5 h-5 text-syndi-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / COMMUNITIES */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl font-bold text-white mb-8">Присоединяются из ведущих сообществ</h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { icon: Globe, label: 'Y Combinator' },
                { icon: Code2, label: 'Techstars' },
                { icon: Palette, label: '500 Startups' },
                { icon: Search, label: 'Antler' },
                { icon: MessageCircle, label: 'Startup School' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-2 text-syndi-text-muted hover:text-syndi-teal transition-colors">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-syndi-border py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-syndi-teal" />
            <span className="font-display font-bold text-syndi-teal">Syndi AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-syndi-text-muted">
            <span>© 2026 Syndi AI</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
