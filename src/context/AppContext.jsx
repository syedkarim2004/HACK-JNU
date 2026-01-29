import { createContext, useContext, useState } from 'react'

// Create the context
const AppContext = createContext()

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}

// Context provider component
export const AppContextProvider = ({ children }) => {
  // User intent state for different flows
  const [userIntent, setUserIntent] = useState(null)
  
  // Additional state that might be useful across the app
  const [sessionId, setSessionId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Intent constants
  const INTENTS = {
    NEW_BUSINESS: 'NEW_BUSINESS',
    COMPLIANCE_CALENDAR: 'COMPLIANCE_CALENDAR', 
    PLATFORM_ONBOARDING: 'PLATFORM_ONBOARDING'
  }

  // Helper function to set intent and handle navigation logic
  const setIntentAndNavigate = (intent) => {
    setUserIntent(intent)
    console.log('User intent set to:', intent)
  }

  // Clear intent (useful when returning to home or starting over)
  const clearIntent = () => {
    setUserIntent(null)
  }

  const value = {
    // State
    userIntent,
    sessionId,
    isLoading,
    
    // Constants
    INTENTS,
    
    // Actions
    setUserIntent,
    setIntentAndNavigate,
    clearIntent,
    setSessionId,
    setIsLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext