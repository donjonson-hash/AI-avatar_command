import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface Question {
  id: number
  text: string
  trait: string
  reverse: boolean
}

const QUESTIONS: Question[] = [
  { id: 1, text: 'Мне нравится пробовать новые технологии и экспериментировать', trait: 'openness', reverse: false },
  { id: 2, text: 'Я всегда планирую задачи заранее и стараюсь не откладывать', trait: 'conscientiousness', reverse: false },
  { id: 3, text: 'Я заряжаюсь энергией от общения с новыми людьми', trait: 'extraversion', reverse: false },
  { id: 4, text: 'Я стремлюсь к консенсусу и готов идти на компромисс', trait: 'agreeableness', reverse: false },
  { id: 5, text: 'Я легко переживаю перед важными презентациями или питчами', trait: 'neuroticism', reverse: false },
  { id: 6, text: 'Меня больше привлекают проверенные решения, чем новые идеи', trait: 'openness', reverse: true },
  { id: 7, text: 'Я предпочитаю импровизировать, чем следовать жёсткому плану', trait: 'conscientiousness', reverse: true },
  { id: 8, text: 'Мне комфортнее работать в одиночку над сложными задачами', trait: 'extraversion', reverse: true },
  { id: 9, text: 'Я отстаиваю свою точку зрения даже под давлением команды', trait: 'agreeableness', reverse: true },
  { id: 10, text: 'Я спокоен в кризисных ситуациях и не паникую', trait: 'neuroticism', reverse: true },
  { id: 11, text: 'Мне интересно изучать сложные концепции ради самого процесса', trait: 'openness', reverse: false },
  { id: 12, text: 'Я довожу начатое до конца, даже если теряю мотивацию', trait: 'conscientiousness', reverse: false },
  { id: 13, text: 'На вечеринках я предпочитаю оставаться с близкими друзьями', trait: 'extraversion', reverse: true },
  { id: 14, text: 'Я готов жертвовать своими интересами ради команды', trait: 'agreeableness', reverse: false },
  { id: 15, text: 'Моё настроение сильно меняется в течение дня', trait: 'neuroticism', reverse: false },
]

const SCALE_LABELS = [
  'Полностью не согласен',
  'Не согласен',
  'Нейтрально',
  'Согласен',
  'Полностью согласен',
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [analyzing, setAnalyzing] = useState(false)
  const [direction, setDirection] = useState(1)

  const question = QUESTIONS[current]
  const progress = ((current + 1) / QUESTIONS.length) * 100
  const answered = answers[question.id] !== undefined

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setDirection(1)
      setCurrent((c) => c + 1)
    } else {
      setAnalyzing(true)
      setTimeout(() => {
        navigate('/avatar')
      }, 2500)
    }
  }

  const handleBack = () => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((c) => c - 1)
    }
  }

  if (analyzing) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-syndi-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-syndi-teal/30 animate-pulse-glow" />
            <div className="absolute inset-4 rounded-full border-2 border-syndi-violet/30 animate-pulse-glow animation-delay-500" />
            <img
              src="/avatar-placeholder.jpg"
              alt=""
              className="absolute inset-8 w-16 h-16 rounded-full object-cover opacity-80"
            />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Анализируем ваш профиль</h2>
          <p className="text-syndi-text-secondary">AI вычисляет ваш OCEAN-профиль и готовит рекомендации...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-syndi-bg px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-syndi-text-muted">Вопрос {current + 1} из {QUESTIONS.length}</span>
            <span className="text-sm font-medium text-syndi-teal">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-syndi-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-syndi-teal to-syndi-cyan rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-syndi-teal/10 text-syndi-teal text-xs font-medium uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              {question.trait}
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-snug">
              {question.text}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Scale */}
        <div className="mb-12">
          <div className="flex items-center justify-between gap-2 mb-4">
            {SCALE_LABELS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i + 1)}
                className={`flex-1 h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-lg font-bold ${
                  answers[question.id] === i + 1
                    ? 'border-syndi-teal bg-syndi-teal/20 text-syndi-teal scale-105'
                    : 'border-syndi-border bg-syndi-bg-elevated text-syndi-text-muted hover:border-syndi-teal/50 hover:text-syndi-text-secondary'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-syndi-text-muted px-1">
            <span>{SCALE_LABELS[0]}</span>
            <span>{SCALE_LABELS[4]}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="btn-ghost flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </button>
          <button
            onClick={handleNext}
            disabled={!answered}
            className={`btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
              answered ? 'shadow-glow' : ''
            }`}
          >
            {current === QUESTIONS.length - 1 ? 'Завершить' : 'Далее'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
