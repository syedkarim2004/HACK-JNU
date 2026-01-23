import { motion } from 'framer-motion'
import { FiSun, FiMoon, FiLogIn } from 'react-icons/fi'

const TopBar = ({ isDark, onThemeToggle }) => {
  return (
    <div className={`h-16 px-6 flex items-center justify-between bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-slate-950/80 dark:border-slate-800`}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          MSME Compliance Navigator
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onThemeToggle}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-all"
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.button>

        {/* Google Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-white flex items-center gap-2 text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-all"
        >
          <FiLogIn size={18} />
          <span className="text-sm font-medium">Login with Google</span>
        </motion.button>
      </div>
    </div>
  )
}

export default TopBar
