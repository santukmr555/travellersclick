import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { User } from '@/App'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarToday, Schedule, Person, Phone, LocationOn, AttachMoney } from '@mui/icons-material'

interface BookingsDashboardProps {
  currentUser: User
}

interface Booking {
  id: string
  serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
  serviceName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  bookingDate: string
  startDate: string
  endDate: string
  amount: number
  depositAmount: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  customerDocuments: string[]
}

const mockBookings: Booking[] = [
  {
    id: '1',
    serviceType: 'bike',
    serviceName: 'Honda Activa 6G',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 9876543210',
    customerAddress: 'Andheri, Mumbai',
    bookingDate: '2024-01-15',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    amount: 4000,
    depositAmount: 2000,
    status: 'upcoming',
    customerDocuments: ['Driving License', 'Aadhaar Card']
  },
  {
    id: '2',
    serviceType: 'car',
    serviceName: 'Tata Nexon',
    customerName: 'Priya Patel',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 8765432109',
    customerAddress: 'Bandra, Mumbai',
    bookingDate: '2024-01-10',
    startDate: '2024-01-18',
    endDate: '2024-01-20',
    amount: 5000,
    depositAmount: 3000,
    status: 'ongoing',
    customerDocuments: ['Driving License', 'PAN Card']
  },
  {
    id: '3',
    serviceType: 'bike',
    serviceName: 'Royal Enfield Classic 350',
    customerName: 'Amit Kumar',
    customerEmail: 'amit@example.com',
    customerPhone: '+91 7654321098',
    customerAddress: 'Powai, Mumbai',
    bookingDate: '2024-01-01',
    startDate: '2024-01-05',
    endDate: '2024-01-10',
    amount: 7500,
    depositAmount: 5000,
    status: 'completed',
    customerDocuments: ['Driving License', 'Voter ID']
  }
]

export function BookingsDashboard({ currentUser }: BookingsDashboardProps) {
  const [bookings, setBookings] = useLocalStorage<Booking[]>(`provider-bookings-${currentUser.id}`, mockBookings)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [sortBy, setSortBy] = useState('date')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default'
      case 'ongoing': return 'secondary'
      case 'completed': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'bike': return '🏍️'
      case 'car': return '🚗'
      case 'campervan': return '🚐'
      case 'hotel': return '🏨'
      default: return '📋'
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true
    return booking.status === activeTab
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      case 'amount':
        return b.amount - a.amount
      case 'customer':
        return a.customerName.localeCompare(b.customerName)
      default:
        return 0
    }
  })

  const handleCancelBooking = (bookingId: string, reason: string = 'Provider cancelled') => {
    setBookings(currentBookings =>
      currentBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    )
  }

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    ongoing: bookings.filter(b => b.status === 'ongoing').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0),
    totalDeposits: bookings.reduce((sum, b) => sum + b.depositAmount, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Bookings Dashboard</h2>
        <p className="text-muted-foreground">
          Manage all your service bookings and customer interactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <CalendarToday className="text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-3xl font-bold">{stats.upcoming}</p>
              </div>
              <Schedule className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <Badge className="h-6 w-6 rounded-full p-0 bg-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <AttachMoney className="text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({stats.upcoming})</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing ({stats.ongoing})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="amount">Sort by Amount</SelectItem>
            <SelectItem value="customer">Sort by Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      {sortedBookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarToday fontSize="large" className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No bookings found</p>
            <p className="text-muted-foreground">
              {activeTab === 'all' 
                ? 'You haven\'t received any bookings yet.'
                : `No ${activeTab} bookings at the moment.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedBookings.map((booking) => (
            <Card key={booking.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getServiceIcon(booking.serviceType)}</span>
                    <div>
                      <CardTitle className="text-lg">{booking.serviceName}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {booking.serviceType} service
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(booking.status)} className="capitalize">
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Person fontSize="small" className="mr-2 text-muted-foreground" />
                    <span className="font-medium">{booking.customerName}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone fontSize="small" className="mr-2" />
                    <span>{booking.customerPhone}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <LocationOn fontSize="small" className="mr-2" />
                    <span>{booking.customerAddress}</span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking Date:</span>
                    <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Period:</span>
                    <span>
                      {new Date(booking.startDate).toLocaleDateString()} - 
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">₹{booking.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deposit:</span>
                    <span>₹{booking.depositAmount}</span>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Documents submitted:</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.customerDocuments.map((doc) => (
                      <Badge key={doc} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {booking.status === 'upcoming' && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full text-destructive hover:text-destructive"
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}