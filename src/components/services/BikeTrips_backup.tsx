import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AppBar, Toolbar, Container, Typography, IconButton, Rating } from '@mui/material'
import { 
  LocationOn, 
  CalendarToday, 
  Group, 
  Schedule,
  Star,
  LocalGasStation,
  Terrain,
  Security,
  Restaurant,
  Hotel,
  DirectionsBike,
  Warning,
  CheckCircle,
  Cancel,
  FilterList,
  ArrowBack
} from '@mui/icons-material'
import { User } from '@/App'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { BookingModal } from '@/components/booking/BookingModal'
import { NearMeButton } from '@/components/ui/NearMeButton'

interface GuidedBikeTrip {
  id: string
  name: string
  route: string
  duration: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
  region: string
  startLocation: string
  endLocation: string
  distance: number
  maxAltitude: number
  groupSize: { min: number; max: number }
  price: { original: number; discounted?: number }
  rating: number
  reviews: number
  tripType: 'One-Way' | 'Round Trip' | 'Circuit'
  bikeType: 'Royal Enfield' | 'KTM' | 'Himalayan' | 'Any'
  startDate: string
  endDate: string
  
  // Detailed information
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: {
    day: number
    title: string
    description: string
    distance?: number
    highlights?: string[]
  }[]
  
  // Safety and requirements
  fitnessLevel: 'Basic' | 'Moderate' | 'High'
  ageRestriction: { min: number; max: number }
  documentsRequired: string[]
  safeProv: boolean
  mechanicSupport: boolean
  medicalSupport: boolean
  backupVehicle: boolean
  
  // Leader information
  tripLeader: {
    name: string
    experience: string
    rating: number
    completedTrips: number
  }
  
  currentParticipants: number
  image: string
  gallery: string[]
}

interface BikeTripsProps {
  currentUser: User | null
}

const DIFFICULTY_COLORS = {
  'Easy': 'bg-green-100 text-green-700 border-green-300',
  'Moderate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Challenging': 'bg-orange-100 text-orange-700 border-orange-300',
  'Extreme': 'bg-red-100 text-red-700 border-red-300'
}

// Sample guided bike trips data
const mockTrips: GuidedBikeTrip[] = [
  {
    id: '1',
    name: 'Leh Ladakh Ultimate Adventure',
    route: 'Srinagar → Leh → Manali',
    duration: '11 Days, 10 Nights',
    difficulty: 'Extreme',
    region: 'Ladakh',
    startLocation: 'Srinagar',
    endLocation: 'Manali',
    distance: 1600,
    maxAltitude: 5359,
    groupSize: { min: 6, max: 12 },
    price: { original: 51999, discounted: 42999 },
    rating: 4.8,
    reviews: 156,
    tripType: 'One-Way',
    bikeType: 'Royal Enfield',
    startDate: '2024-06-15',
    endDate: '2024-06-25',
    highlights: [
      'Cross Khardung La - World\'s highest motorable road',
      'Experience Umling La Pass at 19,300 ft',
      'Pangong Lake sunset and sunrise',
      'Nubra Valley desert experience',
      'Hanle Dark Sky Reserve'
    ],
    inclusions: [
      'Royal Enfield Himalayan motorcycle',
      'Fuel for entire itinerary',
      'Accommodation (hotels/camps)',
      'Breakfast and dinner',
      'Backup vehicle',
      'Mechanical support',
      'Medical support with oxygen',
      'Inner line permits',
      'Professional ride captain'
    ],
    exclusions: [
      'Lunch on all days',
      'Personal expenses',
      'Entry fees to monuments',
      'Travel insurance',
      'Bike security deposit (₹10,000)',
      'GST extra'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar',
        description: 'Arrive in Srinagar, bike briefing, local sightseeing',
        highlights: ['Shikara ride', 'Dal Lake', 'Mughal Gardens']
      },
      {
        day: 2,
        title: 'Srinagar to Kargil',
        description: 'Ride through beautiful valleys and reach Kargil',
        distance: 200,
        highlights: ['Zoji La Pass', 'Dras War Memorial', 'Kargil War Memorial']
      }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 21, max: 55 },
    documentsRequired: ['Valid driving license', 'Government ID proof', 'Medical certificate'],
    safeProv: true,
    mechanicSupport: true,
    medicalSupport: true,
    backupVehicle: true,
    tripLeader: {
      name: 'Rajesh Kumar',
      experience: '8 years',
      rating: 4.9,
      completedTrips: 89
    },
    currentParticipants: 8,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
  },
  {
    id: '2',
    name: 'Coastal Karnataka Explorer',
    route: 'Bangalore → Gokarna → Mangalore',
    duration: '5 Days, 4 Nights',
    difficulty: 'Moderate',
    region: 'Karnataka',
    startLocation: 'Bangalore',
    endLocation: 'Mangalore',
    distance: 800,
    maxAltitude: 900,
    groupSize: { min: 4, max: 8 },
    price: { original: 18999, discounted: 14999 },
    rating: 4.6,
    reviews: 89,
    tripType: 'One-Way',
    bikeType: 'Any',
    startDate: '2024-07-01',
    endDate: '2024-07-05',
    highlights: [
      'Beautiful coastal roads',
      'Gokarna beach camping',
      'Murudeshwar temple visit',
      'Western Ghats scenery',
      'Local coastal cuisine'
    ],
    inclusions: [
      'Accommodation in hotels/camps',
      'Breakfast and dinner',
      'Fuel assistance',
      'Professional guide',
      'First aid kit',
      'Route guidance'
    ],
    exclusions: [
      'Motorcycle (bring your own)',
      'Lunch',
      'Entry fees',
      'Personal expenses',
      'Insurance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bangalore to Shimoga',
        description: 'Start the coastal journey from Bangalore',
        distance: 280,
        highlights: ['Western Ghats entry', 'Coffee plantations']
      },
      {
        day: 2,
        title: 'Shimoga to Gokarna',
        description: 'Ride to the beautiful beach town of Gokarna',
        distance: 200,
        highlights: ['Coastal roads', 'Beach arrival', 'Evening bonfire']
      }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 60 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true,
    mechanicSupport: false,
    medicalSupport: true,
    backupVehicle: true,
    tripLeader: {
      name: 'Priya Nair',
      experience: '5 years',
      rating: 4.7,
      completedTrips: 45
    },
    currentParticipants: 4,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop']
  }
  // Can add 18 more trips here...
]

export function BikeTrips({ currentUser }: BikeTripsProps) {
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedItem, setSelectedItem] = useState<GuidedBikeTrip | null>(null)
  const [filteredTrips, setFilteredTrips] = useState(mockTrips)

  // Trip Detail Page Component
  const TripDetailPage = ({ trip }: { trip: GuidedBikeTrip }) => {
    const [showJoinConfirmation, setShowJoinConfirmation] = useState(false);

    const handleJoinTrip = () => {
      setShowJoinConfirmation(true);
      setTimeout(() => {
        setShowJoinConfirmation(false);
        setView('list');
        setSelectedItem(null);
      }, 2000);
    };

    return (
      <div className="min-h-screen bg-background">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setView('list');
                setSelectedItem(null);
              }}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trip.name}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 3, pb: 4 }}>
          {showJoinConfirmation && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-green-500 text-white p-6 rounded-lg z-50 flex items-center gap-3 shadow-lg">
              <CheckCircle />
              <span className="text-xl font-semibold">Successfully joined the trip!</span>
            </div>
          )}

          {/* Trip Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{trip.route}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Rating value={trip.rating} readOnly precision={0.1} />
                  <span>{trip.rating} ({trip.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-2 flex-wrap mb-4">
                  <Badge>{trip.duration}</Badge>
                  <Badge variant="outline">{trip.difficulty}</Badge>
                  <Badge>{trip.bikeType}</Badge>
                </div>
                <div className="text-3xl font-bold text-primary mb-4">
                  ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                  {trip.price.discounted && (
                    <span className="text-lg line-through text-gray-500 ml-2">
                      ₹{trip.price.original.toLocaleString()}
                    </span>
                  )}
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleJoinTrip}
                >
                  <CheckCircle className="mr-2" />
                  Join This Trip
                </Button>
              </div>
            </div>
          </div>

          {/* Trip Information Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
              <TabsTrigger value="leader">Leader</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Trip Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Trip Details</h4>
                      <p><strong>Duration:</strong> {trip.duration}</p>
                      <p><strong>Distance:</strong> {trip.distance} km</p>
                      <p><strong>Max Altitude:</strong> {trip.maxAltitude.toLocaleString()} ft</p>
                      <p><strong>Difficulty:</strong> {trip.difficulty}</p>
                      <p><strong>Region:</strong> {trip.region}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <p><strong>Age:</strong> {trip.ageRestriction.min}-{trip.ageRestriction.max} years</p>
                      <p><strong>Fitness:</strong> {trip.fitnessLevel}</p>
                      <p><strong>Group Size:</strong> {trip.groupSize.min}-{trip.groupSize.max} people</p>
                      <p><strong>Participants:</strong> {trip.currentParticipants}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline">{highlight}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="itinerary" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Itinerary</h3>
                  {trip.itinerary.map((day) => (
                    <div key={day.day} className="border-l-2 border-primary pl-4 mb-4">
                      <h4 className="font-semibold">Day {day.day}: {day.title}</h4>
                      <p className="text-gray-600 mb-2">{day.description}</p>
                      {day.distance && <p className="text-sm"><strong>Distance:</strong> {day.distance} km</p>}
                      {day.highlights && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {day.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{highlight}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inclusions" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Inclusions & Exclusions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                        <CheckCircle className="mr-2" />
                        Inclusions
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {trip.inclusions.map((inclusion, index) => (
                          <li key={index}>{inclusion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                        <Cancel className="mr-2" />
                        Exclusions
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {trip.exclusions.map((exclusion, index) => (
                          <li key={index}>{exclusion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="leader" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Trip Leader</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                      {trip.tripLeader.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{trip.tripLeader.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Rating value={trip.tripLeader.rating} readOnly precision={0.1} />
                        <span>{trip.tripLeader.rating}</span>
                      </div>
                      <p><strong>Experience:</strong> {trip.tripLeader.experience}</p>
                      <p><strong>Completed Trips:</strong> {trip.tripLeader.completedTrips}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
    );
  };

  if (view === 'detail' && selectedItem) {
    return <TripDetailPage trip={selectedItem} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main List View */}
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Guided Bike Trips</h1>
          <p className="text-muted-foreground">
            Join our expertly guided motorcycle adventures across incredible destinations
          </p>
        </div>

        {/* Trips Grid - 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 relative">
                <img 
                  src={trip.image} 
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className={DIFFICULTY_COLORS[trip.difficulty]}>
                    {trip.difficulty}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary">
                    {trip.tripType}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1">{trip.name}</h3>
                  <p className="text-sm text-muted-foreground">{trip.route}</p>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="text-yellow-500 w-4 h-4" />
                  <span className="font-medium text-sm">{trip.rating}</span>
                  <span className="text-muted-foreground text-xs">({trip.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs">{trip.duration}</Badge>
                  <Badge variant="outline" className="text-xs">{trip.bikeType}</Badge>
                  <Badge variant="outline" className="text-xs">{trip.distance} km</Badge>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-bold text-lg">
                    ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                  </span>
                  {trip.price.discounted && (
                    <span className="text-sm line-through text-muted-foreground">
                      ₹{trip.price.original.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 text-sm"
                    onClick={() => {
                      setSelectedItem(trip);
                      setView('detail');
                    }}
                    disabled={trip.currentParticipants >= trip.groupSize.max}
                  >
                    {trip.currentParticipants >= trip.groupSize.max ? 'Fully Booked' : 'Join Trip'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
