import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Sparkles, ChevronLeft, Search } from 'lucide-react'
import { CONVERSATIONS } from '@/data/mockData'

interface Message {
  id: string
  text: string
  isMe: boolean
  timestamp: Date
  isAiSuggestion?: boolean
}

const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: '1', text: 'Привет! Я посмотрел твой профиль, давай обсудим архитектуру?', isMe: false, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '2', text: 'Привет! Да, с удовольствием. Какой стек тебя интересует?', isMe: true, timestamp: new Date(Date.now() - 1000 * 60 * 4) },
  ],
  c2: [
    { id: '1', text: 'Отличная идея с cybersecurity AI, у меня есть контакты в SOC2 аудите', isMe: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '2', text: 'Отлично, давай созвонимся на следующей неделе!', isMe: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
  ],
  c3: [
    { id: '1', text: 'Готов обсудить инвестиции на pre-seed раунде', isMe: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  ],
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const [aiMode, setAiMode] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [mobileListVisible, setMobileListVisible] = useState(true)

  const activeConversation = CONVERSATIONS.find((c) => c.id === activeId)
  const activeMessages = activeId ? messages[activeId] || [] : []

  const handleSend = () => {
    if (!input.trim() || !activeId) return
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isMe: true,
      timestamp: new Date(),
    }
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }))
    setInput('')
    setAiSuggestion(null)
  }

  const handleAiSuggest = () => {
    setAiMode(!aiMode)
    if (!aiMode) {
      setAiSuggestion('Звучит интересно! Давайте обсудим детали на коротком созвоне — когда вам удобно?')
    } else {
      setAiSuggestion(null)
    }
  }

  const handleSelectConversation = (id: string) => {
    setActiveId(id)
    setMobileListVisible(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-syndi-bg flex">
      {/* Conversation list */}
      <AnimatePresence>
        {(mobileListVisible || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className={`${mobileListVisible ? 'fixed inset-0 z-40 bg-syndi-bg' : 'hidden'} md:block md:relative md:w-80 md:min-w-[20rem] border-r border-syndi-border`}
          >
            <div className="p-4 border-b border-syndi-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-white">Сообщения</h2>
                {mobileListVisible && (
                  <button onClick={() => setMobileListVisible(false)} className="md:hidden p-2 text-syndi-text-muted">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-syndi-text-muted" />
                <input type="text" placeholder="Поиск..." className="input-syndi w-full pl-9 text-sm" />
              </div>
            </div>
            <div className="overflow-y-auto">
              {CONVERSATIONS.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full flex items-start gap-3 p-4 transition-colors text-left ${
                    activeId === conv.id ? 'bg-syndi-teal/5 border-l-2 border-syndi-teal' : 'hover:bg-syndi-bg-elevated border-l-2 border-transparent'
                  }`}
                >
                  <img src={conv.partner.avatar} alt={conv.partner.name} className="w-12 h-12 rounded-full object-cover border border-syndi-border flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-white text-sm truncate">{conv.partner.name}</span>
                      <span className="text-xs text-syndi-text-muted flex-shrink-0 ml-2">{formatTime(conv.timestamp)}</span>
                    </div>
                    <p className="text-sm text-syndi-text-secondary truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-syndi-teal flex items-center justify-center text-xs font-bold text-syndi-bg flex-shrink-0">
                      {conv.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-syndi-border">
              {!mobileListVisible && (
                <button onClick={() => setMobileListVisible(true)} className="md:hidden p-2 -ml-2 text-syndi-text-muted">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <img src={activeConversation.partner.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-syndi-border" />
              <div>
                <p className="font-medium text-white text-sm">{activeConversation.partner.name}</p>
                <p className="text-xs text-syndi-text-muted">{activeConversation.partner.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.isMe
                        ? 'bg-syndi-teal text-syndi-bg font-medium rounded-br-md'
                        : 'bg-syndi-surface text-syndi-text-secondary rounded-bl-md'
                    } ${msg.isAiSuggestion ? 'opacity-70 border border-dashed border-syndi-violet' : ''}`}
                  >
                    {msg.text}
                    <div className={`text-xs mt-1 ${msg.isMe ? 'text-syndi-bg/70' : 'text-syndi-text-muted'}`}>
                      {formatTime(msg.timestamp)}
                      {msg.isAiSuggestion && ' • AI suggestion'}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* AI suggestion preview */}
              {aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end"
                >
                  <button
                    onClick={() => {
                      setInput(aiSuggestion)
                      setAiSuggestion(null)
                    }}
                    className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed bg-syndi-violet/10 text-syndi-text-secondary rounded-br-md border border-dashed border-syndi-violet/50 text-left"
                  >
                    {aiSuggestion}
                    <div className="text-xs mt-1 text-syndi-violet">Нажмите, чтобы использовать</div>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-syndi-border">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAiSuggest}
                  className={`p-3 rounded-xl transition-colors ${
                    aiMode ? 'bg-syndi-violet/20 text-syndi-violet' : 'bg-syndi-bg-elevated text-syndi-text-muted hover:text-syndi-violet'
                  }`}
                  title="AI помощник"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Написать сообщение..."
                    className="input-syndi w-full pr-12"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 rounded-xl bg-syndi-teal text-syndi-bg hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-syndi-text-muted mx-auto mb-4" />
              <p className="text-syndi-text-secondary">Выберите диалог, чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
