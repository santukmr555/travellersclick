import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  Rating,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Alert,
  CircularProgress,
  CardMedia,
  Container,
  IconButton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab
} from '@mui/material'
import {
  LocationOn,
  Star as StarIcon,
  ArrowBack,
  Search,
  FilterList,
  Phone,
  Email,
  Wifi,
  Restaurant,
  LocalParking,
  AcUnit,
  FitnessCenter,
  Pool,
  Spa,
  RoomService,
  LocalLaundryService,
  BusinessCenter,
  NavigateNext,
  Home,
  TempleHindu,
  Hotel
} from '@mui/icons-material'
import { BookingModal } from '@/components/booking/BookingModal'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface User {
  id: string
  email: string
  name: string
  role: 'traveller' | 'provider' | 'admin'
  isVerified: boolean
}

interface Temple {
  id: string
  name: string
  state: string
  city: string
  description: string
  significance: string
  bestTimeToVisit: string
  festivals: string[]
  image: string
}

interface Hotel {
  id: string
  name: string
  temple: string
  state: string
  rating: number
  reviews: number
  price: number
  originalPrice?: number
  images: string[]
  amenities: string[]
  address: string
  distance: string
  hotelType: 'budget' | 'mid-range' | 'luxury' | 'heritage'
  description: string
  contact: {
    phone: string
    email: string
  }
  policies: {
    checkin: string
    checkout: string
    cancellation: string
  }
  features: string[]
  nearbyAttractions: string[]
  isAvailable: boolean
  discount?: number
}

interface PilgrimHotelsProps {
  currentUser: User | null
}

const statesWithTemples = {
  'Uttar Pradesh': [
    {
      id: 'varanasi-kashi',
      name: 'Kashi Vishwanath Temple',
      state: 'Uttar Pradesh',
      city: 'Varanasi',
      description: 'One of the most sacred Hindu temples dedicated to Lord Shiva',
      significance: 'One of the 12 Jyotirlingas, most sacred pilgrimage site',
      bestTimeToVisit: 'October to March',
      festivals: ['Maha Shivratri', 'Dev Deepavali', 'Kartik Purnima'],
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&h=300&fit=crop'
    },
    {
      id: 'ayodhya-ram',
      name: 'Ram Janmabhoomi Temple',
      state: 'Uttar Pradesh',
      city: 'Ayodhya',
      description: 'The birthplace of Lord Rama, newly constructed grand temple',
      significance: 'Birthplace of Lord Rama, one of the most important pilgrimage sites',
      bestTimeToVisit: 'October to March',
      festivals: ['Ram Navami', 'Diwali', 'Vivah Panchami'],
      image: 'https://images.unsplash.com/photo-1582583792524-62b43dd0c5e9?w=500&h=300&fit=crop'
    },
    {
      id: 'vrindavan-krishna',
      name: 'Banke Bihari Temple',
      state: 'Uttar Pradesh',
      city: 'Vrindavan',
      description: 'Famous Krishna temple in the holy city of Vrindavan',
      significance: 'Sacred to Lord Krishna, part of Braj Bhoomi',
      bestTimeToVisit: 'October to March',
      festivals: ['Janmashtami', 'Holi', 'Radhashtami'],
      image: 'https://images.unsplash.com/photo-1589375411203-4feebb6db5a7?w=500&h=300&fit=crop'
    }
  ],
  'Rajasthan': [
    {
      id: 'pushkar-brahma',
      name: 'Brahma Temple',
      state: 'Rajasthan',
      city: 'Pushkar',
      description: 'One of the rare temples dedicated to Lord Brahma',
      significance: 'One of the very few temples dedicated to Lord Brahma in the world',
      bestTimeToVisit: 'November to March',
      festivals: ['Kartik Purnima', 'Pushkar Fair'],
      image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=500&h=300&fit=crop'
    },
    {
      id: 'nathdwara-srinathji',
      name: 'Srinathji Temple',
      state: 'Rajasthan',
      city: 'Nathdwara',
      description: 'Famous Krishna temple in the form of Srinathji',
      significance: 'Important Vaishnavite pilgrimage site',
      bestTimeToVisit: 'October to March',
      festivals: ['Janmashtami', 'Annakut', 'Holi'],
      image: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=500&h=300&fit=crop'
    }
  ],
  'Maharashtra': [
    {
      id: 'shirdi-sai',
      name: 'Sai Baba Temple',
      state: 'Maharashtra',
      city: 'Shirdi',
      description: 'Sacred temple of Sai Baba, visited by millions annually',
      significance: 'Sacred abode of Sai Baba, attracts devotees from all religions',
      bestTimeToVisit: 'October to March',
      festivals: ['Ram Navami', 'Guru Purnima', 'Vijayadashami'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'
    },
    {
      id: 'pandharpur-vitthal',
      name: 'Vitthal Temple',
      state: 'Maharashtra',
      city: 'Pandharpur',
      description: 'Famous Vitthal temple, center of Varkari tradition',
      significance: 'Most important pilgrimage site for Varkari sect',
      bestTimeToVisit: 'June to March',
      festivals: ['Ashadhi Ekadashi', 'Kartiki Ekadashi'],
      image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=500&h=300&fit=crop'
    }
  ],
  'Tamil Nadu': [
    {
      id: 'madurai-meenakshi',
      name: 'Meenakshi Amman Temple',
      state: 'Tamil Nadu',
      city: 'Madurai',
      description: 'Historic temple complex dedicated to Goddess Meenakshi and Lord Sundareswarar',
      significance: 'One of the most important temples in South India',
      bestTimeToVisit: 'October to March',
      festivals: ['Meenakshi Tirukalyanam', 'Navarathri', 'Thai Festival'],
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&h=300&fit=crop'
    },
    {
      id: 'tirupati-venkateswara',
      name: 'Tirumala Venkateswara Temple',
      state: 'Tamil Nadu',
      city: 'Tirupati',
      description: 'Most visited and richest temple in the world',
      significance: 'Abode of Lord Venkateswara, receives highest donations globally',
      bestTimeToVisit: 'September to March',
      festivals: ['Brahmotsavam', 'Vaikunta Ekadashi', 'Rathasapthami'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'
    }
  ],
  'Kerala': [
    {
      id: 'sabarimala-ayyappa',
      name: 'Sabarimala Ayyappa Temple',
      state: 'Kerala',
      city: 'Sabarimala',
      description: 'Famous temple of Lord Ayyappa in the Western Ghats',
      significance: 'One of the most visited pilgrimage sites in India',
      bestTimeToVisit: 'November to January (pilgrimage season)',
      festivals: ['Mandalam-Makaravilakku season'],
      image: 'https://images.unsplash.com/photo-1570198308999-772b2d6fc9e6?w=500&h=300&fit=crop'
    }
  ]
}

const hotelsByTemple: Record<string, Hotel[]> = {
  'varanasi-kashi': [
    {
      id: 'taj-ganges',
      name: 'Taj Ganges, Varanasi',
      temple: 'Kashi Vishwanath Temple',
      state: 'Uttar Pradesh',
      rating: 4.5,
      reviews: 1250,
      price: 8500,
      originalPrice: 12000,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Room Service', 'Spa', 'Business Center'],
      address: 'Nadesar Palace Grounds, Varanasi, Uttar Pradesh 221002',
      distance: '2.5 km from Kashi Vishwanath Temple',
      hotelType: 'luxury',
      description: 'Luxury heritage hotel with world-class amenities and traditional Indian hospitality.',
      contact: {
        phone: '+91-542-6618000',
        email: 'reservations.tajganges@tajhotels.com'
      },
      policies: {
        checkin: '3:00 PM',
        checkout: '12:00 PM',
        cancellation: 'Free cancellation until 24 hours before check-in'
      },
      features: ['Heritage Property', 'River View', 'Cultural Programs', '24/7 Concierge'],
      nearbyAttractions: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat', 'Sarnath'],
      isAvailable: true,
      discount: 30
    },
    {
      id: 'brijrama-palace',
      name: 'Brijrama Palace',
      temple: 'Kashi Vishwanath Temple',
      state: 'Uttar Pradesh',
      rating: 4.2,
      reviews: 890,
      price: 6500,
      originalPrice: 8500,
      images: [
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Room Service', 'Laundry'],
      address: 'Darbhanga Ghat, Varanasi, Uttar Pradesh 221001',
      distance: '1.8 km from Kashi Vishwanath Temple',
      hotelType: 'heritage',
      description: 'Restored 18th-century palace hotel on the banks of River Ganges.',
      contact: {
        phone: '+91-542-2500002',
        email: 'info@brijramapalace.com'
      },
      policies: {
        checkin: '2:00 PM',
        checkout: '11:00 AM',
        cancellation: 'Free cancellation until 48 hours before check-in'
      },
      features: ['Palace Hotel', 'Ganga View', 'Heritage Architecture', 'Boat Rides'],
      nearbyAttractions: ['Kashi Vishwanath Temple', 'Manikarnika Ghat', 'Assi Ghat'],
      isAvailable: true,
      discount: 24
    },
    {
      id: 'hotel-surya',
      name: 'Hotel Surya',
      temple: 'Kashi Vishwanath Temple',
      state: 'Uttar Pradesh',
      rating: 3.8,
      reviews: 1520,
      price: 3500,
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Room Service'],
      address: 'The Mall, Varanasi, Uttar Pradesh 221002',
      distance: '3.2 km from Kashi Vishwanath Temple',
      hotelType: 'mid-range',
      description: 'Comfortable mid-range hotel with modern amenities and convenient location.',
      contact: {
        phone: '+91-542-2502580',
        email: 'info@hotelsurya.com'
      },
      policies: {
        checkin: '2:00 PM',
        checkout: '12:00 PM',
        cancellation: 'Free cancellation until 24 hours before check-in'
      },
      features: ['Modern Rooms', 'City Center Location', 'Travel Desk', 'Airport Transfer'],
      nearbyAttractions: ['Kashi Vishwanath Temple', 'BHU Campus', 'Ramnagar Fort'],
      isAvailable: true
    }
  ],
  'ayodhya-ram': [
    {
      id: 'raghunath-palace',
      name: 'Raghunath Palace Heritage Hotel',
      temple: 'Ram Janmabhoomi Temple',
      state: 'Uttar Pradesh',
      rating: 4.3,
      reviews: 680,
      price: 5500,
      originalPrice: 7500,
      images: [
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Room Service', 'Business Center'],
      address: 'Ram Path, Ayodhya, Uttar Pradesh 224123',
      distance: '1.5 km from Ram Janmabhoomi Temple',
      hotelType: 'heritage',
      description: 'Heritage hotel celebrating the legacy of Ayodhya with traditional architecture.',
      contact: {
        phone: '+91-5278-223456',
        email: 'info@raghunathpalace.com'
      },
      policies: {
        checkin: '2:00 PM',
        checkout: '12:00 PM',
        cancellation: 'Free cancellation until 24 hours before check-in'
      },
      features: ['Heritage Property', 'Traditional Decor', 'Pilgrimage Packages', 'Cultural Shows'],
      nearbyAttractions: ['Ram Janmabhoomi Temple', 'Hanuman Garhi', 'Kanak Bhavan'],
      isAvailable: true,
      discount: 27
    }
  ],
  'shirdi-sai': [
    {
      id: 'sai-sahavas',
      name: 'Hotel Sai Sahavas',
      temple: 'Sai Baba Temple',
      state: 'Maharashtra',
      rating: 4.4,
      reviews: 2100,
      price: 4500,
      originalPrice: 6000,
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Room Service', 'Laundry'],
      address: 'Nagar Manmad Road, Shirdi, Maharashtra 423109',
      distance: '500m from Sai Baba Temple',
      hotelType: 'mid-range',
      description: 'Comfortable hotel close to Sai Baba temple with pilgrimage-focused services.',
      contact: {
        phone: '+91-2423-242200',
        email: 'info@saisahavas.com'
      },
      policies: {
        checkin: '2:00 PM',
        checkout: '11:00 AM',
        cancellation: 'Free cancellation until 24 hours before check-in'
      },
      features: ['Temple Proximity', 'Pilgrimage Services', 'Vegetarian Restaurant', 'Darshan Booking'],
      nearbyAttractions: ['Sai Baba Temple', 'Dwarkamai', 'Chavadi'],
      isAvailable: true,
      discount: 25
    },
    {
      id: 'sai-palace',
      name: 'Sai Palace Hotel',
      temple: 'Sai Baba Temple',
      state: 'Maharashtra',
      rating: 4.0,
      reviews: 1580,
      price: 3200,
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Room Service'],
      address: 'Kopargaon Road, Shirdi, Maharashtra 423109',
      distance: '800m from Sai Baba Temple',
      hotelType: 'mid-range',
      description: 'Well-appointed hotel offering comfortable stay for devotees visiting Shirdi.',
      contact: {
        phone: '+91-2423-241234',
        email: 'reservations@saipalace.com'
      },
      policies: {
        checkin: '2:00 PM',
        checkout: '12:00 PM',
        cancellation: 'Free cancellation until 24 hours before check-in'
      },
      features: ['Devotee Services', 'Meditation Hall', 'Pure Vegetarian Food', 'Temple Shuttle'],
      nearbyAttractions: ['Sai Baba Temple', 'Shani Shingnapur', 'Wet N Joy Water Park'],
      isAvailable: true
    }
  ],
  'madurai-meenakshi': [
    {
      id: 'heritage-madurai',
      name: 'Heritage Madurai',
      temple: 'Meenakshi Amman Temple',
      state: 'Tamil Nadu',
      rating: 4.6,
      reviews: 1980,
      price: 7200,
      originalPrice: 9500,
      images: [
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Pool', 'Spa', 'Fitness Center'],
      address: 'Melur Main Road, Madurai, Tamil Nadu 625104',
      distance: '12 km from Meenakshi Amman Temple',
      hotelType: 'luxury',
      description: 'Luxury resort-style hotel with traditional Tamil architecture and modern amenities.',
      contact: {
        phone: '+91-452-253-8500',
        email: 'reservations@heritagemadurai.com'
      },
      policies: {
        checkin: '3:00 PM',
        checkout: '12:00 PM',
        cancellation: 'Free cancellation until 48 hours before check-in'
      },
      features: ['Resort Style', 'Traditional Architecture', 'Cultural Programs', 'Temple Tours'],
      nearbyAttractions: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace', 'Gandhi Museum'],
      isAvailable: true,
      discount: 24
    },
    {
      id: 'grt-regency',
      name: 'GRT Regency Madurai',
      temple: 'Meenakshi Amman Temple',
      state: 'Tamil Nadu',
      rating: 4.1,
      reviews: 1340,
      price: 4800,
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop'
      ],
      amenities: ['WiFi', 'Restaurant', 'Parking', 'AC', 'Room Service', 'Business Center'],
      address: 'West Veli Street, Madurai, Tamil Nadu 625001',
      distance: '2 km from Meenakshi Amman Temple',
      hotelType: 'mid-range',
      description: 'Centrally located hotel with easy access to Meenakshi Temple and city attractions.',
      contact: {
        phone: '+91-452-4385555',
        email: 'madurai@grthotels.com'
      },
      policies: {
        checkin: '2:00 PM',
        checkout: '12:00 PM',
        cancellation: 'Free cancellation until 24 hours before check-in'
      },
      features: ['Central Location', 'Temple Proximity', 'Business Facilities', 'Multi-cuisine Restaurant'],
      nearbyAttractions: ['Meenakshi Amman Temple', 'Koodal Azhagar Temple', 'Vandiyur Mariamman Teppakulam'],
      isAvailable: true
    }
  ]
}

const amenityIcons = {
  'WiFi': <Wifi />,
  'Restaurant': <Restaurant />,
  'Parking': <LocalParking />,
  'AC': <AcUnit />,
  'Fitness Center': <FitnessCenter />,
  'Pool': <Pool />,
  'Spa': <Spa />,
  'Room Service': <RoomService />,
  'Laundry': <LocalLaundryService />,
  'Business Center': <BusinessCenter />
}

export function PilgrimHotels({ currentUser }: PilgrimHotelsProps) {
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 15000])
  const [selectedHotelType, setSelectedHotelType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('price-low')
  const [showBooking, setShowBooking] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [step, setStep] = useState<'state' | 'temple' | 'hotels'>('state')

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    setStep('temple')
  }

  const handleTempleSelect = (temple: Temple) => {
    setSelectedTemple(temple)
    setLoading(true)
    
    setTimeout(() => {
      const templeHotels = hotelsByTemple[temple.id] || []
      setHotels(templeHotels)
      setFilteredHotels(templeHotels)
      setLoading(false)
      setStep('hotels')
    }, 800)
  }

  const handleBack = () => {
    if (step === 'hotels') {
      setStep('temple')
      setHotels([])
      setFilteredHotels([])
    } else if (step === 'temple') {
      setStep('state')
      setSelectedState('')
    }
  }

  const resetToStart = () => {
    setStep('state')
    setSelectedState('')
    setSelectedTemple(null)
    setHotels([])
    setFilteredHotels([])
  }

  useEffect(() => {
    if (hotels.length === 0) return

    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
      const matchesType = selectedHotelType === 'all' || hotel.hotelType === selectedHotelType
      
      return matchesSearch && matchesPrice && matchesType
    })

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance)
        default:
          return 0
      }
    })

    setFilteredHotels(filtered)
  }, [hotels, searchQuery, priceRange, selectedHotelType, sortBy])

  const handleBooking = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setShowBooking(true)
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Finding hotels near {selectedTemple?.name}...
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Pilgrim Hotels
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Find comfortable accommodation near sacred temples across India
        </Typography>

        {/* Breadcrumb Navigation */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
          <Link 
            component="button" 
            variant="body1" 
            onClick={resetToStart}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}
          >
            <Home fontSize="small" />
            Select State
          </Link>
          {selectedState && (
            <Link 
              component="button" 
              variant="body1" 
              onClick={() => setStep('temple')}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}
            >
              <TempleHindu fontSize="small" />
              {selectedState}
            </Link>
          )}
          {selectedTemple && (
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
              <Hotel fontSize="small" />
              {selectedTemple.name}
            </Typography>
          )}
        </Breadcrumbs>
      </Box>

      {/* Step 1: State Selection */}
      {step === 'state' && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Step 1: Select Your State
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Object.keys(statesWithTemples).map((state) => (
              <Card 
                key={state}
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: 3 
                  } 
                }}
                onClick={() => handleStateSelect(state)}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <LocationOn color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {statesWithTemples[state as keyof typeof statesWithTemples].length} Sacred Temples
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Step 2: Temple Selection */}
      {step === 'temple' && selectedState && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Step 2: Choose Temple in {selectedState}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {statesWithTemples[selectedState as keyof typeof statesWithTemples]?.map((temple) => (
              <Card 
                key={temple.id}
                sx={{ 
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: 3 
                  } 
                }}
                onClick={() => handleTempleSelect(temple)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={temple.image}
                  alt={temple.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {temple.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {temple.city}, {temple.state}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {temple.description}
                  </Typography>
                  <Chip 
                    label={`Best time: ${temple.bestTimeToVisit}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Step 3: Hotel Listings */}
      {step === 'hotels' && selectedTemple && (
        <Box>
          {/* Header with Back Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Hotels near {selectedTemple.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredHotels.length} hotels available in {selectedTemple.city}
              </Typography>
            </Box>
          </Box>

          {/* Filters and Search */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 3, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Hotel Type</InputLabel>
                <Select
                  value={selectedHotelType}
                  label="Hotel Type"
                  onChange={(e) => setSelectedHotelType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="budget">Budget</MenuItem>
                  <MenuItem value="mid-range">Mid-range</MenuItem>
                  <MenuItem value="luxury">Luxury</MenuItem>
                  <MenuItem value="heritage">Heritage</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="distance">Distance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Hotel Results */}
          {filteredHotels.length === 0 ? (
            <Alert severity="info" sx={{ mt: 3 }}>
              No hotels found matching your criteria. Try adjusting your filters.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} sx={{ display: 'flex', height: 300 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 300, flexShrink: 0 }}
                      image={hotel.images[0]}
                      alt={hotel.name}
                    />
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {hotel.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Rating value={hotel.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary">
                              ({hotel.reviews} reviews)
                            </Typography>
                            <Chip 
                              label={hotel.hotelType} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <LocationOn fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                            {hotel.distance}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            {hotel.description}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right', ml: 2 }}>
                          {hotel.originalPrice && (
                            <Typography 
                              variant="body2" 
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              ₹{hotel.originalPrice.toLocaleString()}
                            </Typography>
                          )}
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            ₹{hotel.price.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            per night
                          </Typography>
                          {hotel.discount && (
                            <Chip 
                              label={`${hotel.discount}% OFF`} 
                              size="small" 
                              color="success" 
                              sx={{ mt: 1, display: 'block' }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Amenities */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {hotel.amenities.slice(0, 6).map((amenity) => (
                            <Chip
                              key={amenity}
                              icon={amenityIcons[amenity as keyof typeof amenityIcons]}
                              label={amenity}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Phone />}
                          href={`tel:${hotel.contact.phone}`}
                        >
                          Call
                        </Button>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleBooking(hotel)}
                          disabled={!hotel.isAvailable}
                        >
                          {hotel.isAvailable ? 'Book Now' : 'Not Available'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
          )}
        </Box>
      )}

      {/* Booking Modal */}
      <BookingModal
        open={showBooking}
        onClose={() => {
          setShowBooking(false)
          setSelectedHotel(null)
        }}
        bike={selectedHotel ? {
          name: selectedHotel.name,
          pricePerNight: selectedHotel.price,
          location: selectedHotel.address,
          image: selectedHotel.images[0],
          description: selectedHotel.description
        } : undefined}
        currentUser={currentUser}
      />
    </Container>
  )
}
