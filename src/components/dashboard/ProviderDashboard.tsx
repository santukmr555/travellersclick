import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { User } from '@/App'
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  IconButton,
  Divider,
  Container
} from '@mui/material'
import { 
  Settings, 
  Add, 
  CalendarToday, 
  TrendingUp,
  TwoWheeler,
  DirectionsCar,
  RvHookup,
  LocationOn,
  Edit,
  Delete
} from '@mui/icons-material'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'
import { AddServiceForm } from '@/components/dashboard/AddServiceForm'
import { BookingsDashboard } from '@/components/dashboard/BookingsDashboard'
import { ProviderInsights } from '@/components/dashboard/ProviderInsights'

interface ProviderDashboardProps {
  currentUser: User
}

type DashboardSection = 'profile' | 'add-service' | 'bookings' | 'insights'
type ServiceType = 'bike' | 'car' | 'campervan' | 'hotel'

interface ServiceListing {
  id: string
  type: ServiceType
  name: string
  brand?: string
  model?: string
  city: string
  location?: string
  pricePerDay: number
  pricePerHour?: number
  pricePerWeek?: number
  pricePerMonth?: number
  available: boolean
  bookingsCount: number
  rating: number
  dateAdded: string
  transmission?: string
  fuelType?: string
  seatingCapacity?: number
  propertyType?: string
  bedrooms?: number
  guestCapacity?: number
}

const mockServices: ServiceListing[] = [
  // Bike Services
  {
    id: '1',
    type: 'bike',
    name: 'Honda Activa 6G',
    brand: 'Honda',
    model: 'Activa 6G',
    city: 'Mumbai',
    location: 'Andheri West',
    pricePerHour: 40,
    pricePerDay: 800,
    pricePerWeek: 5000,
    pricePerMonth: 18000,
    available: true,
    bookingsCount: 15,
    rating: 4.5,
    dateAdded: '2024-01-15',
    transmission: 'automatic',
    fuelType: 'petrol',
    seatingCapacity: 2
  },
  {
    id: '2',
    type: 'bike',
    name: 'TVS Jupiter',
    brand: 'TVS',
    model: 'Jupiter',
    city: 'Bangalore',
    location: 'Koramangala',
    pricePerHour: 35,
    pricePerDay: 700,
    pricePerWeek: 4500,
    pricePerMonth: 16000,
    available: true,
    bookingsCount: 22,
    rating: 4.3,
    dateAdded: '2024-01-20',
    transmission: 'automatic',
    fuelType: 'petrol',
    seatingCapacity: 2
  },
  // Car Services
  {
    id: '3',
    type: 'car',
    name: 'Tata Nexon',
    brand: 'Tata',
    model: 'Nexon',
    city: 'Delhi',
    location: 'Connaught Place',
    pricePerHour: 120,
    pricePerDay: 2500,
    pricePerWeek: 16000,
    pricePerMonth: 60000,
    available: false,
    bookingsCount: 8,
    rating: 4.2,
    dateAdded: '2024-02-10',
    transmission: 'manual',
    fuelType: 'petrol',
    seatingCapacity: 5
  },
  {
    id: '4',
    type: 'car',
    name: 'Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    city: 'Chennai',
    location: 'T. Nagar',
    pricePerHour: 100,
    pricePerDay: 2000,
    pricePerWeek: 13000,
    pricePerMonth: 48000,
    available: true,
    bookingsCount: 12,
    rating: 4.4,
    dateAdded: '2024-02-15',
    transmission: 'automatic',
    fuelType: 'petrol',
    seatingCapacity: 5
  },
  // Campervan Services
  {
    id: '5',
    type: 'campervan',
    name: 'Tata Adventure Van',
    brand: 'Tata',
    model: 'Adventure Van',
    city: 'Goa',
    location: 'Panaji',
    pricePerHour: 200,
    pricePerDay: 4000,
    pricePerWeek: 25000,
    pricePerMonth: 90000,
    available: true,
    bookingsCount: 5,
    rating: 4.6,
    dateAdded: '2024-03-01',
    transmission: 'manual',
    fuelType: 'diesel',
    seatingCapacity: 4
  },
  {
    id: '6',
    type: 'campervan',
    name: 'Mahindra Bolero Camper',
    brand: 'Mahindra',
    model: 'Bolero Camper',
    city: 'Manali',
    location: 'Old Manali',
    pricePerHour: 250,
    pricePerDay: 5000,
    pricePerWeek: 32000,
    pricePerMonth: 120000,
    available: true,
    bookingsCount: 3,
    rating: 4.7,
    dateAdded: '2024-03-10',
    transmission: 'manual',
    fuelType: 'diesel',
    seatingCapacity: 6
  },
  // Hotel Services
  {
    id: '7',
    type: 'hotel',
    name: 'Cozy Beach Apartment',
    propertyType: 'apartment',
    city: 'Goa',
    location: 'Anjuna',
    pricePerDay: 3000,
    pricePerWeek: 18000,
    pricePerMonth: 65000,
    available: true,
    bookingsCount: 18,
    rating: 4.8,
    dateAdded: '2024-02-20',
    bedrooms: 2,
    guestCapacity: 4
  },
  {
    id: '8',
    type: 'hotel',
    name: 'Mountain View Villa',
    propertyType: 'villa',
    city: 'Udaipur',
    location: 'Lake Pichola',
    pricePerDay: 5500,
    pricePerWeek: 35000,
    pricePerMonth: 120000,
    available: true,
    bookingsCount: 7,
    rating: 4.9,
    dateAdded: '2024-03-05',
    bedrooms: 3,
    guestCapacity: 6
  }
]

export function ProviderDashboard({ currentUser }: ProviderDashboardProps) {
  const [activeSection, setActiveSection] = useState<DashboardSection>('profile')
  const [services, setServices] = useLocalStorage<ServiceListing[]>('provider-services', mockServices)
  const [showAddForm, setShowAddForm] = useState<ServiceType | null>(null)

  const sidebarItems = [
    { id: 'profile' as const, label: 'Profile Settings', icon: Settings },
    { id: 'add-service' as const, label: 'Add New Service', icon: Add },
    { id: 'bookings' as const, label: 'Bookings Dashboard', icon: CalendarToday },
    { id: 'insights' as const, label: 'Insights', icon: TrendingUp },
  ]

  const serviceTypeCards = [
    { 
      type: 'bike' as const, 
      title: 'Add New Bike Service', 
      icon: TwoWheeler,
      description: 'Add bikes for rental'
    },
    { 
      type: 'car' as const, 
      title: 'Add New Car Service', 
      icon: DirectionsCar,
      description: 'Add cars for rental'
    },
    { 
      type: 'campervan' as const, 
      title: 'Add New Campervan Service', 
      icon: RvHookup,
      description: 'Add campervans for rental'
    },
    { 
      type: 'hotel' as const, 
      title: 'Add New Hotel Service', 
      icon: LocationOn,
      description: 'Add nomad hotels'
    }
  ]

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'bike': return TwoWheeler
      case 'car': return DirectionsCar
      case 'campervan': return RvHookup
      case 'hotel': return LocationOn
    }
  }

  const handleDeleteService = (serviceId: string) => {
    setServices(currentServices => 
      currentServices.filter(service => service.id !== serviceId)
    )
  }

  const renderContent = () => {
    if (showAddForm) {
      return (
        <AddServiceForm
          serviceType={showAddForm}
          currentUser={currentUser}
          onCancel={() => setShowAddForm(null)}
          onSave={(newService) => {
            setServices(currentServices => [...currentServices, newService])
            setShowAddForm(null)
          }}
        />
      )
    }

    switch (activeSection) {
      case 'profile':
        return <ProfileSettings currentUser={currentUser} />
      
      case 'add-service':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Add New Service
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Choose the type of service you want to add to your portfolio
            </Typography>

            {/* Service Type Cards */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {serviceTypeCards.map((card) => {
                const IconComponent = card.icon
                return (
                  <Grid size={{ xs: 6, sm: 3, md: 3 }} key={card.type}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '100%', // Ensure consistent height
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3
                        }
                      }}
                      onClick={() => setShowAddForm(card.type)}
                    >
                      <CardContent sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <IconComponent 
                          sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} 
                        />
                        <Typography variant="h6" component="h3" gutterBottom>
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>

            {/* Existing Services */}
            <Typography variant="h5" component="h3" gutterBottom>
              Your Services
            </Typography>
            {services.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', p: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No services added yet.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {services.map((service) => {
                  const IconComponent = getServiceIcon(service.type)
                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
                      <Card sx={{ height: '100%', position: 'relative' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconComponent sx={{ color: 'primary.main' }} />
                              <Chip 
                                label={service.type} 
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Box>
                            <Chip 
                              label={service.available ? "Available" : "Unavailable"}
                              color={service.available ? "success" : "default"}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="h6" component="h4" gutterBottom>
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {service.location ? `${service.location}, ${service.city}` : service.city}
                          </Typography>
                          {service.brand && service.model && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {service.brand} {service.model}
                            </Typography>
                          )}
                          {service.propertyType && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {service.propertyType} • {service.bedrooms} bed • {service.guestCapacity} guests
                            </Typography>
                          )}
                          {service.transmission && service.fuelType && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {service.transmission} • {service.fuelType} • {service.seatingCapacity} seats
                            </Typography>
                          )}

                          <Box sx={{ mb: 3 }}>
                            {service.pricePerHour && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Price per hour:</Typography>
                                <Typography variant="body2" fontWeight="bold">₹{service.pricePerHour}</Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Price per day:</Typography>
                              <Typography variant="body2" fontWeight="bold">₹{service.pricePerDay}</Typography>
                            </Box>
                            {service.pricePerWeek && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Price per week:</Typography>
                                <Typography variant="body2" fontWeight="bold">₹{service.pricePerWeek}</Typography>
                              </Box>
                            )}
                            {service.pricePerMonth && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Price per month:</Typography>
                                <Typography variant="body2" fontWeight="bold">₹{service.pricePerMonth}</Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Bookings:</Typography>
                              <Typography variant="body2">{service.bookingsCount}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Rating:</Typography>
                              <Typography variant="body2">{service.rating}/5</Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              variant="outlined" 
                              size="small" 
                              startIcon={<Edit />}
                              sx={{ flex: 1 }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outlined" 
                              size="small" 
                              startIcon={<Delete />}
                              color="error"
                              onClick={() => handleDeleteService(service.id)}
                              sx={{ flex: 1 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            )}
          </Box>
        )
      
      case 'bookings':
        return <BookingsDashboard currentUser={currentUser} />
      
      case 'insights':
        return <ProviderInsights currentUser={currentUser} services={services} />
      
      default:
        return <ProfileSettings currentUser={currentUser} />
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            position: 'relative',
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="h1" fontWeight="bold">
            Service Provider
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin Dashboard
          </Typography>
        </Box>

        <List sx={{ p: 2 }}>
          {sidebarItems.map((item) => {
            const IconComponent = item.icon
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={activeSection === item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setShowAddForm(null)
                  }}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ flexGrow: 1, p: 0 }}>
        {renderContent()}
      </Container>
    </Box>
  )
}