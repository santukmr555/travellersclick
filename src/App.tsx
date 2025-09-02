import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { muiTheme } from '@/theme/mui-theme'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/components/pages/HomePage'
import { ServicePage } from '@/components/pages/ServicePage'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { AuthModal } from '@/components/auth/AuthModal'
import { Toaster } from 'sonner'
// Initialize demo data and real-time services
import '@/services/demoDataService'

export type ServiceType = 'bikes' | 'cars' | 'campervans' | 'nomad' | 'pilgrimage' | 'pilgrim-hotels' | 'trips' | 'stories' | 'insights'
export type PageType = ServiceType | 'home' | 'dashboard'

export interface User {
  id: string
  email: string
  name: string
  role: 'traveller' | 'provider' | 'admin'
  isVerified: boolean
}

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('current-user', null)
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true)

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentPage('home')
  }

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const toggleFilterSidebar = () => {
    setFilterSidebarOpen(!filterSidebarOpen)
  }

  const handlePageChange = (page: string) => {
    // Map string values from footer links to PageType
    const pageMap: Record<string, PageType> = {
      'bikes': 'bikes',
      'cars': 'cars',
      'campervans': 'campervans',
      'nomad': 'nomad',
      'pilgrimage': 'pilgrimage',
      'pilgrim-hotels': 'pilgrim-hotels',
      'trips': 'trips',
      'stories': 'stories',
      'insights': 'insights',
      'home': 'home',
      'dashboard': 'dashboard'
    }
    
    const mappedPage = pageMap[page] || 'home'
    setCurrentPage(mappedPage)
  }

  // Show hamburger menu only on service pages (not home or dashboard)
  const showHamburgerMenu = currentPage !== 'home' && currentPage !== 'dashboard'

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-background">
        <Navbar 
          currentUser={currentUser}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogin={() => openAuth('login')}
          onRegister={() => openAuth('register')}
          onLogout={handleLogout}
          onToggleFilterSidebar={toggleFilterSidebar}
          showHamburgerMenu={showHamburgerMenu}
        />
        
        <main>
          {currentPage === 'home' ? (
            <HomePage onServiceSelect={setCurrentPage} />
          ) : currentPage === 'dashboard' ? (
            <DashboardPage currentUser={currentUser} />
          ) : (
            <ServicePage 
              serviceType={currentPage as ServiceType}
              currentUser={currentUser}
              filterSidebarOpen={filterSidebarOpen}
            />
          )}
        </main>

        <Footer onPageChange={handlePageChange} />

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          onLogin={handleLogin}
        />

        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App