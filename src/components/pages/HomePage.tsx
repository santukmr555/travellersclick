import { TwoWheeler, DirectionsCar, Home, LocationOn, Group, MenuBook, Hotel, AccountBalance } from '@mui/icons-material'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ServiceType } from '@/App'

interface HomePageProps {
  onServiceSelect: (service: ServiceType) => void
}

const services = [
  {
    id: 'bikes' as const,
    title: 'Bike Rentals',
    description: 'Explore destinations on two wheels with our diverse fleet of motorcycles and scooters',
    icon: TwoWheeler,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    featured: '500+ Bikes Available'
  },
  {
    id: 'cars' as const,
    title: 'Car Rentals',
    description: 'Travel in comfort with our range of cars from economy to luxury vehicles',
    icon: DirectionsCar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    featured: '200+ Cars Ready'
  },
  {
    id: 'campervans' as const,
    title: 'Campervans',
    description: 'Take your home on the road with fully equipped campervan rentals',
    icon: Home,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    featured: '50+ Campervans'
  },
  {
    id: 'nomad' as const,
    title: 'Nomad Hotels',
    description: 'Digital nomad-friendly accommodations with work-friendly amenities',
    icon: LocationOn,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    featured: '1000+ Properties'
  },
  {
    id: 'pilgrimage' as const,
    title: 'Pilgrimage Tours',
    description: 'Sacred journeys to holy sites with expert guides and spiritual experiences',
    icon: AccountBalance,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    featured: '15+ Sacred Destinations'
  },
  {
    id: 'pilgrim-hotels' as const,
    title: 'Pilgrim Hotels',
    description: 'Comfortable accommodations near sacred temples across India',
    icon: Hotel,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    featured: '200+ Temple Hotels'
  },
  {
    id: 'trips' as const,
    title: 'Guided Bike Trips',
    description: 'Join experienced trip leaders on curated motorcycle adventures',
    icon: Group,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    featured: '25+ Active Trips'
  },
  {
    id: 'stories' as const,
    title: 'User Stories',
    description: 'Discover amazing travel experiences shared by fellow travelers',
    icon: MenuBook,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    featured: '100+ Stories Shared'
  }
]

export function HomePage({ onServiceSelect }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Adventure
            <span className="text-primary block">Starts Here</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Discover amazing destinations, rent vehicles, find accommodations, and connect with fellow travelers. 
            Everything you need for your perfect journey.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => onServiceSelect('bikes')}
          >
            Start Exploring
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything for Your Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From vehicles to accommodations, guided trips to user stories - 
              find everything you need in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card 
                  key={service.id} 
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
                  onClick={() => onServiceSelect(service.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${service.bgColor} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon style={{ fontSize: 32 }} className={service.color} />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-4">
                    <div className="bg-muted rounded-lg px-4 py-2 inline-block mb-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        {service.featured}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Explore {service.title}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose TravellerClicks?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-6">
                <span className="text-xl font-bold">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Providers</h3>
              <p className="text-muted-foreground">
                All our service providers are verified and reviewed by our community for your peace of mind.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground mb-6">
                <span className="text-xl font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book instantly with our streamlined process. No waiting, no hassle - just adventure.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground mb-6">
                <span className="text-xl font-bold">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Community</h3>
              <p className="text-muted-foreground">
                Connect with travelers worldwide, share stories, and discover hidden gems together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}