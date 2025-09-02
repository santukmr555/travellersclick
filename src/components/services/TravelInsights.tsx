import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, LocationOn, Group, Route } from '@mui/icons-material'
import { User } from '@/App'

interface TravelInsightsProps {
  currentUser: User | null
}

const insightsData = {
  mostTraveledDestinations: [
    { name: 'Goa', trips: 2456, growth: '+12%' },
    { name: 'Ladakh', trips: 1890, growth: '+25%' },
    { name: 'Kerala', trips: 1756, growth: '+8%' },
    { name: 'Rajasthan', trips: 1543, growth: '+15%' },
    { name: 'Himachal Pradesh', trips: 1234, growth: '+18%' }
  ],
  popularRoutes: [
    { route: 'Delhi → Manali', bookings: 856, type: 'Mountain' },
    { route: 'Mumbai → Goa', bookings: 743, type: 'Coastal' },
    { route: 'Bangalore → Coorg', bookings: 634, type: 'Hill Station' },
    { route: 'Chennai → Pondicherry', bookings: 521, type: 'Coastal' }
  ],
  trendingGroups: [
    { name: 'Himalayan Riders', members: 2456, category: 'Adventure' },
    { name: 'Coastal Cruisers', members: 1890, category: 'Leisure' },
    { name: 'Desert Wanderers', members: 1234, category: 'Cultural' },
    { name: 'Digital Nomads India', members: 987, category: 'Work Travel' }
  ],
  seasonalTrends: [
    { season: 'Winter (Dec-Feb)', bookings: 3456, popular: 'Goa, Kerala' },
    { season: 'Summer (Mar-May)', bookings: 2890, popular: 'Ladakh, Himachal' },
    { season: 'Monsoon (Jun-Sep)', bookings: 1234, popular: 'Rajasthan, Gujarat' },
    { season: 'Post-Monsoon (Oct-Nov)', bookings: 2345, popular: 'North East, Uttarakhand' }
  ]
}

export function TravelInsights({ currentUser }: TravelInsightsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Travel Insights</h1>
        <p className="text-muted-foreground">
          Discover trending destinations, popular routes, and travel patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Most Traveled Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LocationOn className="text-primary" fontSize="large" />
              Most Traveled Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsData.mostTraveledDestinations.map((destination, index) => (
                <div key={destination.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium">{destination.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{destination.trips} trips</span>
                    <Badge variant="outline" className="text-green-600">
                      {destination.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="text-accent" fontSize="large" />
              Most Popular Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsData.popularRoutes.map((route, index) => (
                <div key={route.route} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium block">{route.route}</span>
                      <span className="text-sm text-muted-foreground">{route.type}</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground">{route.bookings} bookings</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Groups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Group className="text-secondary" fontSize="large" />
              Trending Travel Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsData.trendingGroups.map((group, index) => (
                <div key={group.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium block">{group.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {group.category}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-muted-foreground">{group.members} members</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-green-600" fontSize="large" />
              Seasonal Travel Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsData.seasonalTrends.map((trend, index) => (
                <div key={trend.season} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{trend.season}</span>
                    <span className="text-muted-foreground">{trend.bookings} bookings</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Popular: </span>
                    {trend.popular}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary mb-2">15,000+</h3>
              <p className="text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-accent mb-2">2,500+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-secondary mb-2">150+</h3>
              <p className="text-muted-foreground">Destinations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-green-600 mb-2">4.8★</h3>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}