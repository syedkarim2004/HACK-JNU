import MainContent from './MainContent'

const Home = ({ sidebarCollapsed, userProfile, onSessionUpdate }) => {
  return (
    <MainContent 
      sidebarCollapsed={sidebarCollapsed} 
      userProfile={userProfile} 
      onSessionUpdate={onSessionUpdate}
    />
  )
}

export default Home