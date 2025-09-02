/**
 * Demo data initialization for TravellerClicks
 * Sets up sample data for testing advanced features
 */

import { locationService } from '@/services/locationService'
import { availabilityService } from '@/services/availabilityService'

export const initializeDemoData = async () => {
  console.log('Initializing TravellerClicks demo data...')

  try {
    // Initialize service locations for Mumbai
    const mumbaiServices = [
      {
        serviceId: '1',
        serviceType: 'bike' as const,
        location: { latitude: 19.1136, longitude: 72.8697 },
        address: 'Andheri West, Mumbai',
        pickupLocations: ['Andheri Station', 'Andheri Metro'],
        isActive: true
      },
      {
        serviceId: '2',
        serviceType: 'bike' as const,
        location: { latitude: 19.0596, longitude: 72.8295 },
        address: 'Bandra West, Mumbai',
        pickupLocations: ['Bandra Station', 'Linking Road'],
        isActive: true
      },
      {
        serviceId: '3',
        serviceType: 'bike' as const,
        location: { latitude: 19.1197, longitude: 72.9073 },
        address: 'Powai, Mumbai',
        pickupLocations: ['Powai Plaza', 'IIT Bombay'],
        isActive: true
      },
      {
        serviceId: '4',
        serviceType: 'bike' as const,
        location: { latitude: 19.0176, longitude: 72.8562 },
        address: 'Worli, Mumbai',
        pickupLocations: ['Worli Village', 'Atria Mall'],
        isActive: true
      }
    ]

    // Register service locations
    for (const service of mumbaiServices) {
      await locationService.registerServiceLocation(service)
    }

    // Initialize availability for services
    for (const service of mumbaiServices) {
      await availabilityService.initializeServiceAvailability(service.serviceId, service.serviceType)
    }

    // Add some sample booking data
    const sampleBookings = [
      {
        serviceId: '2',
        userId: 'user1',
        status: 'active' as const,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
      }
    ]

    for (const booking of sampleBookings) {
      try {
        await availabilityService.createBooking(booking)
      } catch (error) {
        console.error('Error creating sample booking:', error)
      }
    }

    console.log('Demo data initialized successfully!')
    return true
  } catch (error) {
    console.error('Error initializing demo data:', error)
    return false
  }
}

// Initialize demo data when service is imported (only in browser)
if (typeof window !== 'undefined') {
  // Delay initialization to ensure all services are ready
  setTimeout(() => {
    initializeDemoData()
  }, 2000)
}