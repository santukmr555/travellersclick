import { User } from '@/App'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, AttachMoney, CalendarToday, Star, Group } from '@mui/icons-material'

interface ProviderInsightsProps {
  currentUser: User
  services: any[]
}

export function ProviderInsights({ currentUser, services }: ProviderInsightsProps) {
  const totalServices = services.length
  const activeServices = services.filter(s => s.available).length
  const totalBookings = services.reduce((sum, s) => sum + s.bookingsCount, 0)
  const avgRating = services.length > 0 
    ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1)
    : '0'

  const monthlyData = [
    { month: 'Jan', revenue: 25000, bookings: 12 },
    { month: 'Feb', revenue: 32000, bookings: 18 },
    { month: 'Mar', revenue: 28000, bookings: 15 },
    { month: 'Apr', revenue: 45000, bookings: 25 },
    { month: 'May', revenue: 38000, bookings: 20 },
    { month: 'Jun', revenue: 42000, bookings: 23 }
  ]

  const topPerformingServices = services
    .sort((a, b) => b.bookingsCount - a.bookingsCount)
    .slice(0, 5)

  const serviceTypeBreakdown = services.reduce((acc, service) => {
    acc[service.type] = (acc[service.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  const revenueGrowth = previousMonth 
    ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1)
    : '0'
  const bookingGrowth = previousMonth
    ? ((currentMonth.bookings - previousMonth.bookings) / previousMonth.bookings * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Insights</h2>
        <p className="text-muted-foreground">
          Track your performance and identify growth opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{currentMonth.revenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {Number(revenueGrowth) >= 0 ? (
                    <TrendingUp fontSize="small" className="text-green-500 mr-1" />
                  ) : (
                    <TrendingDown fontSize="small" className="text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${Number(revenueGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {revenueGrowth}%
                  </span>
                </div>
              </div>
              <AttachMoney fontSize="large" className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Bookings</p>
                <p className="text-2xl font-bold">{currentMonth.bookings}</p>
                <div className="flex items-center mt-1">
                  {Number(bookingGrowth) >= 0 ? (
                    <TrendingUp fontSize="small" className="text-green-500 mr-1" />
                  ) : (
                    <TrendingDown fontSize="small" className="text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${Number(bookingGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {bookingGrowth}%
                  </span>
                </div>
              </div>
              <CalendarToday fontSize="large" className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{avgRating}/5</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {totalBookings} reviews
                </p>
              </div>
              <Star fontSize="large" className="text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold">{activeServices}/{totalServices}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((activeServices / Math.max(totalServices, 1)) * 100)}% active
                </p>
              </div>
              <Group fontSize="large" className="text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">₹{data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingServices.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No services available</p>
              ) : (
                topPerformingServices.map((service, index) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{service.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{service.bookingsCount} bookings</p>
                      <p className="text-sm text-muted-foreground">₹{service.pricePerDay}/day</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Service Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(serviceTypeBreakdown).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{type} services</p>
                <Badge variant="outline" className="mt-2">
                  {Math.round((count / totalServices) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {avgRating && Number(avgRating) < 4.0 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Star fontSize="small" className="text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Improve Service Quality</p>
                  <p className="text-sm text-muted-foreground">
                    Your average rating is {avgRating}/5. Focus on customer satisfaction to improve ratings.
                  </p>
                </div>
              </div>
            )}
            
            {activeServices < totalServices && (
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp fontSize="small" className="text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Activate More Services</p>
                  <p className="text-sm text-muted-foreground">
                    You have {totalServices - activeServices} inactive services. Activate them to increase bookings.
                  </p>
                </div>
              </div>
            )}

            {totalServices < 5 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Group fontSize="small" className="text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Expand Your Portfolio</p>
                  <p className="text-sm text-muted-foreground">
                    Consider adding more services to attract diverse customers and increase revenue.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}