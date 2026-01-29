import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { FiArrowLeft, FiUser, FiMail, FiBriefcase, FiHash } from 'react-icons/fi'

const Profile = ({ googleUser, userProfile }) => {
  const navigate = useNavigate()
  const { sessionId } = useAppContext()
  
  // Use actual user data if available, fallback to defaults
  const userData = {
    name: googleUser?.name || userProfile?.businessOwnerName || 'Business Owner',
    email: googleUser?.email || userProfile?.email || 'user@example.com',
    accountType: 'MSME Business Owner',
    userId: sessionId || 'user_' + Math.random().toString(36).substr(2, 9),
    businessName: userProfile?.businessName || 'Your Business',
    msmeCategory: userProfile?.msmeCategory || 'Small Enterprise',
    picture: googleUser?.picture || userProfile?.picture
  }

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBackClick}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">View your account information</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
            <div className="flex items-center gap-4">
              {userData.picture ? (
                <img 
                  src={userData.picture} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FiUser className="text-white" size={24} />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
                <p className="text-blue-100">{userData.accountType}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiUser className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiMail className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiHash className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="text-gray-900 dark:text-white font-medium font-mono text-sm">{userData.userId}</p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Business Information
                </h3>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiBriefcase className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.accountType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiBriefcase className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Business Name</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.businessName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiBriefcase className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">MSME Category</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userData.msmeCategory}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-3">
                <button
                  onClick={handleBackClick}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile