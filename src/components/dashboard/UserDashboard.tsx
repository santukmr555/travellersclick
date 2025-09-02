import { useState, useEffect } from 'react'
import { User } from '@/App'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  User as UserIcon,
  Settings,
  Calendar,
  CreditCard,
  BookOpen,
  MapPin,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Edit,
  Plus,
  Clock,
  Users,
  DollarSign,
  Share2,
  Bike,
  Car,
  Truck,
  Building
} from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { availabilityService, BookingStatus } from '@/services/availabilityService'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface UserDashboardProps {
  currentUser: User
}

interface UserProfile {
  name: string
  phone: string
  avatar: string
  bio?: string
}

interface TravelStory {
  id: string
  author: string
  title: string
  content: string
  fullContent: string
  location: string
  destination: string
  placeType: 'Hill Station' | 'Trekking' | 'Waterfall' | 'Pilgrim' | 'Beach' | 'Forest' | 'Valley'
  journeyType: 'Friends' | 'Solo' | 'Family' | 'Community'
  tags: string[]
  photos: string[]
  publishedAt: string
  likes: number
  comments: number
  readTime: number
  isPublished: boolean
  image: string
  gallery: string[]
}

interface GuidedTrip {
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
  description: string
  isPublic: boolean
  shareableLink: string
  participants: { id: string; name: string; isPaid: boolean }[]
}

interface ExtendedBookingStatus extends BookingStatus {
  serviceName: string
  serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
  duration: string
  totalPrice: number
}

interface Transaction {
  id: string
  type: 'booking' | 'fee' | 'refund'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  serviceType?: string
  serviceName?: string
}

const sidebarMenus = [
  { id: 'profile', label: 'Profile Settings', icon: UserIcon },
  { id: 'bookings', label: 'Bookings History', icon: Calendar },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'stories', label: 'Share Your Story', icon: BookOpen },
  { id: 'guided-trips', label: 'Create Guided Trip', icon: MapPin },
]

const getServiceIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'bike': return <Bike size={16} />
    case 'car': return <Car size={16} />
    case 'campervan': return <Truck size={16} />
    case 'hotel': return <Building size={16} />
    default: return <Car size={16} />
  }
}

export function UserDashboard({ currentUser }: UserDashboardProps) {
  const [activeMenu, setActiveMenu] = useState('profile')
  
  // Profile state
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>(`user-profile-${currentUser.id}`, {
    name: currentUser.name || currentUser.email.split('@')[0],
    phone: '',
    avatar: '',
    bio: ''
  })

  // Stories state
  const [stories, setStories] = useLocalStorage<TravelStory[]>(`user-stories-${currentUser.id}`, [])
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    location: '',
    destination: '',
    placeType: '' as 'Hill Station' | 'Trekking' | 'Waterfall' | 'Pilgrim' | 'Beach' | 'Forest' | 'Valley' | '',
    journeyType: '' as 'Friends' | 'Solo' | 'Family' | 'Community' | '',
    tags: [] as string[],
    photos: [] as string[]
  })
  const [newTag, setNewTag] = useState('')

  // Guided trips state
  const [guidedTrips, setGuidedTrips] = useLocalStorage<GuidedTrip[]>(`user-guided-trips-${currentUser.id}`, [])
  const [newTrip, setNewTrip] = useState({
    name: '',
    route: '',
    duration: '',
    difficulty: '' as 'Easy' | 'Moderate' | 'Challenging' | 'Extreme' | '',
    region: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
    maxAltitude: 0,
    groupSize: { min: 4, max: 10 },
    price: { original: 0, discounted: 0 },
    tripType: '' as 'One-Way' | 'Round Trip' | 'Circuit' | '',
    bikeType: '' as 'Royal Enfield' | 'KTM' | 'Himalayan' | 'Any' | '',
    startDate: '',
    endDate: '',
    highlights: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    itinerary: [] as Array<{
      day: number
      title: string
      description: string
      distance?: number
      highlights?: string[]
    }>,
    fitnessLevel: '' as 'Basic' | 'Moderate' | 'High' | '',
    ageRestriction: { min: 18, max: 65 },
    documentsRequired: [] as string[],
    safeProv: true,
    mechanicSupport: false,
    medicalSupport: false,
    backupVehicle: false,
    description: '',
    isPublic: true,
    image: '',
    gallery: [] as string[]
  })
  const [newHighlight, setNewHighlight] = useState('')
  const [newInclusion, setNewInclusion] = useState('')
  const [newExclusion, setNewExclusion] = useState('')
  const [newDocument, setNewDocument] = useState('')
  const [newItinerary, setNewItinerary] = useState({
    day: 1,
    title: '',
    description: '',
    distance: 0,
    highlights: [] as string[]
  })

  // Bookings and transactions
  const [bookings, setBookings] = useState<ExtendedBookingStatus[]>([])
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`user-transactions-${currentUser.id}`, [
    {
      id: '1',
      type: 'booking',
      amount: 50,
      description: 'Mountain Bike Rental - 2 hours',
      date: '2024-01-15T10:00:00Z',
      status: 'completed',
      serviceType: 'bike',
      serviceName: 'Trek Mountain Explorer'
    },
    {
      id: '2',
      type: 'fee',
      amount: 2.5,
      description: 'Platform service fee',
      date: '2024-01-15T10:00:00Z',
      status: 'completed'
    }
  ])

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const loadBookings = async () => {
      const userBookings = await availabilityService.getUserBookings(currentUser.id)
      // Transform basic bookings into extended bookings with mock data
      const extendedBookings: ExtendedBookingStatus[] = userBookings.map((booking, index) => ({
        ...booking,
        serviceName: ['Mountain Bike Explorer', 'Tesla Model 3', 'Luxury Campervan', 'Downtown Hotel'][index % 4],
        serviceType: (['bike', 'car', 'campervan', 'hotel'] as const)[index % 4],
        duration: ['2 hours', '1 day', '3 days', '2 nights'][index % 4],
        totalPrice: [50, 120, 180, 250][index % 4]
      }))
      setBookings(extendedBookings)
    }
    loadBookings()
  }, [currentUser.id])

  const handleProfileUpdate = () => {
    setUserProfile(userProfile)
    toast.success('Profile updated successfully!')
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    // In a real app, you would validate current password and update it
    toast.success('Password changed successfully!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const publishStory = () => {
    if (!newStory.title || !newStory.content || !newStory.location || !newStory.destination || !newStory.placeType || !newStory.journeyType) {
      toast.error('Please fill in all required fields')
      return
    }

    // Calculate read time (average 200 words per minute)
    const wordCount = newStory.content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    const story: TravelStory = {
      id: Date.now().toString(),
      author: userProfile.name,
      title: newStory.title,
      content: newStory.content.substring(0, 200) + '...', // Preview content
      fullContent: newStory.content,
      location: newStory.location,
      destination: newStory.destination,
      placeType: newStory.placeType as 'Hill Station' | 'Trekking' | 'Waterfall' | 'Pilgrim' | 'Beach' | 'Forest' | 'Valley',
      journeyType: newStory.journeyType as 'Friends' | 'Solo' | 'Family' | 'Community',
      tags: newStory.tags,
      photos: newStory.photos,
      publishedAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      readTime: readTime,
      isPublished: true,
      image: newStory.photos[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      gallery: newStory.photos
    }

    setStories([...stories, story])
    resetNewStory()
    toast.success('Story published successfully!')
  }

  const resetNewStory = () => {
    setNewStory({
      title: '',
      content: '',
      location: '',
      destination: '',
      placeType: '',
      journeyType: '',
      tags: [],
      photos: []
    })
    setNewTag('')
  }

  const addTag = () => {
    if (newTag.trim() && !newStory.tags.includes(newTag.trim())) {
      setNewStory({...newStory, tags: [...newStory.tags, newTag.trim()]})
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewStory({...newStory, tags: newStory.tags.filter(tag => tag !== tagToRemove)})
  }

  const deleteStory = (storyId: string) => {
    setStories(stories.filter(story => story.id !== storyId))
    toast.success('Story deleted successfully!')
  }

  const createGuidedTrip = () => {
    if (!newTrip.name || !newTrip.description || !newTrip.startDate || !newTrip.endDate || 
        !newTrip.route || !newTrip.difficulty || !newTrip.region || !newTrip.startLocation || 
        !newTrip.endLocation || !newTrip.tripType || !newTrip.bikeType || !newTrip.fitnessLevel) {
      toast.error('Please fill in all required fields')
      return
    }

    const trip: GuidedTrip = {
      id: Date.now().toString(),
      name: newTrip.name,
      route: newTrip.route,
      duration: newTrip.duration,
      difficulty: newTrip.difficulty as 'Easy' | 'Moderate' | 'Challenging' | 'Extreme',
      region: newTrip.region,
      startLocation: newTrip.startLocation,
      endLocation: newTrip.endLocation,
      distance: newTrip.distance,
      maxAltitude: newTrip.maxAltitude,
      groupSize: newTrip.groupSize,
      price: newTrip.price,
      tripType: newTrip.tripType as 'One-Way' | 'Round Trip' | 'Circuit',
      bikeType: newTrip.bikeType as 'Royal Enfield' | 'KTM' | 'Himalayan' | 'Any',
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      highlights: newTrip.highlights,
      inclusions: newTrip.inclusions,
      exclusions: newTrip.exclusions,
      itinerary: newTrip.itinerary,
      fitnessLevel: newTrip.fitnessLevel as 'Basic' | 'Moderate' | 'High',
      ageRestriction: newTrip.ageRestriction,
      documentsRequired: newTrip.documentsRequired,
      safeProv: newTrip.safeProv,
      mechanicSupport: newTrip.mechanicSupport,
      medicalSupport: newTrip.medicalSupport,
      backupVehicle: newTrip.backupVehicle,
      tripLeader: {
        name: userProfile.name,
        experience: '2+ years',
        rating: 4.5,
        completedTrips: 0
      },
      currentParticipants: 0,
      image: newTrip.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      gallery: newTrip.gallery,
      description: newTrip.description,
      isPublic: newTrip.isPublic,
      shareableLink: `${window.location.origin}/guided-trip/${Date.now()}`,
      participants: []
    }

    setGuidedTrips([...guidedTrips, trip])
    resetNewTrip()
    toast.success('Guided trip created successfully!')
  }

  const resetNewTrip = () => {
    setNewTrip({
      name: '',
      route: '',
      duration: '',
      difficulty: '',
      region: '',
      startLocation: '',
      endLocation: '',
      distance: 0,
      maxAltitude: 0,
      groupSize: { min: 4, max: 10 },
      price: { original: 0, discounted: 0 },
      tripType: '',
      bikeType: '',
      startDate: '',
      endDate: '',
      highlights: [],
      inclusions: [],
      exclusions: [],
      itinerary: [],
      fitnessLevel: '',
      ageRestriction: { min: 18, max: 65 },
      documentsRequired: [],
      safeProv: true,
      mechanicSupport: false,
      medicalSupport: false,
      backupVehicle: false,
      description: '',
      isPublic: true,
      image: '',
      gallery: []
    })
    setNewHighlight('')
    setNewInclusion('')
    setNewExclusion('')
    setNewDocument('')
    setNewItinerary({
      day: 1,
      title: '',
      description: '',
      distance: 0,
      highlights: []
    })
  }

  const deleteGuidedTrip = (tripId: string) => {
    setGuidedTrips(guidedTrips.filter(trip => trip.id !== tripId))
    toast.success('Guided trip deleted successfully!')
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
              <p className="text-muted-foreground mb-6">Manage your personal information and account settings</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className="text-lg">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload size={16} />
                    <span>Upload Avatar</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={userProfile.bio}
                    onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button onClick={handleProfileUpdate}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                <Button onClick={handlePasswordChange}>Change Password</Button>
              </CardContent>
            </Card>
          </div>
        )

      case 'bookings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Bookings History</h2>
              <p className="text-muted-foreground mb-6">View all your past and upcoming bookings</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Bookings</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {bookings.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No bookings found</p>
                    </CardContent>
                  </Card>
                ) : (
                  bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getServiceIcon(booking.serviceType)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{booking.serviceName}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{booking.serviceType}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Calendar size={16} className="mr-1" />
                                  {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                                </span>
                                <span className="flex items-center">
                                  <Clock size={16} className="mr-1" />
                                  {booking.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'completed' ? 'secondary' :
                              booking.status === 'cancelled' ? 'destructive' : 'outline'
                            }>
                              {booking.status}
                            </Badge>
                            <p className="text-lg font-semibold mt-2">${booking.totalPrice}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        )

      case 'transactions':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Transactions History</h2>
              <p className="text-muted-foreground mb-6">View all your booking payments, fees, and refunds</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="booking">Bookings</TabsTrigger>
                <TabsTrigger value="fee">Fees</TabsTrigger>
                <TabsTrigger value="refund">Refunds</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                            transaction.type === 'fee' ? 'bg-orange-100 text-orange-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            <DollarSign size={16} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{transaction.description}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                            </p>
                            {transaction.serviceType && (
                              <div className="flex items-center mt-1">
                                {getServiceIcon(transaction.serviceType)}
                                <span className="ml-1 text-xs text-muted-foreground">
                                  {transaction.serviceType}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-semibold ${
                            transaction.type === 'refund' ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {transaction.type === 'refund' ? '+' : '-'}${transaction.amount}
                          </p>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )

      case 'stories':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Share Your Story</h2>
              <p className="text-muted-foreground mb-6">Share your travel experiences with the community</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create New Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storyTitle">Story Title *</Label>
                    <Input
                      id="storyTitle"
                      value={newStory.title}
                      onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                      placeholder="Enter your story title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={newStory.destination}
                      onChange={(e) => setNewStory({...newStory, destination: e.target.value})}
                      placeholder="e.g., Goa, Kerala, Himachal Pradesh"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Specific Location *</Label>
                  <Input
                    id="location"
                    value={newStory.location}
                    onChange={(e) => setNewStory({...newStory, location: e.target.value})}
                    placeholder="e.g., Anjuna Beach, Goa or Tiger Hill, Darjeeling"
                  />
                </div>

                {/* Place Type and Journey Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Place Type *</Label>
                    <Select 
                      value={newStory.placeType} 
                      onValueChange={(value: 'Hill Station' | 'Trekking' | 'Waterfall' | 'Pilgrim' | 'Beach' | 'Forest' | 'Valley') => 
                        setNewStory({...newStory, placeType: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select place type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hill Station">Hill Station</SelectItem>
                        <SelectItem value="Trekking">Trekking</SelectItem>
                        <SelectItem value="Waterfall">Waterfall</SelectItem>
                        <SelectItem value="Pilgrim">Pilgrim</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Forest">Forest</SelectItem>
                        <SelectItem value="Valley">Valley</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Journey Type *</Label>
                    <Select 
                      value={newStory.journeyType} 
                      onValueChange={(value: 'Friends' | 'Solo' | 'Family' | 'Community') => 
                        setNewStory({...newStory, journeyType: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select journey type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solo">Solo Travel</SelectItem>
                        <SelectItem value="Friends">With Friends</SelectItem>
                        <SelectItem value="Family">Family Trip</SelectItem>
                        <SelectItem value="Community">Community/Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tags (e.g., adventure, sunset, photography)"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newStory.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Suggested tags: adventure, solo-travel, family, nature, photography, food, culture, trekking, beach, mountains
                  </p>
                </div>

                {/* Story Content */}
                <div className="space-y-2">
                  <Label htmlFor="storyContent">Full Story Content * <span className="text-sm text-muted-foreground">(Markdown supported)</span></Label>
                  <Textarea
                    id="storyContent"
                    className="min-h-[300px]"
                    value={newStory.content}
                    onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                    placeholder="Write your complete travel story here... 

You can use markdown formatting:
- **Bold text** for emphasis
- *Italic text* for highlights  
- ## Headings for sections
- > Quotes for special moments
- Lists for itinerary details

Share your experience, the journey, memorable moments, challenges faced, people met, food tried, and lessons learned. Make it engaging and inspiring for fellow travelers!"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Words: {newStory.content.split(/\s+/).filter(word => word.length > 0).length}</span>
                    <span>Estimated read time: {Math.ceil(newStory.content.split(/\s+/).filter(word => word.length > 0).length / 200)} min</span>
                  </div>
                </div>

                {/* Photos Section */}
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Click to upload photos or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB each. First photo will be used as cover image.</p>
                  </div>
                  {newStory.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {newStory.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={photo} 
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setNewStory({
                              ...newStory, 
                              photos: newStory.photos.filter((_, i) => i !== index)
                            })}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs bg-blue-500">Cover</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Publishing Options */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium">Publishing Options</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Make story public</Label>
                        <p className="text-sm text-muted-foreground">Allow other travelers to discover your story</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Allow comments</Label>
                        <p className="text-sm text-muted-foreground">Let others share their thoughts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Feature in travel insights</Label>
                        <p className="text-sm text-muted-foreground">Include in destination recommendations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={publishStory} className="flex items-center space-x-2">
                    <Share2 size={16} />
                    <span>Publish Story</span>
                  </Button>
                  <Button variant="outline" onClick={resetNewStory}>
                    Clear All
                  </Button>
                  <Button variant="outline">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Published Stories</h3>
              {stories.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No stories published yet</p>
                  </CardContent>
                </Card>
              ) : (
                stories.map((story) => (
                  <Card key={story.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{story.title}</h3>
                            <Badge variant="outline">{story.placeType}</Badge>
                            <Badge variant="secondary">{story.journeyType}</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            📍 {story.location} • {story.destination}
                          </p>
                          
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {story.content}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {story.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Published: {format(new Date(story.publishedAt), 'MMM dd, yyyy')}</span>
                            <span>❤️ {story.likes} likes</span>
                            <span>💬 {story.comments} comments</span>
                            <span>📖 {story.readTime} min read</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteStory(story.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )

      case 'guided-trips':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Create Guided Trip</h2>
              <p className="text-muted-foreground mb-6">Create comprehensive guided bike trips with detailed information</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create New Guided Trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Trip Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tripName">Trip Name *</Label>
                      <Input
                        id="tripName"
                        value={newTrip.name}
                        onChange={(e) => setNewTrip({...newTrip, name: e.target.value})}
                        placeholder="e.g., Leh Ladakh Ultimate Adventure"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tripDuration">Duration *</Label>
                      <Input
                        id="tripDuration"
                        value={newTrip.duration}
                        onChange={(e) => setNewTrip({...newTrip, duration: e.target.value})}
                        placeholder="e.g., 11 Days, 10 Nights"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tripRoute">Route *</Label>
                    <Input
                      id="tripRoute"
                      value={newTrip.route}
                      onChange={(e) => setNewTrip({...newTrip, route: e.target.value})}
                      placeholder="e.g., Srinagar → Leh → Manali"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tripDescription">Trip Description *</Label>
                    <Textarea
                      id="tripDescription"
                      className="min-h-[100px]"
                      value={newTrip.description}
                      onChange={(e) => setNewTrip({...newTrip, description: e.target.value})}
                      placeholder="Describe what makes this trip special, what participants will experience..."
                    />
                  </div>
                </div>

                <Separator />

                {/* Route Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Route Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">Region *</Label>
                      <Select value={newTrip.region} onValueChange={(value) => setNewTrip({...newTrip, region: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ladakh">Ladakh</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                          <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="Kerala">Kerala</SelectItem>
                          <SelectItem value="Northeast India">Northeast India</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="North India">North India</SelectItem>
                          <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                          <SelectItem value="Goa">Goa</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                          <SelectItem value="West Bengal">West Bengal</SelectItem>
                          <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                          <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startLocation">Start Location *</Label>
                      <Input
                        id="startLocation"
                        value={newTrip.startLocation}
                        onChange={(e) => setNewTrip({...newTrip, startLocation: e.target.value})}
                        placeholder="e.g., Srinagar"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endLocation">End Location *</Label>
                      <Input
                        id="endLocation"
                        value={newTrip.endLocation}
                        onChange={(e) => setNewTrip({...newTrip, endLocation: e.target.value})}
                        placeholder="e.g., Manali"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance (km)</Label>
                      <Input
                        id="distance"
                        type="number"
                        min="0"
                        value={newTrip.distance}
                        onChange={(e) => setNewTrip({...newTrip, distance: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 1600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAltitude">Maximum Altitude (feet)</Label>
                      <Input
                        id="maxAltitude"
                        type="number"
                        min="0"
                        value={newTrip.maxAltitude}
                        onChange={(e) => setNewTrip({...newTrip, maxAltitude: parseInt(e.target.value) || 0})}
                        placeholder="e.g., 5359"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trip Classification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Trip Classification</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Difficulty Level *</Label>
                      <Select 
                        value={newTrip.difficulty} 
                        onValueChange={(value: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme') => 
                          setNewTrip({...newTrip, difficulty: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Challenging">Challenging</SelectItem>
                          <SelectItem value="Extreme">Extreme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Trip Type *</Label>
                      <Select 
                        value={newTrip.tripType} 
                        onValueChange={(value: 'One-Way' | 'Round Trip' | 'Circuit') => 
                          setNewTrip({...newTrip, tripType: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Trip Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="One-Way">One-Way</SelectItem>
                          <SelectItem value="Round Trip">Round Trip</SelectItem>
                          <SelectItem value="Circuit">Circuit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Bike Type *</Label>
                      <Select 
                        value={newTrip.bikeType} 
                        onValueChange={(value: 'Royal Enfield' | 'KTM' | 'Himalayan' | 'Any') => 
                          setNewTrip({...newTrip, bikeType: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bike Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Royal Enfield">Royal Enfield</SelectItem>
                          <SelectItem value="KTM">KTM</SelectItem>
                          <SelectItem value="Himalayan">Himalayan</SelectItem>
                          <SelectItem value="Any">Any Bike</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fitness Level Required *</Label>
                    <Select 
                      value={newTrip.fitnessLevel} 
                      onValueChange={(value: 'Basic' | 'Moderate' | 'High') => 
                        setNewTrip({...newTrip, fitnessLevel: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Fitness Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Dates and Group Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Schedule & Group</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newTrip.startDate}
                        onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newTrip.endDate}
                        onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minGroupSize">Min Group Size</Label>
                      <Input
                        id="minGroupSize"
                        type="number"
                        min="1"
                        value={newTrip.groupSize.min}
                        onChange={(e) => setNewTrip({
                          ...newTrip, 
                          groupSize: { ...newTrip.groupSize, min: parseInt(e.target.value) || 1 }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxGroupSize">Max Group Size</Label>
                      <Input
                        id="maxGroupSize"
                        type="number"
                        min="1"
                        value={newTrip.groupSize.max}
                        onChange={(e) => setNewTrip({
                          ...newTrip, 
                          groupSize: { ...newTrip.groupSize, max: parseInt(e.target.value) || 10 }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minAge">Min Age</Label>
                      <Input
                        id="minAge"
                        type="number"
                        min="16"
                        max="70"
                        value={newTrip.ageRestriction.min}
                        onChange={(e) => setNewTrip({
                          ...newTrip, 
                          ageRestriction: { ...newTrip.ageRestriction, min: parseInt(e.target.value) || 18 }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAge">Max Age</Label>
                      <Input
                        id="maxAge"
                        type="number"
                        min="16"
                        max="70"
                        value={newTrip.ageRestriction.max}
                        onChange={(e) => setNewTrip({
                          ...newTrip, 
                          ageRestriction: { ...newTrip.ageRestriction, max: parseInt(e.target.value) || 65 }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Pricing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        min="0"
                        value={newTrip.price.original}
                        onChange={(e) => setNewTrip({
                          ...newTrip, 
                          price: { ...newTrip.price, original: parseFloat(e.target.value) || 0 }
                        })}
                        placeholder="e.g., 51999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Discounted Price (₹) - Optional</Label>
                      <Input
                        id="discountedPrice"
                        type="number"
                        min="0"
                        value={newTrip.price.discounted || ''}
                        onChange={(e) => setNewTrip({
                          ...newTrip, 
                          price: { 
                            ...newTrip.price, 
                            discounted: e.target.value ? parseFloat(e.target.value) : 0 
                          }
                        })}
                        placeholder="e.g., 42999"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Highlights */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Trip Highlights</h3>
                  
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add a trip highlight..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (newHighlight.trim()) {
                            setNewTrip({
                              ...newTrip, 
                              highlights: [...newTrip.highlights, newHighlight.trim()]
                            })
                            setNewHighlight('')
                          }
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        if (newHighlight.trim()) {
                          setNewTrip({
                            ...newTrip, 
                            highlights: [...newTrip.highlights, newHighlight.trim()]
                          })
                          setNewHighlight('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {newTrip.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" 
                        onClick={() => setNewTrip({
                          ...newTrip, 
                          highlights: newTrip.highlights.filter((_, i) => i !== index)
                        })}
                      >
                        {highlight} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Inclusions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">What's Included</h3>
                  
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      placeholder="Add what's included..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (newInclusion.trim()) {
                            setNewTrip({
                              ...newTrip, 
                              inclusions: [...newTrip.inclusions, newInclusion.trim()]
                            })
                            setNewInclusion('')
                          }
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        if (newInclusion.trim()) {
                          setNewTrip({
                            ...newTrip, 
                            inclusions: [...newTrip.inclusions, newInclusion.trim()]
                          })
                          setNewInclusion('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {newTrip.inclusions.map((inclusion, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer" 
                        onClick={() => setNewTrip({
                          ...newTrip, 
                          inclusions: newTrip.inclusions.filter((_, i) => i !== index)
                        })}
                      >
                        ✓ {inclusion} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Exclusions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">What's Not Included</h3>
                  
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newExclusion}
                      onChange={(e) => setNewExclusion(e.target.value)}
                      placeholder="Add what's not included..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (newExclusion.trim()) {
                            setNewTrip({
                              ...newTrip, 
                              exclusions: [...newTrip.exclusions, newExclusion.trim()]
                            })
                            setNewExclusion('')
                          }
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        if (newExclusion.trim()) {
                          setNewTrip({
                            ...newTrip, 
                            exclusions: [...newTrip.exclusions, newExclusion.trim()]
                          })
                          setNewExclusion('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {newTrip.exclusions.map((exclusion, index) => (
                      <Badge key={index} variant="destructive" className="cursor-pointer" 
                        onClick={() => setNewTrip({
                          ...newTrip, 
                          exclusions: newTrip.exclusions.filter((_, i) => i !== index)
                        })}
                      >
                        ✗ {exclusion} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Documents Required */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Required Documents</h3>
                  
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      placeholder="Add required document..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (newDocument.trim()) {
                            setNewTrip({
                              ...newTrip, 
                              documentsRequired: [...newTrip.documentsRequired, newDocument.trim()]
                            })
                            setNewDocument('')
                          }
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        if (newDocument.trim()) {
                          setNewTrip({
                            ...newTrip, 
                            documentsRequired: [...newTrip.documentsRequired, newDocument.trim()]
                          })
                          setNewDocument('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {newTrip.documentsRequired.map((doc, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer" 
                        onClick={() => setNewTrip({
                          ...newTrip, 
                          documentsRequired: newTrip.documentsRequired.filter((_, i) => i !== index)
                        })}
                      >
                        📋 {doc} ×
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Common documents: Valid driving license, Government ID proof, Medical fitness certificate, Inner Line Permit
                  </div>
                </div>

                <Separator />

                {/* Support Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Support Services</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Professional Safety Provider</Label>
                        <p className="text-sm text-muted-foreground">Basic safety measures included</p>
                      </div>
                      <Switch
                        checked={newTrip.safeProv}
                        onCheckedChange={(checked) => setNewTrip({...newTrip, safeProv: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Mechanic Support</Label>
                        <p className="text-sm text-muted-foreground">On-route bike maintenance</p>
                      </div>
                      <Switch
                        checked={newTrip.mechanicSupport}
                        onCheckedChange={(checked) => setNewTrip({...newTrip, mechanicSupport: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Medical Support</Label>
                        <p className="text-sm text-muted-foreground">First aid and emergency care</p>
                      </div>
                      <Switch
                        checked={newTrip.medicalSupport}
                        onCheckedChange={(checked) => setNewTrip({...newTrip, medicalSupport: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Backup Vehicle</Label>
                        <p className="text-sm text-muted-foreground">Emergency transportation</p>
                      </div>
                      <Switch
                        checked={newTrip.backupVehicle}
                        onCheckedChange={(checked) => setNewTrip({...newTrip, backupVehicle: checked})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Photos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Trip Photos</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Click to upload trip photos or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB each. First photo will be used as main image.</p>
                  </div>
                  {newTrip.gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {newTrip.gallery.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={photo} 
                            alt={`Trip ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setNewTrip({
                              ...newTrip, 
                              gallery: newTrip.gallery.filter((_, i) => i !== index)
                            })}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs bg-blue-500">Main</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Publishing Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Publishing Options</h3>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">Make trip publicly visible</Label>
                      <p className="text-sm text-muted-foreground">Allow others to discover and join your trip</p>
                    </div>
                    <Switch
                      checked={newTrip.isPublic}
                      onCheckedChange={(checked) => setNewTrip({...newTrip, isPublic: checked})}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={createGuidedTrip} className="flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Create Guided Trip</span>
                  </Button>
                  <Button variant="outline" onClick={resetNewTrip}>
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Guided Trips</h3>
              {guidedTrips.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No guided trips created yet</p>
                  </CardContent>
                </Card>
              ) : (
                guidedTrips.map((trip) => (
                  <Card key={trip.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{trip.name}</h3>
                            <Badge variant="outline">{trip.difficulty}</Badge>
                            <Badge variant="secondary">{trip.tripType}</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            📍 {trip.route} • {trip.region}
                          </p>
                          
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {trip.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              {trip.startDate} to {trip.endDate}
                            </span>
                            <span className="flex items-center">
                              <Users size={16} className="mr-1" />
                              {trip.currentParticipants}/{trip.groupSize.max} participants
                            </span>
                            <span className="flex items-center">
                              <DollarSign size={16} className="mr-1" />
                              ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm" title="Share Link">
                            <Share2 size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteGuidedTrip(trip.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-blue-600 font-medium">Distance</p>
                          <p className="text-xl font-bold text-blue-600">{trip.distance} km</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-green-600 font-medium">Duration</p>
                          <p className="text-lg font-bold text-green-600">{trip.duration}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-orange-600 font-medium">Difficulty</p>
                          <p className="text-lg font-bold text-orange-600">{trip.difficulty}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-purple-600 font-medium">Seats Left</p>
                          <p className="text-xl font-bold text-purple-600">
                            {trip.groupSize.max - trip.currentParticipants}
                          </p>
                        </div>
                      </div>

                      {trip.highlights.length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium mb-2 block">Trip Highlights:</Label>
                          <div className="flex flex-wrap gap-1">
                            {trip.highlights.slice(0, 4).map((highlight, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                            {trip.highlights.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{trip.highlights.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {trip.shareableLink && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <Label className="text-sm font-medium">Shareable Link:</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input 
                              value={trip.shareableLink} 
                              readOnly 
                              className="bg-white text-xs"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => {
                                navigator.clipboard.writeText(trip.shareableLink)
                                toast.success('Link copied to clipboard!')
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-card border-r shadow-sm">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold">User Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {userProfile.name}!
            </p>
          </div>
          
          <nav className="p-4">
            {sidebarMenus.map((menu) => {
              const Icon = menu.icon
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                    activeMenu === menu.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon size={20} />
                  <span>{menu.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}