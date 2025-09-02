import { useState } from 'react'
import { ServiceType, User } from '@/App'
import { BikeRentals } from '@/components/services/BikeRentals'
import { CarRentals } from '@/components/services/CarRentals'
import { CampervanRentals } from '@/components/services/CampervanRentals'
import { NomadHotels } from '@/components/services/NomadHotels'
import { BikeTrips } from '@/components/services/BikeTrips'
import { TravelStories } from '@/components/services/TravelStories'
import { TravelInsights } from '@/components/services/TravelInsights'
import { PilgrimageTours } from '@/components/services/PilgrimageTours'
import { PilgrimHotels } from '@/components/services/PilgrimHotels'

interface ServicePageProps {
  serviceType: ServiceType
  currentUser: User | null
  filterSidebarOpen: boolean
}

export function ServicePage({ serviceType, currentUser, filterSidebarOpen }: ServicePageProps) {
  const renderService = () => {
    switch (serviceType) {
      case 'bikes':
        return <BikeRentals currentUser={currentUser} filterSidebarOpen={filterSidebarOpen} />
      case 'cars':
        return <CarRentals currentUser={currentUser} filterSidebarOpen={filterSidebarOpen} />
      case 'campervans':
        return <CampervanRentals currentUser={currentUser} filterSidebarOpen={filterSidebarOpen} />
      case 'nomad':
        return <NomadHotels currentUser={currentUser} filterSidebarOpen={filterSidebarOpen} />
      case 'pilgrimage':
        return <PilgrimageTours currentUser={currentUser} filterSidebarOpen={filterSidebarOpen} />
      case 'pilgrim-hotels':
        return <PilgrimHotels currentUser={currentUser} />
      case 'trips':
        return <BikeTrips currentUser={currentUser} filterSidebarOpen={filterSidebarOpen} />
      case 'stories':
        return <TravelStories currentUser={currentUser} filterSidebarOpen={filterSidebarOpen} />
      case 'insights':
        return <TravelInsights currentUser={currentUser} />
      default:
        return <div>Service not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderService()}
    </div>
  )
}