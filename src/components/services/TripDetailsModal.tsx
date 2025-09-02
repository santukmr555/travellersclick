import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  LocationOn, 
  CalendarToday, 
  Group, 
  Star,
  CheckCircle,
  Cancel,
  Terrain,
  Schedule,
  Warning,
  Security,
  Restaurant,
  Hotel,
  LocalGasStation
} from '@mui/icons-material'

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
  itinerary: {
    day: number
    title: string
    description: string
    distance?: number
    highlights?: string[]
  }[]
  
  fitnessLevel: 'Basic' | 'Moderate' | 'High'
  ageRestriction: { min: number; max: number }
  documentsRequired: string[]
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

interface TripDetailsModalProps {
  trip: GuidedBikeTrip | null
  open: boolean
  onClose: () => void
  onBookTrip?: (trip: GuidedBikeTrip) => void
}

const DIFFICULTY_COLORS = {
  'Easy': 'bg-green-100 text-green-700 border-green-300',
  'Moderate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Challenging': 'bg-orange-100 text-orange-700 border-orange-300',
  'Extreme': 'bg-red-100 text-red-700 border-red-300'
}

export function TripDetailsModal({ trip, open, onClose, onBookTrip }: TripDetailsModalProps) {
  if (!trip) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{trip.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="relative">
            <div className="h-64 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{trip.route}</h3>
                <p className="text-muted-foreground">{trip.duration} • {trip.distance}km</p>
              </div>
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`${DIFFICULTY_COLORS[trip.difficulty]} border`}>
                {trip.difficulty}
              </Badge>
              <Badge variant="secondary">{trip.tripType}</Badge>
            </div>
            <div className="absolute top-4 right-4 text-right bg-white/90 p-3 rounded-lg">
              {trip.price.discounted && (
                <p className="text-sm text-muted-foreground line-through">
                  ₹{trip.price.original.toLocaleString()}
                </p>
              )}
              <p className="font-bold text-2xl text-primary">
                ₹{(trip.price.discounted || trip.price.original).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">per person</p>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Group className="text-primary mb-2" />
                <p className="font-medium">{trip.currentParticipants}/{trip.groupSize.max}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Terrain className="text-primary mb-2" />
                <p className="font-medium">{trip.maxAltitude.toLocaleString()}m</p>
                <p className="text-sm text-muted-foreground">Max Altitude</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="text-yellow-500 mb-2" />
                <p className="font-medium">{trip.rating} ({trip.reviews})</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Trip Leader */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Trip Leader</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg">{trip.tripLeader.name}</p>
                  <p className="text-muted-foreground">
                    {trip.tripLeader.experience} experience • {trip.tripLeader.completedTrips} trips completed
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500" fontSize="small" />
                  <span className="font-medium">{trip.tripLeader.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Trip Highlights</h4>
                <div className="space-y-2">
                  {trip.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-green-600 mt-0.5" fontSize="small" />
                      <p className="text-sm">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Trip Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{trip.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{trip.distance}km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge className={DIFFICULTY_COLORS[trip.difficulty]}>
                        {trip.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bike Type:</span>
                      <span>{trip.bikeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fitness Level:</span>
                      <span>{trip.fitnessLevel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Support Features</h4>
                  <div className="space-y-2">
                    {trip.mechanicSupport && (
                      <div className="flex items-center gap-2">
                        <Security className="text-green-600" fontSize="small" />
                        <span className="text-sm">Mechanical Support</span>
                      </div>
                    )}
                    {trip.medicalSupport && (
                      <div className="flex items-center gap-2">
                        <Warning className="text-green-600" fontSize="small" />
                        <span className="text-sm">Medical Support</span>
                      </div>
                    )}
                    {trip.backupVehicle && (
                      <div className="flex items-center gap-2">
                        <LocalGasStation className="text-green-600" fontSize="small" />
                        <span className="text-sm">Backup Vehicle</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-4">
              <h4 className="font-semibold">Day-by-Day Itinerary</h4>
              <div className="space-y-4">
                {trip.itinerary.map((day) => (
                  <Card key={day.day}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                            {day.day}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg mb-1">{day.title}</h5>
                          <p className="text-muted-foreground mb-3">{day.description}</p>
                          {day.distance && (
                            <p className="text-sm text-primary mb-2">Distance: {day.distance}km</p>
                          )}
                          {day.highlights && day.highlights.length > 0 && (
                            <div>
                              <p className="font-medium mb-1">Highlights:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {day.highlights.map((highlight, idx) => (
                                  <li key={idx}>{highlight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inclusions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
                    <CheckCircle fontSize="small" />
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    {trip.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-green-600 mt-0.5" fontSize="small" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                    <Cancel fontSize="small" />
                    What's Not Included
                  </h4>
                  <ul className="space-y-2">
                    {trip.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Cancel className="text-red-600 mt-0.5" fontSize="small" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Physical Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fitness Level:</span>
                      <Badge variant="outline">{trip.fitnessLevel}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age Restriction:</span>
                      <span>{trip.ageRestriction.min} - {trip.ageRestriction.max} years</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Required Documents</h4>
                  <ul className="space-y-1">
                    {trip.documentsRequired.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Warning className="text-yellow-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-yellow-800 mb-1">Important Notice</h5>
                      <p className="text-sm text-yellow-700">
                        This trip involves high-altitude riding and challenging terrain. Please ensure you meet all fitness requirements and have the necessary riding experience before booking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (onBookTrip) onBookTrip(trip)
                onClose()
              }}
              disabled={trip.currentParticipants >= trip.groupSize.max}
              className="flex-1"
            >
              {trip.currentParticipants >= trip.groupSize.max ? 'Fully Booked' : 'Book This Trip'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
