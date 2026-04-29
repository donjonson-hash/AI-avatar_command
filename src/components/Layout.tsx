import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-syndi-bg text-syndi-text-primary">
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-[calc(100vh-64px)]"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
