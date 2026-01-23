import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiPlus, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const TaskList = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const tasks = [
    { 
      title: 'Design Meeting', 
      time: '2 pm', 
      status: 'urgent',
      action: 'Join now',
      actionColor: 'blue'
    },
    { 
      title: 'Refine UI components based on user feedback', 
      status: 'urgent',
      priority: 'Urgent',
      deadline: 'By today',
      deadlineColor: 'red'
    },
    { 
      title: 'Prepare a prototype for usability testing', 
      status: 'in-progress',
      priority: 'In progress',
      deadline: 'By tomorrow',
      deadlineColor: 'green'
    },
    { 
      title: 'Collaborate with developers on implementation detail', 
      status: 'todo',
      priority: 'To do',
      deadline: 'By tomorrow',
      deadlineColor: 'green'
    },
  ]

  const visibleTasks = isExpanded ? tasks : tasks.slice(0, 2)

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-500'
      case 'in-progress': return 'bg-blue-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-xl bg-white border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          My Tasks <span className="text-gray-500 font-normal">13</span>
        </h3>
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-1 relative max-w-xs"
          >
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for name..."
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 text-sm transition-all"
            />
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100"
            >
              <FiPlus className="text-gray-400" size={16} />
            </motion.button>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <FiStar size={16} />
            </motion.div>
            Prioritize Tasks
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isExpanded ? 'expanded' : 'collapsed'}
          initial={{ height: 'auto' }}
          animate={{ height: 'auto' }}
          className="space-y-2.5"
        >
          {visibleTasks.map((task, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all flex items-center gap-3 cursor-pointer"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                className={`w-2.5 h-2.5 rounded-full ${getStatusColor(task.status)}`}
              ></motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {task.time && (
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="text-xs text-gray-500"
                    >
                      {task.time}
                    </motion.span>
                  )}
                  {task.priority && (
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        task.priority === 'Urgent' 
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'In progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {task.priority}
                    </motion.span>
                  )}
                  {task.deadline && (
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        task.deadlineColor === 'red'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-green-50 text-green-600'
                      }`}
                    >
                      {task.deadline}
                    </motion.span>
                  )}
                </div>
              </div>
              {task.action && (
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white ${
                    task.actionColor === 'blue'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : ''
                  } transition-colors shadow-sm`}
                >
                  {task.action}
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {tasks.length > 2 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <>
              <FiChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <FiChevronDown size={16} />
              Show {tasks.length - 2} More
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  )
}

export default TaskList
