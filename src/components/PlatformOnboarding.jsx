import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const platforms = [
  {
    name: 'Amazon Seller',
    icon: '📦',
    status: 'not_started',
    steps: [
      'Business Registration Documents',
      'Bank Account Details', 
      'GST Certificate',
      'Identity Verification',
      'Product Catalogue Setup'
    ]
  },
  {
    name: 'Flipkart Marketplace',
    icon: '🛒',
    status: 'in_progress',
    steps: [
      'Seller Registration',
      'Business Verification',
      'Catalogue Management',
      'Inventory Setup',
      'Payment Setup'
    ]
  },
  {
    name: 'Swiggy Restaurant',
    icon: '🍕',
    status: 'not_started',
    steps: [
      'Restaurant License (FSSAI)',
      'Menu Creation',
      'Kitchen Setup Verification',
      'Delivery Area Setup',
      'Payment Integration'
    ]
  },
  {
    name: 'Zomato Partner',
    icon: '🥘',
    status: 'not_started',
    steps: [
      'Restaurant Registration',
      'Food Safety License',
      'Menu Photography',
      'Location Verification',
      'Commission Setup'
    ]
  }
]

const statusColors = {
  not_started: 'bg-gray-100 text-gray-600 border-gray-200',
  in_progress: 'bg-blue-100 text-blue-600 border-blue-200',
  completed: 'bg-green-100 text-green-600 border-green-200'
}

const PlatformOnboarding = () => {
  const { userIntent } = useAppContext()

  return (
    <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Platform Onboarding
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Get your business ready for major e-commerce and delivery platforms
          </p>
          {userIntent && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Intent: {userIntent} - Platform onboarding guidance active
              </p>
            </div>
          )}
        </motion.div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"
            >
              {/* Platform Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {platform.name}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[platform.status]}`}>
                  {platform.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Required Steps:
                </h4>
                {platform.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      {platform.status === 'completed' || (platform.status === 'in_progress' && stepIndex < 2) ? (
                        <div className="w-2 h-2 bg-blue-500 rounded"></div>
                      ) : null}
                    </div>
                    <span className={`text-sm ${
                      platform.status === 'completed' || (platform.status === 'in_progress' && stepIndex < 2)
                        ? 'text-slate-900 dark:text-slate-100' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button className="w-full mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                {platform.status === 'not_started' ? 'Start Onboarding' : 'Continue Setup'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-amber-50 dark:bg-amber-950 rounded-xl p-6 border border-amber-200 dark:border-amber-800"
        >
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
            💡 Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
            <li>• Complete GST registration first - required for most platforms</li>
            <li>• Keep high-quality product images ready for e-commerce platforms</li>
            <li>• FSSAI license is mandatory for food delivery platforms</li>
            <li>• Set competitive pricing strategies for each platform</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default PlatformOnboarding