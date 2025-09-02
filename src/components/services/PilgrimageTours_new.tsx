import React, { useState, useMemo } from 'react'
import { 
  Card, 
  CardContent,
  Typography,
  Box,
  Button,
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
  FormGroup
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
  region: string
  packageType: string
  temples: string[]
  highlights: string[]
  features: string[]
  inclusions: string[]
  exclusions: string[]
  requirements: string[]
  itinerary: {
    day: number
    title: string
    description: string
    temples?: string[]
    activities?: string[]
  }[]
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

interface PilgrimageToursProps {
  currentUser: User | null
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
        activities: ['Hotel check-in', 'Preparation for trek']
      }
    ]
  },
  {
    id: '3',
    name: 'Tirupati Darshan',
    location: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    duration: '3 days',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 512,
    difficulty: 'Easy',
    groupSize: '10-20 people',
    region: 'South India',
    packageType: 'Premium',
    temples: ['Tirumala Temple', 'Kapila Theertham', 'Akasha Ganga'],
    highlights: [
      'VIP darshan arrangements',
      'Richest temple in the world',
      'Divine blessings of Lord Venkateswara',
      'Sacred prasadam'
    ],
    features: ['VIP darshan', 'Luxury accommodation', 'All meals'],
    inclusions: [
      'VIP darshan tickets',
      'Accommodation in luxury hotel',
      'All meals',
      'AC transportation',
      'Temple guide'
    ],
    exclusions: [
      'Personal shopping',
      'Additional temple visits',
      'Travel insurance'
    ],
    requirements: [
      'Valid ID proof',
      'Modest dress code',
      'No specific fitness required'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Tirupati',
        description: 'Arrive and check-in, visit local temples',
        activities: ['Hotel check-in', 'Local temple visits']
      }
    ]
  },
  {
    id: '4',
    name: 'Mathura Vrindavan Yatra',
    location: 'Uttar Pradesh',
    state: 'Uttar Pradesh',
    duration: '4 days',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 287,
    difficulty: 'Easy',
    groupSize: '12-25 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Krishna Janmabhoomi', 'Banke Bihari', 'ISKCON Temple'],
    highlights: [
      'Krishna\'s birthplace visit',
      'Vrindavan divine experiences',
      'Spiritual discourses',
      'Cultural programs'
    ],
    features: ['Guide included', 'Cultural programs', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Cultural programs',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional activities'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable walking shoes',
      'Devotional mindset'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Mathura',
        description: 'Visit Krishna Janmabhoomi and other temples',
        activities: ['Temple visits', 'Evening aarti']
      }
    ]
  },
  {
    id: '5',
    name: 'Kashi Vishwanath Darshan',
    location: 'Uttar Pradesh',
    state: 'Uttar Pradesh',
    duration: '4 days',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 198,
    difficulty: 'Easy',
    groupSize: '10-18 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Kashi Vishwanath', 'Annapurna Temple', 'Sankat Mochan'],
    highlights: [
      'Ancient Kashi Vishwanath temple',
      'Ganga aarti experience',
      'Boat ride on sacred Ganges',
      'Spiritual city exploration'
    ],
    features: ['Guide included', 'Boat rides', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple darshan',
      'Boat rides',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional boat rides'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable walking',
      'Modest clothing'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Varanasi',
        description: 'Check-in and evening Ganga aarti',
        activities: ['Hotel check-in', 'Ganga aarti']
      }
    ]
  },
  {
    id: '6',
    name: 'Dwarka Somnath Yatra',
    location: 'Gujarat',
    state: 'Gujarat',
    duration: '5 days',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 156,
    difficulty: 'Easy',
    groupSize: '8-16 people',
    region: 'West India',
    packageType: 'Standard',
    temples: ['Dwarkadhish Temple', 'Somnath Temple', 'Nageshwar Jyotirlinga'],
    highlights: [
      'Krishna\'s ancient kingdom',
      'First Jyotirlinga darshan',
      'Coastal temple experience',
      'Historical significance'
    ],
    features: ['Guide included', 'All meals', 'Cultural tours'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'AC transportation',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Additional sightseeing',
      'Travel insurance'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable clothing',
      'Walking shoes'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dwarka',
        description: 'Visit Dwarkadhish temple and coastal areas',
        activities: ['Temple darshan', 'Coastal visit']
      }
    ]
  }
]

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
      const matchesFeatures = filters.features.length === 0 || filters.features.some(f => pkg.features.includes(f))

      return matchesPrice && matchesDifficulty && matchesRegion && matchesState && 
             matchesDuration && matchesPackageType && matchesFeatures
    })
  }, [filters])

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
    setSearchTerms({})
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const handleViewDetails = (pkg: PilgrimagePackage) => {
    setSelectedTour(pkg)
    setViewMode('detail')
  }

  const handleBooking = (pkg: PilgrimagePackage) => {
    setSelectedTour(pkg)
    setShowBookingModal(true)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedTour(null)
  }

  // Tour Detail Page Component
  const TourDetailPage = ({ tour }: { tour: PilgrimagePackage }) => {
    const [activeTab, setActiveTab] = useState(0)
    
    return (
      <Box>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBackToList}
            variant="outlined"
          >
            Back to Tours
          </Button>
        </Box>

        {/* Hero Section */}
        <Card sx={{ mb: 4 }}>
          <Box sx={{ position: 'relative', height: 300 }}>
            <Box
              component="img"
              src={tour.image}
              alt={tour.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling.style.display = 'flex'
              }}
            />
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}
            >
              🏛️
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
                p: 3
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {tour.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn />
                  <Typography>{tour.state}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime />
                  <Typography>{tour.duration}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Group />
                  <Typography>{tour.groupSize}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
                <Tab label="Overview" />
                <Tab label="Itinerary" />
                <Tab label="Inclusions" />
                <Tab label="Requirements" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>About This Tour</Typography>
                <Typography paragraph>{tour.highlights.join('. ')}</Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Temples & Sacred Sites</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {tour.temples.map(temple => (
                    <Chip key={temple} label={temple} variant="outlined" />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>Features</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tour.features.map(feature => (
                    <Chip key={feature} label={feature} color="primary" size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>Day-wise Itinerary</Typography>
                {tour.itinerary.map(day => (
                  <Accordion key={day.day} defaultExpanded={day.day === 1}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6">Day {day.day}: {day.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography paragraph>{day.description}</Typography>
                      {day.activities && (
                        <>
                          <Typography variant="subtitle2" gutterBottom>Activities:</Typography>
                          <ul>
                            {day.activities.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>What's Included</Typography>
                <Box sx={{ mb: 3 }}>
                  {tour.inclusions.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Check color="success" sx={{ mr: 1 }} />
                      <Typography>{item}</Typography>
                    </Box>
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>What's Not Included</Typography>
                <Box>
                  {tour.exclusions.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Close color="error" sx={{ mr: 1 }} />
                      <Typography>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>Requirements & Guidelines</Typography>
                {tour.requirements.map((req, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>{req}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Booking Sidebar */}
          <Box sx={{ width: 300 }}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    ₹{tour.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per person
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={tour.rating} readOnly size="small" />
                  <Typography variant="body2">
                    {tour.rating} ({tour.reviewCount} reviews)
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Duration: {tour.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Group Size: {tour.groupSize}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Difficulty: <Chip 
                      label={tour.difficulty} 
                      size="small" 
                      color={tour.difficulty === 'Easy' ? 'success' : tour.difficulty === 'Moderate' ? 'warning' : 'error'}
                    />
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CalendarMonth />}
                  onClick={() => handleBooking(tour)}
                  sx={{ mb: 2 }}
                >
                  Book Now
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={favorites.includes(tour.id) ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => toggleFavorite(tour.id)}
                  sx={{ mb: 1 }}
                >
                  {favorites.includes(tour.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  startIcon={<Share />}
                >
                  Share Tour
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    )
  }

  // Show detail view
  if (viewMode === 'detail' && selectedTour) {
    return (
      <Box className="p-6">
        <TourDetailPage tour={selectedTour} />
        {showBookingModal && selectedTour && (
          <BookingModal
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            service={{
              id: selectedTour.id,
              name: selectedTour.name,
              type: 'pilgrimage',
              price: selectedTour.price,
              duration: selectedTour.duration,
              location: selectedTour.location,
              provider: 'Sacred Journeys',
              rating: selectedTour.rating,
              image: selectedTour.image,
              availability: 'Available',
              pickupLocation: selectedTour.location,
              features: selectedTour.features,
              pricePerHour: selectedTour.price / 24,
              pricePerDay: selectedTour.price,
              pricePerWeek: selectedTour.price * 6,
              pricePerMonth: selectedTour.price * 20,
              model: 'Pilgrimage Package',
              year: 2024,
              transmission: 'Guided',
              fuelType: 'Spiritual',
              safetyDeposit: 5000,
            }}
            currentUser={currentUser}
          />
        )}
      </Box>
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

        {/* Tours Grid */}
        {filteredPackages.length === 0 ? (
          <Box className="text-center py-8">
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
                    component="img"
                    src={pkg.image}
                    alt={pkg.name}
                    sx={{ 
                      width: '100%', 
                      height: 200, 
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 200, 
                      background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
                      display: 'none',
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
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
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

      {/* Booking Modal */}
      {showBookingModal && selectedTour && (
        <BookingModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          service={{
            id: selectedTour.id,
            name: selectedTour.name,
            type: 'pilgrimage',
            price: selectedTour.price,
            duration: selectedTour.duration,
            location: selectedTour.location,
            provider: 'Sacred Journeys',
            rating: selectedTour.rating,
            image: selectedTour.image,
            availability: 'Available',
            pickupLocation: selectedTour.location,
            features: selectedTour.features,
            pricePerHour: selectedTour.price / 24,
            pricePerDay: selectedTour.price,
            pricePerWeek: selectedTour.price * 6,
            pricePerMonth: selectedTour.price * 20,
            model: 'Pilgrimage Package',
            year: 2024,
            transmission: 'Guided',
            fuelType: 'Spiritual',
            safetyDeposit: 5000,
          }}
          currentUser={currentUser}
        />
      )}
    </Box>
  )
}
