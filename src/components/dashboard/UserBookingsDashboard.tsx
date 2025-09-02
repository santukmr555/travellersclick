import { useState, useEffect } from 'react'
import { User } from '@/App'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  CalendarToday, 
  LocationOn, 
  Schedule, 
  CreditCard, 
  Phone,
  Close,
  CheckCircle,
  Error,
  Timer,
  DirectionsCar,
  TwoWheeler,
  LocalShipping,
  Business
} from '@mui/icons-material'
import { availabilityService, BookingStatus } from '@/services/availabilityService'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface UserBookingsDashboardProps {
  currentUser: User
}

const getServiceIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'bike': return <TwoWheeler fontSize="small" />
    case 'car': return <DirectionsCar fontSize="small" />
    case 'campervan': return <LocalShipping fontSize="small" />
    case 'hotel': return <Business fontSize="small" />
    default: return <DirectionsCar fontSize="small" />
  }
}

const getStatusColor = (status: BookingStatus['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'confirmed': return 'bg-blue-100 text-blue-800'
    case 'active': return 'bg-green-100 text-green-800'
    case 'completed': return 'bg-purple-100 text-purple-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: BookingStatus['status']) => {
  switch (status) {
    case 'pending': return <Timer fontSize="small" />
    case 'confirmed': return <CheckCircle fontSize="small" />
    case 'active': return <CheckCircle fontSize="small" />
    case 'completed': return <CheckCircle fontSize="small" />
    case 'cancelled': return <Error fontSize="small" />
    default: return <Schedule fontSize="small" />
  }
}

export function UserBookingsDashboard({ currentUser }: UserBookingsDashboardProps) {
  const [bookings, setBookings] = useState<BookingStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    loadBookings()
  }, [currentUser.id])

  const loadBookings = async () => {
    try {
      const userBookings = await availabilityService.getUserBookings(currentUser.id)
      setBookings(userBookings.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()))
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await availabilityService.updateBookingStatus(bookingId, 'cancelled')
      toast.success('Booking cancelled successfully')
      setCancelling(null)
      setCancelReason('')
      loadBookings()
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  const filterBookings = (status: 'past' | 'current' | 'future') => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    return bookings.filter(booking => {
      const startDate = new Date(booking.startDate)
      const endDate = new Date(booking.endDate)

      switch (status) {
        case 'past':
          return endDate < now || booking.status === 'completed'
        case 'current':
          return startDate <= now && endDate >= now && booking.status === 'active'
        case 'future':
          return startDate > now && (booking.status === 'pending' || booking.status === 'confirmed')
        default:
          return true
      }
    })
  }

  const canCancelBooking = (booking: BookingStatus) => {
    const startDate = new Date(booking.startDate)
    const now = new Date()
    const hoursDiff = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    return hoursDiff > 24 && (booking.status === 'pending' || booking.status === 'confirmed')
  }

  const renderBookingCard = (booking: BookingStatus) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center space-x-2">
            {getServiceIcon(booking.serviceId)}
            <span className="capitalize">{booking.serviceId} Service</span>
          </CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CalendarToday fontSize="small" className="text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(booking.startDate), 'PPP')} - {format(new Date(booking.endDate), 'PPP')}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Schedule fontSize="small" className="text-muted-foreground" />
              <span className="text-sm">
                Duration: {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>

            {booking.realTimeLocation && (
              <div className="flex items-center space-x-2">
                <LocationOn fontSize="small" className="text-muted-foreground" />
                <span className="text-sm">
                  Current Location: {booking.realTimeLocation.lat.toFixed(4)}, {booking.realTimeLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="font-mono text-sm">{booking.id}</p>
            </div>

            <div className="flex justify-end space-x-2">
              {canCancelBooking(booking) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Close fontSize="small" className="mr-2" />
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Cancellation Reason</Label>
                        <Textarea
                          id="reason"
                          placeholder="Please provide a reason for cancellation..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="destructive" 
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={!cancelReason.trim()}
                        >
                          Confirm Cancellation
                        </Button>
                        <Button variant="outline">
                          Keep Booking
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Schedule className="mx-auto mb-4 text-muted-foreground animate-spin" style={{ fontSize: 48 }} />
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Bookings</h2>
        <p className="text-muted-foreground">
          Manage your travel bookings and view booking history
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="future">Upcoming ({filterBookings('future').length})</TabsTrigger>
          <TabsTrigger value="current">Active ({filterBookings('current').length})</TabsTrigger>
          <TabsTrigger value="past">Past ({filterBookings('past').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CalendarToday className="mx-auto mb-4 text-muted-foreground" style={{ fontSize: 48 }} />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground">
                    Start exploring our services to make your first booking!
                  </p>
                </CardContent>
              </Card>
            ) : (
              bookings.map(renderBookingCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="future" className="mt-6">
          <div className="space-y-4">
            {filterBookings('future').length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Timer className="mx-auto mb-4 text-muted-foreground" style={{ fontSize: 48 }} />
                  <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground">
                    Book your next adventure today!
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterBookings('future').map(renderBookingCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="current" className="mt-6">
          <div className="space-y-4">
            {filterBookings('current').length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="mx-auto mb-4 text-muted-foreground" style={{ fontSize: 48 }} />
                  <h3 className="text-lg font-semibold mb-2">No active bookings</h3>
                  <p className="text-muted-foreground">
                    You don't have any active bookings right now.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterBookings('current').map(renderBookingCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="space-y-4">
            {filterBookings('past').length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="mx-auto mb-4 text-muted-foreground" style={{ fontSize: 48 }} />
                  <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                  <p className="text-muted-foreground">
                    Your completed bookings will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterBookings('past').map(renderBookingCard)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}