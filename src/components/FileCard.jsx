import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFile, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const FileCard = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const files = [
    { name: 'Miro - Product Analytics and Statistics', icon: '📊', color: 'bg-purple-100' },
    { name: 'Figma - UX Research', icon: '🎨', color: 'bg-pink-100' },
    { name: 'R2 Strategic Goals & Objectives.pdf', icon: '📄', color: 'bg-red-100' },
  ]

  const visibleFiles = isExpanded ? files : files.slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="p-5 rounded-xl bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-[0_18px_45px_rgba(15,23,42,0.65)] hover:shadow-lg cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiFile className="text-gray-600 dark:text-slate-300" size={18} />
          </motion.div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-100">
            Previously viewed files
          </h3>
        </div>
        {files.length > 2 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </motion.button>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={isExpanded ? 'expanded' : 'collapsed'}
          initial={{ height: 'auto' }}
          animate={{ height: 'auto' }}
          exit={{ height: 'auto' }}
          className="space-y-2.5"
        >
          {visibleFiles.map((file, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 4, scale: 1.01 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className={`w-8 h-8 rounded flex items-center justify-center ${file.color} text-lg`}
              >
                {file.icon}
              </motion.div>
              <p className="text-sm text-gray-800 dark:text-slate-100 flex-1">{file.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default FileCard
