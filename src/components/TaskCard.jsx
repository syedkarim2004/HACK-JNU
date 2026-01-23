import { motion } from 'framer-motion'
import { FiSettings } from 'react-icons/fi'

const TaskCard = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -4, rotate: 0.5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="p-5 rounded-xl bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-[0_18px_45px_rgba(15,23,42,0.65)] hover:shadow-lg cursor-pointer group"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="opacity-0 group-hover:opacity-100"
        >
          <FiSettings className="text-gray-600 dark:text-slate-300" size={18} />
        </motion.div>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="group-hover:opacity-0"
        >
          <FiSettings className="text-gray-600" size={18} />
        </motion.div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-slate-300">
          Suggested Task
        </h3>
      </div>
      <motion.p 
        whileHover={{ x: 4 }}
        className="text-base font-bold text-gray-900 dark:text-slate-50"
      >
        {title}
      </motion.p>
    </motion.div>
  )
}

export default TaskCard
