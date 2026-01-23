import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

const MeetingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="p-5 rounded-xl bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-[0_18px_45px_rgba(15,23,42,0.65)] hover:shadow-lg cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <FiStar className="text-yellow-500" size={18} />
        </motion.div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-100">
          Summarize your last meeting
        </h3>
      </div>
      
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-md"
        >
          👤
        </motion.div>
        <div className="flex-1">
          <motion.div 
            whileHover={{ x: 2 }}
            className="flex items-center gap-2"
          >
            <motion.span 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="text-lg"
            >
              📅
            </motion.span>
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
              UX Strategy Meet up
            </p>
          </motion.div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            1 Apr 2025, 14:00 pm
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default MeetingCard
