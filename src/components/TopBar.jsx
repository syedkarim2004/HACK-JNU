import { useState, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSun, FiMoon, FiLogIn, FiLogOut } from 'react-icons/fi'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'

// Memoized TopBar to prevent re-renders when sibling routes change
const TopBar = memo(({ isDark, onThemeToggle, googleUser, onLoginSuccess, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userData = await response.json();
        onLoginSuccess(userData);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
    onError: error => console.log('Login Failed:', error)
  });

  const handleSignOut = useCallback(() => {
    googleLogout()
    onLogout()
    setShowDropdown(false)
  }, [onLogout])

  return (
    <div className={`h-16 px-6 flex items-center justify-between bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-slate-950/80 dark:border-slate-800 relative z-50`}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          MSME Compliance Navigator
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onThemeToggle}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-all"
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.button>

        {googleUser ? (
          <div className="relative">
            {/* User Profile Trigger */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 pl-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 select-none">
                Hi, {googleUser.given_name}
              </span>
              <img 
                src={googleUser.picture} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-14 w-48 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {googleUser.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {googleUser.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                  >
                    <FiLogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => login()}
            className="px-4 py-2 rounded-lg bg-white flex items-center gap-2 text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-all"
          >
            <FiLogIn size={18} />
            <span className="text-sm font-medium">Login with Google</span>
          </motion.button>
        )}
      </div>
    </div>
  )
})

export default TopBar