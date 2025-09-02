import React, { useState, useMemo } from 'react'
import { 
  Card, 
  CardContent,
  Typography,
  Box,
  Button,
  Container,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  AccountBalance,
  LocationOn,
  AccessTime,
  Group,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  BookOnline,
  FilterList,
  ExpandMore,
  Close,
  Check,
  ArrowBack,
  CalendarMonth,
  CurrencyRupee,
  Search
} from '@mui/icons-material'
import { BookingModal } from '../booking/BookingModal'
import { User } from '@/App'

interface PilgrimagePackage {
  id: string
  name: string
  location: string
  state: string
  duration: string
  price: number
  image: string
  rating: number
  reviewCount: number
  difficulty: string
  groupSize: string
  highlights: string[]
  temples: string[]
  packageType: string
  region: string
  features: string[]
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  requirements: string[]
}

interface ItineraryDay {
  day: number
  title: string
  description: string
  temples?: string[]
  activities: string[]
}

interface FilterState {
  priceRange: [number, number]
  difficulty: string[]
  region: string[]
  state: string[]
  duration: string[]
  packageType: string[]
  features: string[]
}

const pilgrimagePackages: PilgrimagePackage[] = [
  {
    id: '1',
    name: 'Char Dham Yatra',
    location: 'Uttarakhand',
    state: 'Uttarakhand',
    duration: '12 days',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 245,
    difficulty: 'Challenging',
    groupSize: '8-15 people',
    region: 'North India',
    packageType: 'Premium',
    temples: ['Kedarnath', 'Badrinath', 'Gangotri', 'Yamunotri'],
    highlights: [
      'Visit all four sacred dhams',
      'Helicopter service to Kedarnath',
      'Guided spiritual sessions',
      'High altitude mountain temples'
    ],
    features: ['Helicopter service', 'Guide included', 'Luxury accommodation', 'All meals'],
    inclusions: [
      'Accommodation in 3-4 star hotels',
      'All meals (breakfast, lunch, dinner)',
      'Transportation in AC vehicles',
      'All temple entry fees and special darshan',
      'Professional guide',
      'Helicopter service to Kedarnath',
      'Medical kit and oxygen cylinder'
    ],
    exclusions: [
      'Personal expenses',
      'Additional helicopter services',
      'Shopping expenses',
      'Tips and gratuities'
    ],
    requirements: [
      'Medical certificate required',
      'Good physical fitness',
      'Warm clothing essential',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Haridwar',
        description: 'Welcome to the holy city of Haridwar. Check-in and evening Ganga Aarti',
        temples: ['Har Ki Pauri'],
        activities: ['Hotel check-in', 'Ganga Aarti', 'Evening prayers']
      },
      {
        day: 2,
        title: 'Haridwar to Yamunotri',
        description: 'Drive to Janki Chatti, trek to Yamunotri temple',
        temples: ['Yamunotri Temple'],
        activities: ['Temple darshan', 'Hot springs visit']
      }
    ]
  },
  {
    id: '2',
    name: 'Vaishno Devi Darshan',
    location: 'Jammu & Kashmir',
    state: 'Jammu & Kashmir',
    duration: '3 days',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 189,
    difficulty: 'Moderate',
    groupSize: '6-12 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Vaishno Devi Temple'],
    highlights: [
      'Sacred cave temple visit',
      'Helicopter option available',
      'Blessed holy water',
      'Spiritual awakening journey'
    ],
    features: ['Guide included', 'Helicopter option', 'Standard accommodation'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple entry and darshan',
      'Local transportation',
      'Guide services'
    ],
    exclusions: [
      'Helicopter charges (optional)',
      'Personal expenses',
      'Additional services'
    ],
    requirements: [
      'Moderate fitness required',
      'Comfortable walking shoes',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jammu',
        description: 'Arrive and transfer to Katra base camp',
        activities: ['Hotel check-in', 'Rest and preparation']
      },
      {
        day: 2,
        title: 'Vaishno Devi Darshan',
        description: 'Trek to holy cave and darshan',
        temples: ['Vaishno Devi Temple'],
        activities: ['Temple trek', 'Holy darshan', 'Blessed water']
      }
    ]
  },
  {
    id: '3',
    name: 'Tirupati Balaji Express',
    location: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    duration: '4 days',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 356,
    difficulty: 'Easy',
    groupSize: '10-20 people',
    region: 'South India',
    packageType: 'Economy',
    temples: ['Tirupati Balaji Temple'],
    highlights: [
      'Lord Venkateswara darshan',
      'VIP darshan tickets',
      'Local temple visits',
      'Spiritual guidance'
    ],
    features: ['VIP darshan', 'Guide included', 'Budget accommodation'],
    inclusions: [
      'Accommodation',
      'VIP darshan tickets',
      'Local sightseeing',
      'Guide services'
    ],
    exclusions: [
      'Meals (optional)',
      'Personal expenses',
      'Additional temple visits'
    ],
    requirements: [
      'Easy accessibility',
      'No age restrictions',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Tirupati',
        description: 'Check-in and local temple visits',
        activities: ['Hotel check-in', 'Local temples']
      },
      {
        day: 2,
        title: 'Tirupati Balaji Darshan',
        description: 'Early morning VIP darshan',
        temples: ['Tirupati Balaji Temple'],
        activities: ['VIP darshan', 'Temple tour', 'Spiritual session']
      }
    ]
  },
  {
    id: '4',
    name: 'Golden Triangle Pilgrimage',
    location: 'Delhi-Agra-Mathura',
    state: 'Uttar Pradesh',
    duration: '6 days',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 167,
    difficulty: 'Easy',
    groupSize: '8-16 people',
    region: 'North India',
    packageType: 'Premium',
    temples: ['Krishna Janmabhoomi', 'Taj Mahal', 'Red Fort'],
    highlights: [
      'Krishna birthplace visit',
      'Historical monuments',
      'Cultural experiences',
      'Photography opportunities'
    ],
    features: ['Luxury accommodation', 'Guide included', 'All meals', 'AC transport'],
    inclusions: [
      'Luxury hotels',
      'All monument entries',
      'Professional guide',
      'AC transportation'
    ],
    exclusions: [
      'Personal shopping',
      'Extra activities',
      'Tips'
    ],
    requirements: [
      'Easy walking',
      'No age restrictions',
      'Camera allowed'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Delhi Arrival',
        description: 'Historical Delhi tour',
        activities: ['Red Fort', 'India Gate', 'Lotus Temple']
      },
      {
        day: 2,
        title: 'Delhi to Mathura',
        description: 'Krishna Janmabhoomi visit',
        temples: ['Krishna Janmabhoomi'],
        activities: ['Temple darshan', 'Yamuna aarti']
      }
    ]
  },
  {
    id: '5',
    name: 'Kashi Vishwanath Special',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    duration: '5 days',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 278,
    difficulty: 'Easy',
    groupSize: '6-14 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Kashi Vishwanath', 'Sankat Mochan', 'Durga Temple'],
    highlights: [
      'Ancient Shiva temple',
      'Ganga aarti ceremony',
      'Spiritual discourses',
      'Sacred city exploration'
    ],
    features: ['Guide included', 'Standard accommodation', 'Boat rides'],
    inclusions: [
      'Hotel accommodation',
      'Temple visits',
      'Ganga boat rides',
      'Guide services'
    ],
    exclusions: [
      'Personal expenses',
      'Additional ceremonies',
      'Shopping'
    ],
    requirements: [
      'Comfortable walking',
      'Respect for traditions',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Varanasi',
        description: 'Welcome to the spiritual capital',
        activities: ['Hotel check-in', 'Evening Ganga aarti']
      },
      {
        day: 2,
        title: 'Temple Circuit',
        description: 'Visit major temples',
        temples: ['Kashi Vishwanath', 'Sankat Mochan'],
        activities: ['Temple darshan', 'Spiritual discourse']
      }
    ]
  },
  {
    id: '6',
    name: 'Dwarka-Somnath Circuit',
    location: 'Gujarat',
    state: 'Gujarat',
    duration: '7 days',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 145,
    difficulty: 'Easy',
    groupSize: '8-18 people',
    region: 'West India',
    packageType: 'Standard',
    temples: ['Dwarkadhish Temple', 'Somnath Temple', 'Nageshwar Jyotirlinga'],
    highlights: [
      'Krishna city Dwarka',
      'Jyotirlinga darshan',
      'Coastal temple views',
      'Gujarat culture'
    ],
    features: ['Guide included', 'Standard accommodation', 'Coastal views'],
    inclusions: [
      'Accommodation',
      'Temple entries',
      'Local transportation',
      'Guide services'
    ],
    exclusions: [
      'Personal expenses',
      'Extra sightseeing',
      'Shopping'
    ],
    requirements: [
      'Easy accessibility',
      'No special requirements',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dwarka',
        description: 'Check-in and local exploration',
        activities: ['Hotel check-in', 'City tour']
      },
      {
        day: 2,
        title: 'Dwarkadhish Darshan',
        description: 'Lord Krishna temple visit',
        temples: ['Dwarkadhish Temple'],
        activities: ['Morning darshan', 'Temple tour']
      }
    ]
  }
]

interface PilgrimageToursProps {
  currentUser: User | null
}

// Detailed Tour Page Component
function TourDetailPage({ 
  tour, 
  currentUser, 
  onBack, 
  onBookNow 
}: { 
  tour: PilgrimagePackage
  currentUser: User | null
  onBack: () => void
  onBookNow: (tour: PilgrimagePackage) => void
}) {
  const [tabValue, setTabValue] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={onBack}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Tours
      </Button>

      {/* Hero Section */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <Box 
            sx={{ 
              width: '100%', 
              height: 400, 
              background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}
          >
            🏛️
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            display: 'flex',
            alignItems: 'end',
            p: 4
          }}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {tour.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn />
                  <Typography variant="h6">{tour.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth />
                  <Typography variant="h6">{tour.duration}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group />
                  <Typography variant="h6">{tour.groupSize}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating value={tour.rating} readOnly sx={{ color: 'white' }} />
                <Typography variant="body1">
                  {tour.rating} ({tour.reviewCount} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
            <IconButton
              sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
              onClick={() => toggleFavorite(tour.id)}
            >
              {favorites.includes(tour.id) ? 
                <Favorite color="error" /> : 
                <FavoriteBorder />
              }
            </IconButton>
            <IconButton
              sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
              onClick={() => navigator.share?.({ title: tour.name, url: window.location.href })}
            >
              <Share />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                  <Tab label="Overview" />
                  <Tab label="Itinerary" />
                  <Tab label="Inclusions" />
                  <Tab label="Requirements" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>Package Overview</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <CalendarMonth color="primary" sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6">{tour.duration}</Typography>
                      <Typography variant="body2" color="text.secondary">Duration</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Group color="primary" sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6">{tour.groupSize}</Typography>
                      <Typography variant="body2" color="text.secondary">Group Size</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="h6" color={
                        tour.difficulty === 'Easy' ? 'success.main' : 
                        tour.difficulty === 'Moderate' ? 'warning.main' : 'error.main'
                      }>
                        {tour.difficulty}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Difficulty</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Chip 
                        label={tour.packageType} 
                        color={tour.packageType === 'Premium' ? 'primary' : tour.packageType === 'Standard' ? 'default' : 'secondary'}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Package Type</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>Sacred Temples</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {tour.temples.map(temple => (
                      <Chip key={temple} label={temple} variant="outlined" color="primary" />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>Tour Highlights</Typography>
                  <Box sx={{ pl: 1 }}>
                    {tour.highlights.map((highlight, index) => (
                      <Typography key={index} variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Check color="primary" />
                        {highlight}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>Features Included</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tour.features.map(feature => (
                      <Chip key={feature} label={feature} color="secondary" />
                    ))}
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>Detailed Itinerary</Typography>
                {tour.itinerary.map((day, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Day {day.day}: {day.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {day.description}
                      </Typography>
                      {day.temples && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Temples to Visit:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {day.temples.map(temple => (
                              <Chip key={temple} label={temple} size="small" color="primary" />
                            ))}
                          </Box>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Activities:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          {day.activities.map((activity, actIndex) => (
                            <Typography key={actIndex} variant="body2" sx={{ display: 'list-item' }}>
                              {activity}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom color="success.main">
                      ✅ Included in Package
                    </Typography>
                    <Box sx={{ pl: 1 }}>
                      {tour.inclusions.map((inclusion, index) => (
                        <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          <Check fontSize="small" color="success" sx={{ mt: 0.2 }} />
                          {inclusion}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom color="error.main">
                      ❌ Not Included
                    </Typography>
                    <Box sx={{ pl: 1 }}>
                      {tour.exclusions.map((exclusion, index) => (
                        <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          <Close fontSize="small" color="error" sx={{ mt: 0.2 }} />
                          {exclusion}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>Requirements & Guidelines</Typography>
                <Box sx={{ pl: 1 }}>
                  {tour.requirements.map((requirement, index) => (
                    <Typography key={index} variant="body1" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <Check color="primary" sx={{ mt: 0.2 }} />
                      {requirement}
                    </Typography>
                  ))}
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>

        {/* Booking Sidebar */}
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{tour.price.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  per person • {tour.duration}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<BookOnline />}
                onClick={() => onBookNow(tour)}
                sx={{ mb: 2, py: 1.5 }}
              >
                Book Now - Pay Later
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                Free cancellation up to 24 hours before departure
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Quick Facts</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">State:</Typography>
                  <Typography variant="body2">{tour.state}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Region:</Typography>
                  <Typography variant="body2">{tour.region}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Rating:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star fontSize="small" color="warning" />
                    <Typography variant="body2">{tour.rating}/5</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Reviews:</Typography>
                  <Typography variant="body2">{tour.reviewCount} reviews</Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  🔒 Secure booking • 💯 Best price guarantee • 📞 24/7 support
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export function PilgrimageTours({ currentUser }: PilgrimageToursProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [10000, 100000],
    difficulty: [],
    region: [],
    state: [],
    duration: [],
    packageType: [],
    features: []
  })
  
  const [selectedTour, setSelectedTour] = useState<PilgrimagePackage | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})

  const handleSearchInFilter = (filterType: string, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const filteredPackages = useMemo(() => {
    return pilgrimagePackages.filter(pkg => {
      const matchesPrice = pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1]
      const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(pkg.difficulty)
      const matchesRegion = filters.region.length === 0 || filters.region.includes(pkg.region)
      const matchesState = filters.state.length === 0 || filters.state.includes(pkg.state)
      const matchesDuration = filters.duration.length === 0 || filters.duration.some(d => pkg.duration.includes(d))
      const matchesPackageType = filters.packageType.length === 0 || filters.packageType.includes(pkg.packageType)
      const matchesFeatures = filters.features.length === 0 || filters.features.every(f => pkg.features.includes(f))
      
      return matchesPrice && matchesDifficulty && matchesRegion && matchesState && matchesDuration && matchesPackageType && matchesFeatures
    })
  }, [filters])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const handleViewDetails = (pkg: PilgrimagePackage) => {
    setSelectedTour(pkg)
    setViewMode('detail')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedTour(null)
  }

  const handleBooking = (pkg: PilgrimagePackage) => {
    if (!currentUser) {
      alert('Please login to book a pilgrimage tour')
      return
    }
    setSelectedTour(pkg)
    setShowBookingModal(true)
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [10000, 100000],
      difficulty: [],
      region: [],
      state: [],
      duration: [],
      packageType: [],
      features: []
    })
  }

  // Show detail page if a tour is selected
  if (viewMode === 'detail' && selectedTour) {
    return (
      <>
        <TourDetailPage 
          tour={selectedTour} 
          currentUser={currentUser} 
          onBack={handleBackToList}
          onBookNow={handleBooking}
        />
        
        {/* Booking Modal */}
        {showBookingModal && selectedTour && (
          <BookingModal
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            bike={{
              id: selectedTour.id,
              name: selectedTour.name,
              type: 'pilgrimage',
              pricePerHour: selectedTour.price,
              pricePerDay: selectedTour.price,
              location: selectedTour.location,
              image: selectedTour.image,
              safetyDeposit: 5000,
            }}
            currentUser={currentUser}
          />
        )}
      </>
    )
  }

  // Main tours list view
  return (
    <Box className="flex min-h-screen bg-background">
      {/* Left Sidebar - 15% width */}
      <Paper 
        elevation={2}
        className="w-[15%] min-w-[280px] p-4 overflow-y-auto h-screen sticky top-0"
        sx={{ borderRadius: 0 }}
      >
        <Typography variant="h6" className="mb-4 font-semibold text-foreground">
          <FilterList className="inline mr-2" />
          Filters
        </Typography>

        {/* Price Range Filter */}
        <Box className="mb-4">
          <Typography variant="body2" className="mb-2 font-medium">
            Price Range (₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()})
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={(_, newValue) => updateFilter('priceRange', newValue)}
            min={10000}
            max={100000}
            step={5000}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
            size="small"
          />
        </Box>

        {/* State Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">🏛️ State</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              size="small"
              placeholder="Search states..."
              value={searchTerms.state || ''}
              onChange={(e) => handleSearchInFilter('state', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                )
              }}
              className="mb-2 w-full"
            />
            <Box className="max-h-32 overflow-y-auto">
              <FormGroup>
                {['Uttarakhand', 'Jammu & Kashmir', 'Andhra Pradesh', 'Uttar Pradesh', 'Gujarat']
                  .filter(state => 
                    !searchTerms.state || 
                    state.toLowerCase().includes(searchTerms.state.toLowerCase())
                  )
                  .map(state => (
                  <FormControlLabel
                    key={state}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.state.includes(state)}
                        onChange={(e) => {
                          const newState = e.target.checked
                            ? [...filters.state, state]
                            : filters.state.filter(s => s !== state)
                          updateFilter('state', newState)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{state}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Duration Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">📅 Duration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['3 days', '4 days', '5 days', '6 days', '7 days', '12 days'].map(duration => (
                <FormControlLabel
                  key={duration}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.duration.includes(duration)}
                      onChange={(e) => {
                        const newDuration = e.target.checked
                          ? [...filters.duration, duration]
                          : filters.duration.filter(d => d !== duration)
                        updateFilter('duration', newDuration)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{duration}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Difficulty Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">⛰️ Difficulty Level</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['Easy', 'Moderate', 'Challenging'].map(diff => (
                <FormControlLabel
                  key={diff}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.difficulty.includes(diff)}
                      onChange={(e) => {
                        const newDifficulty = e.target.checked
                          ? [...filters.difficulty, diff]
                          : filters.difficulty.filter(d => d !== diff)
                        updateFilter('difficulty', newDifficulty)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{diff}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Package Type Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">⭐ Package Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['Economy', 'Standard', 'Premium'].map(type => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.packageType.includes(type)}
                      onChange={(e) => {
                        const newType = e.target.checked
                          ? [...filters.packageType, type]
                          : filters.packageType.filter(t => t !== type)
                        updateFilter('packageType', newType)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{type}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Region Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">🗺️ Region</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['North India', 'South India', 'West India', 'East India'].map(region => (
                <FormControlLabel
                  key={region}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.region.includes(region)}
                      onChange={(e) => {
                        const newRegion = e.target.checked
                          ? [...filters.region, region]
                          : filters.region.filter(r => r !== region)
                        updateFilter('region', newRegion)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{region}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Features Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">🎯 Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              size="small"
              placeholder="Search features..."
              value={searchTerms.features || ''}
              onChange={(e) => handleSearchInFilter('features', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                )
              }}
              className="mb-2 w-full"
            />
            <Box className="max-h-32 overflow-y-auto">
              <FormGroup>
                {['Guide included', 'Helicopter service', 'Luxury accommodation', 'VIP darshan', 'All meals']
                  .filter(feature => 
                    !searchTerms.features || 
                    feature.toLowerCase().includes(searchTerms.features.toLowerCase())
                  )
                  .map(feature => (
                  <FormControlLabel
                    key={feature}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.features.includes(feature)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...filters.features, feature]
                            : filters.features.filter(f => f !== feature)
                          updateFilter('features', newFeatures)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{feature}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Main Content Area - 85% width */}
      <Box className="flex-1 p-6">
        {/* Top Bar with Results Count */}
        <Paper elevation={1} className="p-4 mb-6">
          <Box className="flex items-center justify-between">
            <Typography variant="h6" className="text-foreground">
              {filteredPackages.length} Pilgrimage Tours Available
            </Typography>
            <Button variant="outlined" size="small" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </Box>
        </Paper>
                </Typography>
                <Button size="small" onClick={clearAllFilters} variant="text">
                  Clear All
                </Button>
              </Box>

              {/* Price Range */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  💰 Price Range
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, value) => updateFilter('priceRange', value)}
                  valueLabelDisplay="auto"
                  min={10000}
                  max={100000}
                  step={5000}
                  valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">₹10K</Typography>
                  <Typography variant="caption">₹1L</Typography>
                </Box>
              </Box>

              {/* State Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🏛️ State
                </Typography>
                {['Uttarakhand', 'Jammu & Kashmir', 'Andhra Pradesh', 'Uttar Pradesh', 'Gujarat'].map(state => (
                  <FormControlLabel
                    key={state}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.state.includes(state)}
                        onChange={(e) => {
                          const newState = e.target.checked
                            ? [...filters.state, state]
                            : filters.state.filter(s => s !== state)
                          updateFilter('state', newState)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{state}</Typography>}
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>

              {/* Duration Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📅 Duration
                </Typography>
                {['3 days', '4 days', '5 days', '6 days', '7 days', '12 days'].map(duration => (
                  <FormControlLabel
                    key={duration}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.duration.includes(duration)}
                        onChange={(e) => {
                          const newDuration = e.target.checked
                            ? [...filters.duration, duration]
                            : filters.duration.filter(d => d !== duration)
                          updateFilter('duration', newDuration)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{duration}</Typography>}
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>

              {/* Difficulty Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ⛰️ Difficulty Level
                </Typography>
                {['Easy', 'Moderate', 'Challenging'].map(diff => (
                  <FormControlLabel
                    key={diff}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.difficulty.includes(diff)}
                        onChange={(e) => {
                          const newDifficulty = e.target.checked
                            ? [...filters.difficulty, diff]
                            : filters.difficulty.filter(d => d !== diff)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{diff}</Typography>}
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>

              {/* Package Type Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ⭐ Package Type
                </Typography>
                {['Economy', 'Standard', 'Premium'].map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.packageType.includes(type)}
                        onChange={(e) => {
                          const newType = e.target.checked
                            ? [...filters.packageType, type]
                            : filters.packageType.filter(t => t !== type)
                          updateFilter('packageType', newType)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{type}</Typography>}
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>

              {/* Region Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🗺️ Region
                </Typography>
                {['North India', 'South India', 'West India', 'East India'].map(region => (
                  <FormControlLabel
                    key={region}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.region.includes(region)}
                        onChange={(e) => {
                          const newRegion = e.target.checked
                            ? [...filters.region, region]
                            : filters.region.filter(r => r !== region)
                          updateFilter('region', newRegion)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{region}</Typography>}
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>

              {/* Features Filter */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🎯 Features
                </Typography>
                {['Guide included', 'Helicopter service', 'Luxury accommodation', 'VIP darshan', 'All meals'].map(feature => (
                  <FormControlLabel
                    key={feature}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.features.includes(feature)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...filters.features, feature]
                            : filters.features.filter(f => f !== feature)
                          updateFilter('features', newFeatures)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{feature}</Typography>}
                    sx={{ display: 'block', mb: 0.5 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content - Tours Grid */}
        <Box sx={{ flex: 1 }}>
          {filteredPackages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AccountBalance sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tours match your filters
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters to see more options
              </Typography>
              <Button variant="outlined" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
              {filteredPackages.map(pkg => (
                <Card key={pkg.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 200, 
                        background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px'
                      }}
                    >
                      🏛️
                    </Box>
                    <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                      <Chip 
                        label={pkg.packageType} 
                        size="small" 
                        color={pkg.packageType === 'Premium' ? 'primary' : pkg.packageType === 'Standard' ? 'default' : 'secondary'}
                      />
                    </Box>
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                        onClick={() => toggleFavorite(pkg.id)}
                      >
                        {favorites.includes(pkg.id) ? 
                          <Favorite color="error" /> : 
                          <FavoriteBorder />
                        }
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {pkg.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {pkg.state}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {pkg.duration}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={pkg.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {pkg.rating} ({pkg.reviewCount})
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2, flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Sacred Temples:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {pkg.temples.slice(0, 2).map(temple => (
                          <Chip key={temple} label={temple} size="small" variant="outlined" />
                        ))}
                        {pkg.temples.length > 2 && (
                          <Chip label={`+${pkg.temples.length - 2} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                          ₹{pkg.price.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per person
                        </Typography>
                      </Box>
                      <Chip 
                        label={pkg.difficulty} 
                        size="small" 
                        color={pkg.difficulty === 'Easy' ? 'success' : pkg.difficulty === 'Moderate' ? 'warning' : 'error'}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleViewDetails(pkg)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<BookOnline />}
                        onClick={() => handleBooking(pkg)}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Booking Modal */}
      {showBookingModal && selectedTour && (
        <BookingModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          bike={{
            id: selectedTour.id,
            name: selectedTour.name,
            type: 'pilgrimage',
            pricePerHour: selectedTour.price,
            pricePerDay: selectedTour.price,
            location: selectedTour.location,
            image: selectedTour.image,
            safetyDeposit: 5000,
          }}
          currentUser={currentUser}
        />
      )}
    </Container>
  )
}
