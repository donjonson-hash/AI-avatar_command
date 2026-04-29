import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, RefreshCw, ArrowRight, Mic, Image } from 'lucide-react'

export default function AvatarStudioPage() {
  const navigate = useNavigate()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [styleValue, setStyleValue] = useState(50)
  const [voiceClone, setVoiceClone] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => setUploadedImage(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => setUploadedImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 3000)
  }

  const handleRegenerate = () => {
    setGenerated(false)
    setUploadedImage(null)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-syndi-bg px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-syndi-violet/10 border border-syndi-violet/20 text-syndi-violet text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI Avatar Studio
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Создайте свой <span className="text-syndi-violet">цифровой двойник</span>
          </h1>
          <p className="text-syndi-text-secondary max-w-lg mx-auto">
            Ваш аватар будет представлять вас на платформе и поможет в предварительном отборе сооснователей.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className={`relative h-80 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden ${
                dragActive
                  ? 'border-syndi-teal bg-syndi-teal/10'
                  : uploadedImage
                  ? 'border-syndi-border bg-syndi-bg-elevated'
                  : 'border-syndi-border bg-syndi-bg-elevated hover:border-syndi-teal/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <AnimatePresence mode="wait">
                {uploadedImage ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0"
                  >
                    <img src={uploadedImage} alt="Upload preview" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-syndi-bg/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-syndi-border hover:border-syndi-teal transition-colors flex items-center gap-2"
                      >
                        <Image className="w-4 h-4" />
                        Заменить фото
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center px-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-syndi-teal/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-syndi-teal" />
                    </div>
                    <p className="text-white font-medium mb-1">Перетащите фото сюда</p>
                    <p className="text-syndi-text-muted text-sm mb-4">или</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-syndi-teal font-medium hover:underline"
                    >
                      Выберите файл
                    </button>
                    <p className="text-syndi-text-muted text-xs mt-4">PNG, JPG до 10MB</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: Settings + Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Preview circle */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    generating ? 'animate-pulse-glow' : generated ? 'shadow-glow-violet' : ''
                  }`}
                  style={{
                    background: generated
                      ? 'linear-gradient(135deg, #c77dff20, #00d4aa20)'
                      : 'linear-gradient(135deg, #374151, #1f2937)',
                  }}
                />
                <div className="absolute inset-1 rounded-full bg-syndi-bg flex items-center justify-center overflow-hidden">
                  {generated ? (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      src={uploadedImage || '/avatar-placeholder.jpg'}
                      alt="Generated avatar"
                      className="w-full h-full object-cover"
                      style={{ filter: `saturate(${1 + styleValue / 100}) contrast(${1 + styleValue / 200})` }}
                    />
                  ) : generating ? (
                    <div className="shimmer-bg w-full h-full rounded-full" />
                  ) : (
                    <img src="/avatar-placeholder.jpg" alt="Placeholder" className="w-32 h-32 object-cover opacity-50" />
                  )}
                </div>
                {generated && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-syndi-violet/20 border border-syndi-violet/30 text-syndi-violet text-xs font-medium">
                    AI Avatar
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            {!generated && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-syndi-text-secondary mb-2 block">
                    Стилизация: {styleValue < 30 ? 'Реалистичный' : styleValue > 70 ? 'Художественный' : 'Баланс'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={styleValue}
                    onChange={(e) => setStyleValue(Number(e.target.value))}
                    className="w-full h-2 bg-syndi-surface rounded-lg appearance-none cursor-pointer accent-syndi-teal"
                  />
                  <div className="flex justify-between text-xs text-syndi-text-muted mt-1">
                    <span>Реалистичный</span>
                    <span>Художественный</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-syndi-bg-elevated border border-syndi-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-syndi-violet/10 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-syndi-violet" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Голосовой клон</p>
                      <p className="text-xs text-syndi-text-muted">Аватар будет говорить вашим голосом</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVoiceClone(!voiceClone)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      voiceClone ? 'bg-syndi-violet' : 'bg-syndi-surface'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                        voiceClone ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!uploadedImage || generating}
                  className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Сгенерировать аватар
                    </>
                  )}
                </button>
              </div>
            )}

            {generated && (
              <div className="space-y-4">
                <button
                  onClick={handleRegenerate}
                  className="w-full btn-secondary py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Пересоздать
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 shadow-glow-violet"
                >
                  Перейти к матчам
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
