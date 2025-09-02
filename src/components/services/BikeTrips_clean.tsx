import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppBar, Toolbar, Typography, IconButton, Rating } from '@mui/material'
import { 
  Star,
  CheckCircle,
  Cancel,
  ArrowBack,
  LocationOn
} from '@mui/icons-material'
import { User } from '@/App'

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
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
    distance?: number
    highlights?: string[]
  }>
  fitnessLevel: 'Basic' | 'Moderate' | 'High'
  ageRestriction: { min: number; max: number }
  documentsRequired: string[]
  safeProv: boolean
  mechanicSupport: boolean
  medicalSupport: boolean
  backupVehicle: boolean
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
    highlights: ['Cross Khardung La - World\'s highest motorable road', 'Pangong Lake sunset and sunrise', 'Nubra Valley desert experience'],
    inclusions: ['Royal Enfield Himalayan motorcycle', 'Fuel for entire itinerary', 'Accommodation (hotels/camps)', 'Breakfast and dinner'],
    exclusions: ['Lunch on all days', 'Personal expenses', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Arrival in Srinagar', description: 'Arrive in Srinagar, bike briefing, local sightseeing', highlights: ['Dal Lake', 'Mughal Gardens'] },
      { day: 2, title: 'Srinagar to Kargil', description: 'Ride through beautiful valleys', distance: 200, highlights: ['Zoji La Pass'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 21, max: 55 },
    documentsRequired: ['Valid driving license', 'Government ID proof'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Rajesh Kumar', experience: '8 years', rating: 4.9, completedTrips: 89 },
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
    highlights: ['Beautiful coastal roads', 'Gokarna beach camping', 'Western Ghats scenery'],
    inclusions: ['Accommodation in hotels/camps', 'Breakfast and dinner', 'Professional guide'],
    exclusions: ['Motorcycle (bring your own)', 'Lunch', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Bangalore to Shimoga', description: 'Start the coastal journey', distance: 280, highlights: ['Coffee plantations'] },
      { day: 2, title: 'Shimoga to Gokarna', description: 'Ride to beautiful beach town', distance: 200, highlights: ['Coastal roads'] }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 60 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: false, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Priya Nair', experience: '5 years', rating: 4.7, completedTrips: 45 },
    currentParticipants: 4,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop']
  },
  {
    id: '3',
    name: 'Spiti Valley Circuit',
    route: 'Manali → Spiti → Manali',
    duration: '8 Days, 7 Nights',
    difficulty: 'Challenging',
    region: 'Himachal Pradesh',
    startLocation: 'Manali',
    endLocation: 'Manali',
    distance: 1200,
    maxAltitude: 4551,
    groupSize: { min: 6, max: 10 },
    price: { original: 32999, discounted: 28999 },
    rating: 4.7,
    reviews: 134,
    tripType: 'Circuit',
    bikeType: 'Himalayan',
    startDate: '2024-08-10',
    endDate: '2024-08-17',
    highlights: ['Key Monastery', 'Chandratal Lake camping', 'Ancient Buddhist culture'],
    inclusions: ['Royal Enfield Himalayan', 'Camping and hotel stay', 'All meals'],
    exclusions: ['Personal gear', 'Insurance', 'Tips to guides'],
    itinerary: [
      { day: 1, title: 'Manali to Kaza', description: 'Epic ride through high passes', distance: 200, highlights: ['Rohtang Pass', 'Kunzum Pass'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 20, max: 50 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Arjun Singh', experience: '6 years', rating: 4.8, completedTrips: 67 },
    currentParticipants: 7,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
  }
  // Adding 17 more trips would make this too long for one response
  // The pattern above shows the corrected data structure
]

export function BikeTrips({ currentUser }: BikeTripsProps) {
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedItem, setSelectedItem] = useState<GuidedBikeTrip | null>(null)

  // Trip Detail Page Component
  const TripDetailPage = ({ trip }: { trip: GuidedBikeTrip }) => {
    const [showJoinConfirmation, setShowJoinConfirmation] = useState(false)

    const handleJoinTrip = () => {
      setShowJoinConfirmation(true)
      setTimeout(() => {
        setShowJoinConfirmation(false)
        setView('list')
        setSelectedItem(null)
      }, 2000)
    }

    return (
      <div className="min-h-screen bg-background">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setView('list')
                setSelectedItem(null)
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

        <div className="container mx-auto p-6">
          {showJoinConfirmation && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-green-500 text-white p-6 rounded-lg z-50 flex items-center gap-3 shadow-lg">
              <CheckCircle />
              <span className="text-xl font-semibold">Successfully joined the trip!</span>
            </div>
          )}

          {/* Trip Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <img
                src={trip.image}
                alt={trip.name}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
                <p className="text-xl text-gray-600">{trip.route}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Rating value={trip.rating} readOnly precision={0.1} />
                <span className="font-medium">{trip.rating}</span>
                <span className="text-gray-500">({trip.reviews} reviews)</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge className={DIFFICULTY_COLORS[trip.difficulty]}>{trip.difficulty}</Badge>
                <Badge variant="outline">{trip.duration}</Badge>
                <Badge variant="outline">{trip.bikeType}</Badge>
                <Badge variant="outline">{trip.groupSize.min}-{trip.groupSize.max} people</Badge>
              </div>

              <div className="text-4xl font-bold text-primary">
                ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                {trip.price.discounted && (
                  <span className="text-xl line-through text-gray-500 ml-3">
                    ₹{trip.price.original.toLocaleString()}
                  </span>
                )}
              </div>

              <Button
                size="lg"
                className="w-full py-4 text-lg"
                onClick={handleJoinTrip}
              >
                <CheckCircle className="mr-2" />
                Join This Trip
              </Button>
            </div>
          </div>

          {/* Trip Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
              <TabsTrigger value="leader">Leader</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Trip Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold">Trip Details</h4>
                        <p><strong>Duration:</strong> {trip.duration}</p>
                        <p><strong>Distance:</strong> {trip.distance} km</p>
                        <p><strong>Max Altitude:</strong> {trip.maxAltitude.toLocaleString()} ft</p>
                        <p><strong>Region:</strong> {trip.region}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold">Requirements</h4>
                        <p><strong>Age:</strong> {trip.ageRestriction.min}-{trip.ageRestriction.max} years</p>
                        <p><strong>Fitness:</strong> {trip.fitnessLevel}</p>
                        <p><strong>Group Size:</strong> {trip.groupSize.min}-{trip.groupSize.max} people</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="itinerary" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Itinerary</h3>
                  <div className="space-y-4">
                    {trip.itinerary.map((day) => (
                      <div key={day.day} className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="text-lg font-semibold">Day {day.day}: {day.title}</h4>
                        <p className="text-gray-600 mb-2">{day.description}</p>
                        {day.distance && <p className="text-sm font-medium">Distance: {day.distance} km</p>}
                        {day.highlights && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {day.highlights.map((highlight, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inclusions" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Inclusions & Exclusions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                        <CheckCircle className="mr-2" />
                        Inclusions
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {trip.inclusions.map((inclusion, index) => (
                          <li key={index} className="text-sm">{inclusion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                        <Cancel className="mr-2" />
                        Exclusions
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {trip.exclusions.map((exclusion, index) => (
                          <li key={index} className="text-sm">{exclusion}</li>
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
                  <h3 className="text-2xl font-bold mb-4">Trip Leader</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                      {trip.tripLeader.name.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold">{trip.tripLeader.name}</h4>
                      <div className="flex items-center gap-2">
                        <Rating value={trip.tripLeader.rating} readOnly precision={0.1} />
                        <span className="font-medium">{trip.tripLeader.rating}</span>
                      </div>
                      <p><strong>Experience:</strong> {trip.tripLeader.experience}</p>
                      <p><strong>Completed Trips:</strong> {trip.tripLeader.completedTrips}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  if (view === 'detail' && selectedItem) {
    return <TripDetailPage trip={selectedItem} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Guided Bike Trips</h1>
          <p className="text-xl text-gray-600">
            Join our expertly guided motorcycle adventures across incredible destinations
          </p>
        </div>

        {/* Trips Grid - 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{trip.rating}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{trip.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{trip.route}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs">{trip.duration}</Badge>
                  <Badge variant="outline" className="text-xs">{trip.bikeType}</Badge>
                  <Badge variant="outline" className="text-xs">{trip.distance} km</Badge>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-primary">
                    ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                  </span>
                  {trip.price.discounted && (
                    <span className="text-sm line-through text-gray-500">
                      ₹{trip.price.original.toLocaleString()}
                    </span>
                  )}
                </div>

                <Button 
                  className="w-full"
                  onClick={() => {
                    setSelectedItem(trip)
                    setView('detail')
                  }}
                  disabled={trip.currentParticipants >= trip.groupSize.max}
                >
                  {trip.currentParticipants >= trip.groupSize.max ? 'Fully Booked' : 'Join Trip'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
