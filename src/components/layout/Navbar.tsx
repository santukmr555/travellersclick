import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
} from '@mui/material';
import {
  Home,
  DirectionsCar,
  Hotel,
  TwoWheeler,
  RvHookup,
  AccountBalance,
  TravelExplore,
  LocationSearching,
  ExitToApp,
  LocationOn,
  Group,
  Book,
  TrendingUp,
  Settings,
  Logout,
  Menu,
} from '@mui/icons-material';
import { ServiceType, User as UserType, PageType } from '@/App'

interface NavbarProps {
  currentUser: UserType | null
  currentPage: PageType
  onPageChange: (page: PageType) => void
  onLogin: () => void
  onRegister: () => void
  onLogout: () => void
  onToggleFilterSidebar: () => void
  showHamburgerMenu: boolean
}

const navItems = [
  { id: 'bikes' as const, label: 'Bike Rentals', icon: TwoWheeler },
  { id: 'cars' as const, label: 'Car Rentals', icon: DirectionsCar },
  { id: 'campervans' as const, label: 'Campervans', icon: RvHookup },
  { id: 'nomad' as const, label: 'Nomad Hotels', icon: LocationOn },
  { id: 'pilgrimage' as const, label: 'Pilgrimage Tours', icon: AccountBalance },
  { id: 'pilgrim-hotels' as const, label: 'Pilgrim Hotels', icon: Hotel },
  { id: 'trips' as const, label: 'Guided Bike Trips', icon: Group },
  { id: 'stories' as const, label: 'User Stories', icon: Book },
  { id: 'insights' as const, label: 'Insights', icon: TrendingUp },
]

export function Navbar({ 
  currentUser, 
  currentPage, 
  onPageChange, 
  onLogin, 
  onRegister, 
  onLogout,
  onToggleFilterSidebar,
  showHamburgerMenu
}: NavbarProps) {

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(10px)',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px', py: 1 }}>
          {/* Left side - Hamburger menu and Site title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Hamburger Menu Icon - Only show on service pages */}
            {showHamburgerMenu && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="toggle filters"
                onClick={onToggleFilterSidebar}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <Menu sx={{ fontSize: 28 }} />
              </IconButton>
            )}

            {/* Site Title */}
            <Button
              onClick={() => onPageChange('home')}
              sx={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: 'primary.main',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.dark'
                }
              }}
            >
              TravellerClicks
            </Button>
          </Box>

          {/* Center - Navigation Menu Items */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "contained" : "text"}
                  onClick={() => onPageChange(item.id)}
                  sx={{ 
                    color: currentPage === item.id ? 'primary.contrastText' : 'text.primary',
                    textTransform: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    minHeight: '60px',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: currentPage === item.id ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <IconComponent sx={{ fontSize: 28 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, textAlign: 'center' }}>
                    {item.label}
                  </Typography>
                </Button>
              )
            })}
            
            {/* Dashboard menu for logged in users */}
            {currentUser && (
              <Button
                variant={currentPage === 'dashboard' ? "contained" : "text"}
                onClick={() => onPageChange('dashboard')}
                sx={{ 
                  color: currentPage === 'dashboard' ? 'primary.contrastText' : 'text.primary',
                  textTransform: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minHeight: '60px',
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: currentPage === 'dashboard' ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <Settings sx={{ fontSize: 28 }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, textAlign: 'center' }}>
                  {currentUser.role === 'provider' ? 'Admin Dashboard' : 'User Dashboard'}
                </Typography>
              </Button>
            )}
          </Box>

          {/* Right side - Login/Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {currentUser ? (
              <Button 
                variant="contained" 
                onClick={onLogout}
                sx={{ 
                  backgroundColor: 'error.main',
                  color: 'white',
                  textTransform: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minHeight: '60px',
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'error.dark'
                  }
                }}
              >
                <Logout sx={{ fontSize: 24 }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  Sign Out
                </Typography>
              </Button>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button 
                  variant="text" 
                  onClick={onLogin}
                  sx={{ 
                    color: 'text.primary', 
                    textTransform: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    minHeight: '60px',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  <ExitToApp sx={{ fontSize: 24 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                    Sign In
                  </Typography>
                </Button>
                <Button 
                  variant="contained" 
                  onClick={onRegister}
                  sx={{ 
                    textTransform: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    minHeight: '60px',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  <LocationSearching sx={{ fontSize: 24 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                    Sign Up
                  </Typography>
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}