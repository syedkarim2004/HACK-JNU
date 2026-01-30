import { useState, useEffect, useMemo, useRef, memo } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { 
  FiShield, 
  FiAlertTriangle, 
  FiClock, 
  FiMessageCircle,
  FiTrendingUp,
  FiFileText,
  FiEye,
  FiCheck,
  FiX,
  FiInfo,
  FiZap,
  FiTarget,
  FiActivity
} from 'react-icons/fi'

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

// Memoized Dashboard - prevents re-mount on navigation
const Dashboard = memo(({ userProfile, sessionId }) => {
  const { userIntent } = useAppContext()
  const [complianceData, setComplianceData] = useState(null)
  const hasFetched = useRef(false)

  // Memoized mock data - prevents recalculation
  const mockDashboardData = useMemo(() => ({
    complianceScore: 72,
    pendingTasks: 3,
    upcomingDeadlines: 2,
    chatTopics: 5,
    complianceBreakdown: [
      { name: 'GST Compliance', value: 85, color: 'bg-green-500' },
      { name: 'Labor Laws', value: 60, color: 'bg-yellow-500' },
      { name: 'Trade License', value: 45, color: 'bg-red-500' },
      { name: 'FSSAI', value: 90, color: 'bg-green-500' }
    ],
    riskLevels: [
      { level: 'Low', count: 2, color: 'bg-green-500' },
      { level: 'Medium', count: 3, color: 'bg-yellow-500' },
      { level: 'High', count: 1, color: 'bg-red-500' }
    ],
    pendingTasksList: [
      {
        id: 1,
        title: 'File GST Return',
        priority: 'High',
        deadline: '2 days',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Apply Trade License',
        priority: 'Medium',
        deadline: '5 days',
        status: 'pending'
      },
      {
        id: 3,
        title: 'FSSAI Renewal',
        priority: 'Low',
        deadline: '15 days',
        status: 'pending'
      }
    ],
    chatInsights: [
      'GST registered but GSTR-3B filing pending',
      'Trade License not applied',
      'Labor compliance awareness missing'
    ],
    recommendedActions: [
      {
        title: 'File GST Return',
        priority: 'High',
        description: 'GSTR-3B due in 2 days to avoid penalty'
      },
      {
        title: 'Apply Trade License',
        priority: 'Medium', 
        description: 'Municipal approval required for operations'
      }
    ]
  }), [])

  // Set mock data immediately on mount for instant display
  useEffect(() => {
    if (!complianceData) {
      setComplianceData(mockDashboardData)
    }
  }, [mockDashboardData, complianceData])

  // Background fetch - updates data without blocking UI
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dashboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile, sessionId })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.data) {
            setComplianceData(result.data)
          }
        }
      } catch (error) {
        console.debug('Dashboard fetch failed, using cached data')
      }
    }

    if (userProfile) {
      fetchDashboardData()
    }
  }, [userProfile, sessionId])

  // Always use displayData - never null
  const displayData = complianceData || mockDashboardData

  // Remove loading state - always render content
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Status Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Compliance Dashboard
                </h1>
                {/* Live Status Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Monitoring Active
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, <span className="font-medium text-gray-900 dark:text-white">{userProfile?.businessOwnerName || 'Business Owner'}</span>
              </p>
            </div>
            {userIntent && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-2"
              >
                <FiTarget size={14} />
                Active Focus: {userIntent.replace('_', ' ')}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards with Stagger Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <StatCard
            icon={FiShield}
            title="Compliance Score"
            value={`${displayData.complianceScore}%`}
            subtitle="Based on current inputs"
            status={displayData.complianceScore >= 70 ? 'good' : displayData.complianceScore >= 40 ? 'warning' : 'critical'}
            color="blue"
          />
          <StatCard
            icon={FiAlertTriangle}
            title="Pending Tasks"
            value={displayData.pendingTasks}
            subtitle={displayData.pendingTasks > 0 ? "Needs attention" : "All caught up"}
            status={displayData.pendingTasks === 0 ? 'good' : displayData.pendingTasks <= 2 ? 'warning' : 'critical'}
            color="amber"
          />
          <StatCard
            icon={FiClock}
            title="Upcoming Deadlines"
            value={displayData.upcomingDeadlines}
            subtitle="Within next 30 days"
            status={displayData.upcomingDeadlines === 0 ? 'good' : 'warning'}
            color="rose"
          />
          <StatCard
            icon={FiMessageCircle}
            title="Chat Topics"
            value={displayData.chatTopics}
            subtitle="Insights gathered"
            status="good"
            color="emerald"
          />
        </motion.div>

        {/* Main Grid - Compliance Breakdown & Risk Levels */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Compliance Breakdown */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <FiActivity className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Compliance Breakdown
                </h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">Updated just now</span>
            </div>
            
            {displayData.complianceBreakdown && displayData.complianceBreakdown.length > 0 ? (
              <div className="space-y-5">
                {displayData.complianceBreakdown.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.value >= 80 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
                          item.value >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                        }`}>
                          {item.value >= 80 ? 'On Track' : item.value >= 50 ? 'In Progress' : 'Needs Attention'}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-right">
                          {item.value}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={FiActivity}
                title="No compliance data yet"
                description="Complete your business profile to see compliance breakdown"
              />
            )}
          </motion.div>

          {/* Risk Levels */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <FiAlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Risk Assessment
                </h3>
              </div>
            </div>
            
            {displayData.riskLevels && displayData.riskLevels.length > 0 ? (
              <div className="space-y-4">
                {displayData.riskLevels.map((risk, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {risk.level} Risk
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {risk.count}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {risk.count === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </motion.div>
                ))}
                
                {/* Risk Summary */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                    <FiInfo size={14} />
                    Risk levels are calculated based on deadline proximity and compliance status
                  </p>
                </div>
              </div>
            ) : (
              <EmptyState 
                icon={FiShield}
                title="No risks detected"
                description="Your compliance status looks good!"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Secondary Grid - Chat Insights & Recommended Actions */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
        >
          {/* Chat Insights */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                  <FiZap className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Insights
                </h3>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                From chat analysis
              </span>
            </div>
            
            {displayData.chatInsights && displayData.chatInsights.length > 0 ? (
              <div className="space-y-3">
                {displayData.chatInsights.map((insight, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {insight}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={FiMessageCircle}
                title="No insights yet"
                description="Start a chat conversation to generate AI-powered compliance insights"
                actionText="Start a Chat"
              />
            )}
          </motion.div>

          {/* Recommended Actions */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                  <FiTrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recommended Actions
                </h3>
              </div>
            </div>
            
            {displayData.recommendedActions && displayData.recommendedActions.length > 0 ? (
              <div className="space-y-4">
                {displayData.recommendedActions.map((action, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </h4>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        action.priority === 'High' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                          : action.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      }`}>
                        {action.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {action.description}
                    </p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                      <FiEye size={14} />
                      View Details
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={FiTrendingUp}
                title="No recommendations yet"
                description="Actions will appear based on your compliance status and chat conversations"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Pending Tasks Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mt-8 border border-gray-100 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40">
                <FiFileText className="text-rose-600 dark:text-rose-400" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pending Tasks
              </h3>
            </div>
            {displayData.pendingTasksList && displayData.pendingTasksList.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-medium">
                {displayData.pendingTasksList.length} pending
              </span>
            )}
          </div>
          
          {displayData.pendingTasksList && displayData.pendingTasksList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-sm">Task</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-sm">Priority</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-sm">Deadline</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.pendingTasksList.map((task, index) => (
                    <motion.tr 
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                        {task.title}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'High' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {task.deadline}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors" title="Mark Complete">
                            <FiCheck size={16} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors" title="Dismiss">
                            <FiX size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              icon={FiCheck}
              title="All tasks completed!"
              description="Great job! You have no pending compliance tasks."
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
})

// Reusable StatCard component
const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${bgColor} rounded-xl p-6 border border-gray-100 dark:border-slate-800`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color.includes('blue') ? 'bg-blue-100 dark:bg-blue-900' : 
                        color.includes('yellow') ? 'bg-yellow-100 dark:bg-yellow-900' :
                        color.includes('red') ? 'bg-red-100 dark:bg-red-900' :
                        'bg-green-100 dark:bg-green-900'}`}>
        <Icon className={color} size={24} />
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
)

export default Dashboard