import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Routes, Route, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import { ChatContextProvider } from './context/ChatContext'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import TopBar from './components/TopBar'
import ProfilePage from './components/ProfilePage'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import PlatformOnboarding from './components/PlatformOnboarding'
import Home from './components/Home'
import ChatSidebar from './components/ChatSidebar'
import ChatGPTInterface from './components/ChatGPTInterface'
import Login from './components/Login'

// Memoized Layout component - NEVER remounts on navigation
const AppLayout = memo(({ 
  isDark, 
  sidebarCollapsed, 
  onSidebarToggle,
  onViewProfile,
  googleUser,
  onNavigate,
  activePage,
  onThemeToggle,
  onLoginSuccess,
  onLogout
}) => {
  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={onSidebarToggle}
          onViewProfile={onViewProfile}
          googleUser={googleUser} 
          onNavigate={onNavigate}
          activePage={activePage}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar 
            isDark={isDark} 
            onThemeToggle={onThemeToggle} 
            googleUser={googleUser}
            onLoginSuccess={onLoginSuccess}
            onLogout={onLogout}
          />
          {/* Outlet renders the matched child route - only this changes */}
          <Outlet />
        </div>
      </div>
    </div>
  )
})

function App() {
  const { sessionId, setSessionId } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : true
  })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Derive activePage from URL - no separate state needed
  const activePage = useMemo(() => {
    const path = location.pathname
    if (path === '/home' || path === '/') return 'home'
    if (path === '/dashboard') return 'dashboard'
    if (path === '/chat') return 'chat'
    return 'home'
  }, [location.pathname])
  
  // Check localStorage for persisted auth on mount
  const [googleUser, setGoogleUser] = useState(() => {
    const savedAuth = localStorage.getItem('msme_auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  // Initialize userProfile from saved auth or use defaults
  const [userProfile, setUserProfile] = useState(() => {
    const savedAuth = localStorage.getItem('msme_auth');
    if (savedAuth) {
      const userData = JSON.parse(savedAuth);
      return {
        businessOwnerName: userData.name || '',
        businessName: '',
        businessType: '',
        msmeCategory: '',
        city: '',
        state: '',
        email: userData.email || '',
        mobileNumber: '',
        gstNumber: '',
        registrationDate: '',
        picture: userData.picture || '',
        userId: userData.googleId || userData.email
      };
    }
    return {
      businessOwnerName: '',
      businessName: '',
      businessType: '',
      msmeCategory: '',
      city: '',
      state: '',
      email: '',
      mobileNumber: '',
      gstNumber: '',
      registrationDate: '',
      picture: '',
      userId: ''
    };
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Memoized handlers to prevent unnecessary re-renders
  const handleLogin = useCallback((userData) => {
    console.log('🔐 Login successful:', userData.email);
    setGoogleUser(userData);
    setUserProfile({
      businessOwnerName: userData.name,
      businessName: '',
      businessType: '',
      msmeCategory: '',
      city: '',
      state: '',
      email: userData.email,
      mobileNumber: '',
      gstNumber: '',
      registrationDate: '',
      picture: userData.picture,
      userId: userData.googleId || userData.email
    });
    navigate('/home');
  }, [navigate])

  const handleLogout = useCallback(() => {
    setGoogleUser(null)
    localStorage.removeItem('msme_auth')
    navigate('/login')
  }, [navigate])

  const handleViewProfile = useCallback(() => {
    navigate('/profile')
  }, [navigate])

  const handleNavigate = useCallback((page) => {
    if (page === 'home') {
      navigate('/home')
    } else if (page === 'dashboard') {
      navigate('/dashboard')
    } else if (page === 'chat') {
      navigate('/chat')
    }
  }, [navigate])

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const handleThemeToggle = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  const handleSaveProfile = useCallback((updatedProfile) => {
    setUserProfile(updatedProfile)
    console.log('Profile saved:', updatedProfile)
  }, [])

  // If not authenticated, only show login route
  if (!googleUser) {
    return (
      <ChatContextProvider>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLogin} isAuthenticated={false} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ChatContextProvider>
    )
  }

  // Authenticated routes with persistent layout
  return (
    <ChatContextProvider>
      <Routes>
        {/* Redirect login to home if already authenticated */}
        <Route path="/login" element={<Navigate to="/home" replace />} />
        
        {/* Layout wrapper - persists across all child routes */}
        <Route 
          element={
            <AppLayout
              isDark={isDark}
              sidebarCollapsed={sidebarCollapsed}
              onSidebarToggle={handleSidebarToggle}
              onViewProfile={handleViewProfile}
              googleUser={googleUser}
              onNavigate={handleNavigate}
              activePage={activePage}
              onThemeToggle={handleThemeToggle}
              onLoginSuccess={handleLogin}
              onLogout={handleLogout}
            />
          }
        >
          {/* Child routes - only these components change on navigation */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route 
            path="/home" 
            element={
              <Home 
                sidebarCollapsed={sidebarCollapsed} 
                userProfile={userProfile} 
                onSessionUpdate={setSessionId}
              />
            } 
          />
          <Route 
            path="/chat" 
            element={
              <div className="relative h-full overflow-hidden">
                <ChatSidebar />
                <ChatGPTInterface userProfile={userProfile} />
              </div>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                userProfile={userProfile} 
                sessionId={sessionId}
              />
            } 
          />
          <Route path="/platforms" element={<PlatformOnboarding />} />
          <Route 
            path="/profile" 
            element={
              <Profile 
                googleUser={googleUser}
                userProfile={userProfile}
              />
            } 
          />
          <Route 
            path="/profile-old" 
            element={
              <ProfilePage 
                userProfile={userProfile}
                onSave={handleSaveProfile}
                onBack={() => navigate('/home')}
              />
            } 
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </ChatContextProvider>
  )
}

export default App