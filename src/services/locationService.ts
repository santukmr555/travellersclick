// Enhanced Location service for GPS-based filtering with real-time tracking
import { mockStorage } from './mockStorage'

export interface Location {
  latitude: number
  longitude: number
}

export interface LocationResult {
  location: Location
  accuracy: number
  timestamp: string
}

export interface ServiceLocation {
  serviceId: string
  serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
  location: Location
  address: string
  pickupLocations?: string[]
  isActive: boolean
}

export interface GeofenceAlert {
  id: string
  serviceId: string
  type: 'pickup' | 'dropoff' | 'zone_exit' | 'zone_enter'
  location: Location
  radius: number // meters
  message: string
  triggeredAt: string
}

export class LocationService {
  private static instance: LocationService
  private cachedLocation: Location | null = null
  private watchId: number | null = null
  private serviceLocationsKey = 'service-locations'
  private geofenceAlertsKey = 'geofence-alerts'
  private locationHistoryKey = 'location-history'

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  async getCurrentLocation(): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          this.cachedLocation = location
          resolve({
            location,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          })
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000 // 1 minute for better accuracy
        }
      )
    })
  }

  /**
   * Enhanced location tracking with history
   */
  async trackUserLocation(userId: string, bookingId?: string): Promise<void> {
    try {
      const locationResult = await this.getCurrentLocation()
      
      // Store location history
      const locationHistory = await mockStorage.get<any[]>(this.locationHistoryKey) || []
      locationHistory.push({
        userId,
        bookingId,
        ...locationResult,
        timestamp: new Date().toISOString()
      })

      // Keep only last 1000 location points
      if (locationHistory.length > 1000) {
        locationHistory.splice(0, locationHistory.length - 1000)
      }

      await mockStorage.set(this.locationHistoryKey, locationHistory)
    } catch (error) {
      console.error('Error tracking user location:', error)
    }
  }

  /**
   * Get nearby services based on current location
   */
  async getNearbyServices(
    serviceType: ServiceLocation['serviceType'],
    radiusKm: number = 25,
    userLocation?: Location
  ): Promise<Array<ServiceLocation & { distance: number }>> {
    try {
      let location = userLocation
      if (!location) {
        const locationResult = await this.getCurrentLocation()
        location = locationResult.location
      }

      const allServiceLocations = await mockStorage.get<ServiceLocation[]>(this.serviceLocationsKey) || []
      const nearbyServices = allServiceLocations
        .filter(service => service.serviceType === serviceType && service.isActive)
        .map(service => ({
          ...service,
          distance: this.calculateDistance(
            location!.latitude,
            location!.longitude,
            service.location.latitude,
            service.location.longitude
          )
        }))
        .filter(service => service.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)

      return nearbyServices
    } catch (error) {
      console.error('Error getting nearby services:', error)
      return []
    }
  }

  /**
   * Register service location
   */
  async registerServiceLocation(serviceLocation: ServiceLocation): Promise<void> {
    try {
      const allServiceLocations = await mockStorage.get<ServiceLocation[]>(this.serviceLocationsKey) || []
      const existingIndex = allServiceLocations.findIndex(
        item => item.serviceId === serviceLocation.serviceId
      )

      if (existingIndex >= 0) {
        allServiceLocations[existingIndex] = serviceLocation
      } else {
        allServiceLocations.push(serviceLocation)
      }

      await mockStorage.set(this.serviceLocationsKey, allServiceLocations)
    } catch (error) {
      console.error('Error registering service location:', error)
      throw error
    }
  }

  /**
   * Create geofence alert
   */
  async createGeofenceAlert(alert: Omit<GeofenceAlert, 'id' | 'triggeredAt'>): Promise<string> {
    try {
      const geofenceAlert: GeofenceAlert = {
        ...alert,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        triggeredAt: new Date().toISOString()
      }

      const allAlerts = await mockStorage.get<GeofenceAlert[]>(this.geofenceAlertsKey) || []
      allAlerts.push(geofenceAlert)
      await mockStorage.set(this.geofenceAlertsKey, allAlerts)

      return geofenceAlert.id
    } catch (error) {
      console.error('Error creating geofence alert:', error)
      throw error
    }
  }

  /**
   * Check if location is within geofence
   */
  isWithinGeofence(location: Location, center: Location, radiusMeters: number): boolean {
    const distanceMeters = this.calculateDistance(
      location.latitude,
      location.longitude,
      center.latitude,
      center.longitude
    ) * 1000 // Convert km to meters

    return distanceMeters <= radiusMeters
  }

  /**
   * Get location permissions status
   */
  async getLocationPermissionStatus(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!navigator.permissions) {
      return 'prompt'
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      return permission.state
    } catch (error) {
      console.error('Error checking location permissions:', error)
      return 'prompt'
    }
  }

  /**
   * Request location permission with user-friendly messaging
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      await this.getCurrentLocation()
      return true
    } catch (error) {
      console.error('Location permission denied:', error)
      return false
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180)
  }

  watchLocation(callback: (location: Location) => void): number {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported')
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.cachedLocation = location
        callback(location)
      },
      (error) => {
        console.error('Location watch error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    )

    return this.watchId
  }

  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  getCachedLocation(): Location | null {
    return this.cachedLocation
  }

  // Get city coordinates (expanded mapping)
  getCityCoordinates(city: string): Location | null {
    const cityCoords: Record<string, Location> = {
      'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
      'Delhi': { latitude: 28.7041, longitude: 77.1025 },
      'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
      'Chennai': { latitude: 13.0827, longitude: 80.2707 },
      'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
      'Pune': { latitude: 18.5204, longitude: 73.8567 },
      'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
      'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
      'Jaipur': { latitude: 26.9124, longitude: 75.7873 },
      'Kochi': { latitude: 9.9312, longitude: 76.2673 },
      'Goa': { latitude: 15.2993, longitude: 74.1240 },
      'Manali': { latitude: 32.2396, longitude: 77.1887 },
      'Leh': { latitude: 34.1526, longitude: 77.5771 },
      'Udaipur': { latitude: 24.5854, longitude: 73.7125 }
    }
    return cityCoords[city] || null
  }

  // Get pickup location coordinates (expanded mapping)
  getPickupLocationCoordinates(location: string, city: string): Location | null {
    const locationCoords: Record<string, Record<string, Location>> = {
      'Mumbai': {
        'Andheri': { latitude: 19.1136, longitude: 72.8697 },
        'Bandra': { latitude: 19.0596, longitude: 72.8295 },
        'Powai': { latitude: 19.1197, longitude: 72.9073 },
        'Colaba': { latitude: 18.9067, longitude: 72.8147 },
        'Juhu': { latitude: 19.1075, longitude: 72.8263 },
        'Worli': { latitude: 19.0176, longitude: 72.8562 },
        'Malad': { latitude: 19.1840, longitude: 72.8440 },
        'Borivali': { latitude: 19.2307, longitude: 72.8567 }
      },
      'Delhi': {
        'CP': { latitude: 28.6304, longitude: 77.2177 },
        'Gurgaon': { latitude: 28.4595, longitude: 77.0266 },
        'Noida': { latitude: 28.5355, longitude: 77.3910 },
        'Dwarka': { latitude: 28.5921, longitude: 77.0460 },
        'Lajpat Nagar': { latitude: 28.5677, longitude: 77.2427 }
      },
      'Bangalore': {
        'Koramangala': { latitude: 12.9352, longitude: 77.6245 },
        'Whitefield': { latitude: 12.9698, longitude: 77.7500 },
        'Electronic City': { latitude: 12.8456, longitude: 77.6603 },
        'HSR Layout': { latitude: 12.9116, longitude: 77.6370 }
      }
    }
    return locationCoords[city]?.[location] || null
  }
}

export const locationService = LocationService.getInstance()