import { memo } from 'react'
import MainContent from './MainContent'

// Memoized Home - prevents re-mount on navigation
const Home = memo(({ sidebarCollapsed, userProfile, onSessionUpdate }) => {
  return (
    <MainContent 
      sidebarCollapsed={sidebarCollapsed} 
      userProfile={userProfile} 
      onSessionUpdate={onSessionUpdate}
    />
  )
})

export default Home