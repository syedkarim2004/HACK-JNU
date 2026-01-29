import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const featureCards = [
  {
    title: 'Start a New Business',
    body: 'Get a step-by-step launch plan with registrations, licenses and documents.',
    accent: 'Quick Start',
    accentColor: 'text-orange-500',
    iconBg: 'bg-orange-100',
    iconBorder: 'border-orange-200',
    icon: '📋',
    intent: 'NEW_BUSINESS',
    route: '/chat'
  },
  {
    title: 'Compliance Planner',
    body: 'See all your GST, EPF, ESIC, MCA and state deadlines in one calendar.',
    accent: 'View Calendar',
    accentColor: 'text-sky-500',
    iconBg: 'bg-sky-100',
    iconBorder: 'border-sky-200',
    icon: '📅',
    intent: 'COMPLIANCE_CALENDAR',
    route: '/dashboard'
  },
  {
    title: 'Platform Onboarding',
    body: 'Onboard to Amazon, Flipkart, Swiggy, Zomato and more with guided checklists.',
    accent: 'Track & Manage',
    accentColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
    iconBorder: 'border-emerald-200',
    icon: '🚀',
    intent: 'PLATFORM_ONBOARDING',
    route: '/platforms'
  },
]

const WelcomeCard = () => {
  const { INTENTS, setIntentAndNavigate } = useAppContext()
  const navigate = useNavigate()

  const handleCardClick = (card) => {
    // Set the user intent in context
    setIntentAndNavigate(INTENTS[card.intent])
    
    // Navigate to the appropriate route
    navigate(card.route)
    
    console.log(`Clicked: ${card.title}, Intent: ${card.intent}, Route: ${card.route}`)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
      // Adjusted height to ensure it ends above the chat input
      // Added pb-20 (bottom padding) to lift the card up
      className="m-4 w-[calc(100%-2rem)] flex items-start justify-center" 
    >
      <div className="relative w-full flex flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-white/60 dark:border-slate-800 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
        {/* Soft glow on top-right */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 opacity-20 blur-3xl" />
        
        {/* Soft glow on bottom-left */}
        <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 opacity-10 blur-3xl" />

        <div className="relative z-10 px-6 py-5 lg:px-12 lg:py-7 flex flex-col items-center text-center gap-5 justify-center overflow-auto">
          {/* Headline Section */}
          <div className="w-full flex flex-col items-center gap-5">
            <motion.p
              className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-sky-600 dark:text-sky-400 uppercase"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              MSME Launch & Compliance Copilot
            </motion.p>

            <motion.h1
              className="text-[2.4rem] sm:text-[3.1rem] lg:text-[3.6rem] font-extrabold leading-tight text-slate-900 dark:text-slate-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              Hi there,
              <span className="ml-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
                Ready
              </span>
              <span className="block mt-2">to launch your perfect MSME?</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
            >
              Share your idea in simple words and get a clear roadmap for registrations, compliances and platform
              onboarding.
            </motion.p>
          </div>

          {/* Feature cards row */}
          <motion.div
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            {featureCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                onClick={() => handleCardClick(card)}
                className="relative rounded-2xl bg-white/95 dark:bg-slate-950/80 border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl px-5 py-4 flex flex-col gap-3 text-left h-full justify-between cursor-pointer group"
              >
                <div className="flex flex-col gap-4">
                  <div
                    className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${card.iconBg} ${card.iconBorder}`}
                  >
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 leading-snug">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-bold uppercase tracking-wide ${card.accentColor} group-hover:scale-105 transition-transform`}>
                  {card.accent} →
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating bot tile (desktop only) */}
          <div className="pointer-events-none">
            <div className="absolute right-10 top-10 hidden lg:flex flex-col items-end gap-3">
              <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 shadow-md text-sm text-slate-700 dark:text-slate-200">
                <p>Hey there! 👋</p>
                <p className="mt-1">Need help with compliances?</p>
              </div>
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-xl">
                <span className="text-4xl text-white">🤖</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeCard