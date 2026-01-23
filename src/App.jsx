import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import TopBar from './components/TopBar'
import ProfilePage from './components/ProfilePage'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('home')

  const [userProfile, setUserProfile] = useState({
    businessOwnerName: 'Rajesh Kumar',
    businessName: 'Kumar Textiles Pvt. Ltd.',
    businessType: 'Textile',
    msmeCategory: 'Small',
    city: 'Surat',
    state: 'Gujarat',
    email: 'rajesh@kumartextiles.com',
    mobileNumber: '+91 98765 43210',
    gstNumber: '24AABCU9603R1ZX',
    registrationDate: '2020-03-15'
  })

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const handleViewProfile = () => {
    setActivePage('profile')
  }

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile)
    // Here you would typically save to backend
    console.log('Profile saved:', updatedProfile)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onViewProfile={handleViewProfile}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
          {activePage === 'home' && (
            <MainContent sidebarCollapsed={sidebarCollapsed} />
          )}
          {activePage === 'profile' && (
            <ProfilePage 
              userProfile={userProfile}
              onSave={handleSaveProfile}
              onBack={() => setActivePage('home')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App