import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiHome, 
  FiMessageSquare, 
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiLayout,
  FiClock,
  FiEye
} from 'react-icons/fi'

const Sidebar = ({ collapsed, onToggle, onViewProfile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)

  const menuItems = [
    { icon: FiHome, label: 'Home', active: true },
    { icon: FiLayout, label: 'Dashboard' },
    { icon: FiMessageSquare, label: 'New Chat' },
  ]

  const recentActivities = {
    'Today': [
      'GST Return Filing Query',
      'Compliance Calendar Request',
      'MSME Registration Help'
    ],
    'Yesterday': [
      'TDS Form Auto-fill Request',
      'Upcoming Deadlines Check'
    ]
  }

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? '80px' : '280px' }}
      className={`h-screen bg-gray-50 border-r border-gray-200 dark:bg-slate-950 dark:border-slate-800 flex flex-col overflow-hidden`}
    >
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer relative"
            onClick={() => {
              if (!collapsed) {
                onViewProfile()
              }
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
              <FiUser className="text-white" size={20} />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">Business Owner</p>
                <p className="text-gray-600 dark:text-slate-400 text-xs">MSME Account</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center"
          >
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto scroll-smooth py-4">
        <div className="px-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={index}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  item.active
                    ? 'bg-blue-100 text-blue-600 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
                    : 'text-gray-800 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <Icon size={20} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </motion.button>
            )
          })}
        </div>

        {/* Chat History Section */}
        {!collapsed && (
          <div className="mt-6 px-4">
            <div className="flex items-center gap-2 mb-3 px-2">
              <FiClock className="text-gray-500 dark:text-slate-400" size={16} />
              <h3 className="text-gray-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wide">
                Chat History
              </h3>
            </div>
            <div className="space-y-4">
              {Object.entries(recentActivities).map(([day, activities]) => (
                <div key={day}>
                  <h3 className="text-gray-600 dark:text-slate-400 text-xs font-medium mb-2 px-2">
                    {day}
                  </h3>
                  <div className="space-y-1">
                    {activities.map((activity, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ x: 4 }}
                        className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 rounded transition-all"
                      >
                        {activity}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Sidebar