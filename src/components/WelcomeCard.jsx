import { motion } from 'framer-motion'

const featureCards = [
  {
    title: 'Start a New Business',
    body: 'Get a step-by-step launch plan with registrations, licenses and documents.',
    accent: 'Quick Start',
    accentColor: 'text-orange-500',
    iconBg: 'bg-orange-100',
    iconBorder: 'border-orange-200',
    icon: '📋',
  },
  {
    title: 'Compliance Planner',
    body: 'See all your GST, EPF, ESIC, MCA and state deadlines in one calendar.',
    accent: 'View Calendar',
    accentColor: 'text-sky-500',
    iconBg: 'bg-sky-100',
    iconBorder: 'border-sky-200',
    icon: '�',
  },
  {
    title: 'Platform Onboarding',
    body: 'Onboard to Amazon, Flipkart, Swiggy, Zomato and more with guided checklists.',
    accent: 'Track & Manage',
    accentColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
    iconBorder: 'border-emerald-200',
    icon: '🚀',
  },
]

const WelcomeCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
      className="mb-0 min-h-[calc(100vh-9rem)] flex items-center"
    >
      <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-sky-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-white/60 dark:border-slate-800 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
        {/* Soft glow on top-right */}
        <div className="absolute -right-24 -top-24 h-52 w-52 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 opacity-20 blur-3xl" />

        <div className="relative z-10 px-5 pt-6 pb-3 lg:px-8 lg:pt-8 lg:pb-4 flex flex-col items-center text-center gap-5">
          {/* Headline */}
          <div className="max-w-2xl flex flex-col items-center gap-2.5">
            <motion.p
              className="text-xs sm:text-sm font-semibold tracking-[0.18em] text-sky-600 dark:text-sky-400 uppercase"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              MSME Launch & Compliance Copilot
            </motion.p>

            <motion.h1
              className="text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem] font-extrabold leading-tight text-slate-900 dark:text-slate-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              Hi there,
              <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">
                Ready
              </span>
              <span className="block">to launch your perfect MSME?</span>
            </motion.h1>

            <motion.p
              className="text-[13px] sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl"
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
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            {featureCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="relative rounded-2xl bg-white/95 dark:bg-slate-950/80 border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl px-5 py-5 flex flex-col gap-3 text-left"
              >
                <div
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-2xl border ${card.iconBg} ${card.iconBorder}`}
                >
                  <span className="text-lg">{card.icon}</span>
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.body}
                  </p>
                </div>
                <span className={`mt-0.5 text-[11px] font-semibold ${card.accentColor}`}>
                  {card.accent}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating bot tile and bubble on the right (desktop only) */}
          <div className="pointer-events-none">
            <div className="absolute right-8 top-10 hidden md:flex flex-col items-end gap-3">
              <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 shadow-md text-xs text-slate-700 dark:text-slate-200">
                <p>Hey there! 👋</p>
                <p className="mt-0.5">Need help with compliances?</p>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-xl">
                <span className="text-2xl text-white">🤖</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeCard
