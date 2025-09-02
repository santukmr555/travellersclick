/**
 * Enhanced Real-time Availability Tracking Service
 * Provides live tracking of vehicle/service availability with WebSocket-like updates
 */

import { locationService, Location } from './locationService'
import { mockStorage } from './mockStorage'

export interface RealTimeAvailabilityUpdate {
  serviceId: string
  serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
  status: 'available' | 'booked' | 'maintenance' | 'offline'
  location?: Location
  lastUpdated: string
  estimatedReturnTime?: string
  currentBookingId?: string
}

export interface AvailabilitySubscription {
  id: string
  userId: string
  serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
  filters: {
    city?: string
    maxDistance?: number
    userLocation?: Location
  }
  callback: (updates: RealTimeAvailabilityUpdate[]) => void
}

export interface LiveTrackingSession {
  bookingId: string
  serviceId: string
  userId: string
  status: 'active' | 'paused' | 'ended'
  startTime: string
  lastLocationUpdate: string
  currentLocation?: Location
  route: Location[]
  geofenceAlerts: string[]
}

class RealTimeAvailabilityService {
  private static instance: RealTimeAvailabilityService
  private subscriptions: Map<string, AvailabilitySubscription> = new Map()
  private updateInterval: number | null = null
  private trackingSessions: Map<string, LiveTrackingSession> = new Map()
  private availabilityUpdatesKey = 'realtime-availability'
  private trackingSessionsKey = 'tracking-sessions'

  static getInstance(): RealTimeAvailabilityService {
    if (!RealTimeAvailabilityService.instance) {
      RealTimeAvailabilityService.instance = new RealTimeAvailabilityService()
    }
    return RealTimeAvailabilityService.instance
  }

  /**
   * Subscribe to real-time availability updates
   */
  subscribeToAvailability(
    userId: string,
    serviceType: 'bike' | 'car' | 'campervan' | 'hotel',
    filters: AvailabilitySubscription['filters'],
    callback: (updates: RealTimeAvailabilityUpdate[]) => void
  ): string {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const subscription: AvailabilitySubscription = {
      id: subscriptionId,
      userId,
      serviceType,
      filters,
      callback
    }

    this.subscriptions.set(subscriptionId, subscription)
    
    // Start update interval if not running
    if (!this.updateInterval) {
      this.startUpdateInterval()
    }

    // Send initial update
    this.sendUpdateToSubscriber(subscription)

    return subscriptionId
  }

  /**
   * Unsubscribe from availability updates
   */
  unsubscribeFromAvailability(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId)
    
    // Stop interval if no active subscriptions
    if (this.subscriptions.size === 0 && this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  /**
   * Update service availability in real-time
   */
  async updateServiceStatus(
    serviceId: string,
    serviceType: 'bike' | 'car' | 'campervan' | 'hotel',
    status: RealTimeAvailabilityUpdate['status'],
    location?: Location,
    estimatedReturnTime?: string,
    currentBookingId?: string
  ): Promise<void> {
    try {
      const update: RealTimeAvailabilityUpdate = {
        serviceId,
        serviceType,
        status,
        location,
        lastUpdated: new Date().toISOString(),
        estimatedReturnTime,
        currentBookingId
      }

      // Store the update
      const allUpdates = await spark.kv.get<RealTimeAvailabilityUpdate[]>(this.availabilityUpdatesKey) || []
      const existingIndex = allUpdates.findIndex(u => u.serviceId === serviceId)
      
      if (existingIndex >= 0) {
        allUpdates[existingIndex] = update
      } else {
        allUpdates.push(update)
      }

      await spark.kv.set(this.availabilityUpdatesKey, allUpdates)

      // Notify all relevant subscribers
      this.notifySubscribers(update)
    } catch (error) {
      console.error('Error updating service status:', error)
    }
  }

  /**
   * Start live tracking session for a booking
   */
  async startLiveTracking(bookingId: string, serviceId: string, userId: string): Promise<string> {
    try {
      const locationResult = await locationService.getCurrentLocation()
      
      const session: LiveTrackingSession = {
        bookingId,
        serviceId,
        userId,
        status: 'active',
        startTime: new Date().toISOString(),
        lastLocationUpdate: new Date().toISOString(),
        currentLocation: locationResult.location,
        route: [locationResult.location],
        geofenceAlerts: []
      }

      this.trackingSessions.set(bookingId, session)
      
      // Store in persistent storage
      const allSessions = await spark.kv.get<LiveTrackingSession[]>(this.trackingSessionsKey) || []
      allSessions.push(session)
      await spark.kv.set(this.trackingSessionsKey, allSessions)

      // Start location tracking for this booking
      this.startLocationTracking(bookingId)

      return bookingId
    } catch (error) {
      console.error('Error starting live tracking:', error)
      throw error
    }
  }

  /**
   * Update location for active tracking session
   */
  async updateTrackingLocation(bookingId: string): Promise<void> {
    try {
      const session = this.trackingSessions.get(bookingId)
      if (!session || session.status !== 'active') return

      const locationResult = await locationService.getCurrentLocation()
      
      // Update session with new location
      session.currentLocation = locationResult.location
      session.lastLocationUpdate = locationResult.timestamp
      session.route.push(locationResult.location)

      // Keep route history reasonable (last 100 points)
      if (session.route.length > 100) {
        session.route = session.route.slice(-100)
      }

      // Update persistent storage
      const allSessions = await spark.kv.get<LiveTrackingSession[]>(this.trackingSessionsKey) || []
      const sessionIndex = allSessions.findIndex(s => s.bookingId === bookingId)
      if (sessionIndex >= 0) {
        allSessions[sessionIndex] = session
        await spark.kv.set(this.trackingSessionsKey, allSessions)
      }

      // Update service location status
      await this.updateServiceStatus(
        session.serviceId,
        'bike', // This should be dynamic based on service type
        'booked',
        locationResult.location,
        undefined,
        bookingId
      )
    } catch (error) {
      console.error('Error updating tracking location:', error)
    }
  }

  /**
   * End tracking session
   */
  async endLiveTracking(bookingId: string): Promise<void> {
    try {
      const session = this.trackingSessions.get(bookingId)
      if (!session) return

      session.status = 'ended'
      
      // Update persistent storage
      const allSessions = await spark.kv.get<LiveTrackingSession[]>(this.trackingSessionsKey) || []
      const sessionIndex = allSessions.findIndex(s => s.bookingId === bookingId)
      if (sessionIndex >= 0) {
        allSessions[sessionIndex] = session
        await spark.kv.set(this.trackingSessionsKey, allSessions)
      }

      // Remove from active sessions
      this.trackingSessions.delete(bookingId)

      // Mark service as available
      await this.updateServiceStatus(session.serviceId, 'bike', 'available')
    } catch (error) {
      console.error('Error ending live tracking:', error)
    }
  }

  /**
   * Get live tracking data for a booking
   */
  getLiveTrackingData(bookingId: string): LiveTrackingSession | null {
    return this.trackingSessions.get(bookingId) || null
  }

  /**
   * Get all available services in real-time
   */
  async getAvailableServicesRealTime(
    serviceType: 'bike' | 'car' | 'campervan' | 'hotel',
    userLocation?: Location,
    maxDistance: number = 25
  ): Promise<RealTimeAvailabilityUpdate[]> {
    try {
      const allUpdates = await spark.kv.get<RealTimeAvailabilityUpdate[]>(this.availabilityUpdatesKey) || []
      
      let availableServices = allUpdates.filter(
        update => update.serviceType === serviceType && update.status === 'available'
      )

      // Filter by distance if user location is provided
      if (userLocation) {
        availableServices = availableServices.filter(service => {
          if (!service.location) return true
          
          const distance = locationService.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            service.location.latitude,
            service.location.longitude
          )
          
          return distance <= maxDistance
        })

        // Sort by distance
        availableServices.sort((a, b) => {
          if (!a.location || !b.location) return 0
          
          const distanceA = locationService.calculateDistance(
            userLocation.latitude, userLocation.longitude,
            a.location.latitude, a.location.longitude
          )
          const distanceB = locationService.calculateDistance(
            userLocation.latitude, userLocation.longitude,
            b.location.latitude, b.location.longitude
          )
          
          return distanceA - distanceB
        })
      }

      return availableServices
    } catch (error) {
      console.error('Error getting available services:', error)
      return []
    }
  }

  /**
   * Predict service availability based on patterns
   */
  async predictAvailability(
    serviceId: string,
    targetDate: string
  ): Promise<{ probability: number; confidence: number }> {
    try {
      // This would use ML in a real app, for now simulate based on historical data
      const dayOfWeek = new Date(targetDate).getDay()
      
      // Higher availability on weekdays, lower on weekends
      const baseProbability = [0.9, 0.95, 0.95, 0.95, 0.95, 0.95, 0.85][dayOfWeek]
      
      // Add some randomness and seasonal factors
      const seasonalFactor = Math.random() * 0.1 - 0.05 // ±5%
      const probability = Math.max(0.1, Math.min(1.0, baseProbability + seasonalFactor))
      
      return {
        probability,
        confidence: 0.75 // 75% confidence in prediction
      }
    } catch (error) {
      console.error('Error predicting availability:', error)
      return { probability: 0.5, confidence: 0.1 }
    }
  }

  /**
   * Private method to start update interval
   */
  private startUpdateInterval(): void {
    this.updateInterval = setInterval(() => {
      this.processPeriodicUpdates()
    }, 30000) // Update every 30 seconds
  }

  /**
   * Process periodic updates for all subscriptions
   */
  private async processPeriodicUpdates(): Promise<void> {
    for (const subscription of this.subscriptions.values()) {
      await this.sendUpdateToSubscriber(subscription)
    }
  }

  /**
   * Send updates to a specific subscriber
   */
  private async sendUpdateToSubscriber(subscription: AvailabilitySubscription): Promise<void> {
    try {
      const updates = await this.getAvailableServicesRealTime(
        subscription.serviceType,
        subscription.filters.userLocation,
        subscription.filters.maxDistance
      )

      // Filter by city if specified
      let filteredUpdates = updates
      if (subscription.filters.city) {
        // This would need service data to match city - simplified for demo
        filteredUpdates = updates
      }

      subscription.callback(filteredUpdates)
    } catch (error) {
      console.error('Error sending update to subscriber:', error)
    }
  }

  /**
   * Notify all relevant subscribers about an update
   */
  private notifySubscribers(update: RealTimeAvailabilityUpdate): void {
    for (const subscription of this.subscriptions.values()) {
      if (subscription.serviceType === update.serviceType) {
        // Check if this update is relevant to the subscription filters
        let isRelevant = true
        
        if (subscription.filters.userLocation && update.location) {
          const distance = locationService.calculateDistance(
            subscription.filters.userLocation.latitude,
            subscription.filters.userLocation.longitude,
            update.location.latitude,
            update.location.longitude
          )
          
          isRelevant = distance <= (subscription.filters.maxDistance || 25)
        }

        if (isRelevant) {
          subscription.callback([update])
        }
      }
    }
  }

  /**
   * Start location tracking for a booking
   */
  private startLocationTracking(bookingId: string): void {
    const trackingInterval = setInterval(async () => {
      const session = this.trackingSessions.get(bookingId)
      if (!session || session.status !== 'active') {
        clearInterval(trackingInterval)
        return
      }

      await this.updateTrackingLocation(bookingId)
    }, 60000) // Update every minute during active booking
  }

  /**
   * Simulate real-time availability changes for demo
   */
  async simulateAvailabilityChanges(): Promise<void> {
    const serviceTypes: Array<'bike' | 'car' | 'campervan' | 'hotel'> = ['bike', 'car', 'campervan', 'hotel']
    const statuses: Array<RealTimeAvailabilityUpdate['status']> = ['available', 'booked', 'maintenance']

    // Simulate random availability changes
    setInterval(async () => {
      const randomServiceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const serviceId = `${randomServiceType}_${Math.floor(Math.random() * 50) + 1}`

      // Get random location in Mumbai for demo
      const baseLocation = locationService.getCityCoordinates('Mumbai')
      const randomLocation = baseLocation ? {
        latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.1,
        longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.1
      } : undefined

      await this.updateServiceStatus(
        serviceId,
        randomServiceType,
        randomStatus,
        randomLocation,
        randomStatus === 'booked' ? new Date(Date.now() + 3600000).toISOString() : undefined
      )
    }, 45000) // Update every 45 seconds
  }

  /**
   * Get availability statistics
   */
  async getAvailabilityStats(serviceType: 'bike' | 'car' | 'campervan' | 'hotel'): Promise<{
    total: number
    available: number
    booked: number
    maintenance: number
    offline: number
    utilizationRate: number
  }> {
    try {
      const allUpdates = await spark.kv.get<RealTimeAvailabilityUpdate[]>(this.availabilityUpdatesKey) || []
      const serviceUpdates = allUpdates.filter(update => update.serviceType === serviceType)

      const stats = {
        total: serviceUpdates.length,
        available: serviceUpdates.filter(u => u.status === 'available').length,
        booked: serviceUpdates.filter(u => u.status === 'booked').length,
        maintenance: serviceUpdates.filter(u => u.status === 'maintenance').length,
        offline: serviceUpdates.filter(u => u.status === 'offline').length,
        utilizationRate: 0
      }

      stats.utilizationRate = stats.total > 0 
        ? ((stats.booked / stats.total) * 100) 
        : 0

      return stats
    } catch (error) {
      console.error('Error getting availability stats:', error)
      return {
        total: 0, available: 0, booked: 0, maintenance: 0, offline: 0, utilizationRate: 0
      }
    }
  }

  /**
   * Get estimated wait time for service
   */
  async getEstimatedWaitTime(
    serviceType: 'bike' | 'car' | 'campervan' | 'hotel',
    location?: Location
  ): Promise<number> {
    try {
      const allUpdates = await spark.kv.get<RealTimeAvailabilityUpdate[]>(this.availabilityUpdatesKey) || []
      const bookedServices = allUpdates.filter(
        update => update.serviceType === serviceType && 
                  update.status === 'booked' &&
                  update.estimatedReturnTime
      )

      if (bookedServices.length === 0) {
        return 0 // No wait time if services are available
      }

      // Find the earliest return time
      const earliestReturn = bookedServices
        .map(service => new Date(service.estimatedReturnTime!))
        .sort((a, b) => a.getTime() - b.getTime())[0]

      const waitTimeMs = earliestReturn.getTime() - Date.now()
      return Math.max(0, Math.ceil(waitTimeMs / (1000 * 60))) // Return wait time in minutes
    } catch (error) {
      console.error('Error calculating wait time:', error)
      return 60 // Default to 60 minutes if calculation fails
    }
  }

  /**
   * Check service status by ID
   */
  async getServiceStatus(serviceId: string): Promise<RealTimeAvailabilityUpdate | null> {
    try {
      const allUpdates = await spark.kv.get<RealTimeAvailabilityUpdate[]>(this.availabilityUpdatesKey) || []
      return allUpdates.find(update => update.serviceId === serviceId) || null
    } catch (error) {
      console.error('Error getting service status:', error)
      return null
    }
  }

  /**
   * Bulk update multiple services (for provider dashboard)
   */
  async bulkUpdateServiceStatus(
    updates: Array<{
      serviceId: string
      serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
      status: RealTimeAvailabilityUpdate['status']
    }>
  ): Promise<void> {
    try {
      const allUpdates = await spark.kv.get<RealTimeAvailabilityUpdate[]>(this.availabilityUpdatesKey) || []

      for (const updateData of updates) {
        const existingIndex = allUpdates.findIndex(u => u.serviceId === updateData.serviceId)
        const update: RealTimeAvailabilityUpdate = {
          ...updateData,
          lastUpdated: new Date().toISOString()
        }

        if (existingIndex >= 0) {
          allUpdates[existingIndex] = { ...allUpdates[existingIndex], ...update }
        } else {
          allUpdates.push(update)
        }

        // Notify subscribers
        this.notifySubscribers(update)
      }

      await spark.kv.set(this.availabilityUpdatesKey, allUpdates)
    } catch (error) {
      console.error('Error bulk updating service status:', error)
      throw error
    }
  }
}

export const realTimeAvailabilityService = RealTimeAvailabilityService.getInstance()