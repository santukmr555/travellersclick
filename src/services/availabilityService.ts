/**
 * Service for managing real-time availability tracking
 * Handles booking status, calendar updates, and availability checks
 */
import { mockStorage } from './mockStorage'

export interface AvailabilitySlot {
  date: string
  isAvailable: boolean
  bookingId?: string
  blockedReason?: string
}

export interface ServiceAvailability {
  serviceId: string
  serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
  availability: AvailabilitySlot[]
  lastUpdated: string
}

export interface BookingStatus {
  id: string
  serviceId: string
  userId: string
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  realTimeLocation?: {
    lat: number
    lng: number
    lastUpdated: string
  }
}

class AvailabilityService {
  private availabilityKey = 'service-availability'
  private bookingsKey = 'booking-status'

  /**
   * Get availability for a specific service
   */
  async getServiceAvailability(serviceId: string): Promise<ServiceAvailability | null> {
    try {
      const availabilityData = await mockStorage.get<ServiceAvailability[]>(this.availabilityKey) || []
      return availabilityData.find(item => item.serviceId === serviceId) || null
    } catch (error) {
      console.error('Error getting service availability:', error)
      return null
    }
  }

  /**
   * Update availability for a service
   */
  async updateServiceAvailability(serviceId: string, serviceType: ServiceAvailability['serviceType'], availability: AvailabilitySlot[]): Promise<void> {
    try {
      const allAvailability = await mockStorage.get<ServiceAvailability[]>(this.availabilityKey) || []
      const existingIndex = allAvailability.findIndex(item => item.serviceId === serviceId)

      const updatedAvailability: ServiceAvailability = {
        serviceId,
        serviceType,
        availability,
        lastUpdated: new Date().toISOString()
      }

      if (existingIndex >= 0) {
        allAvailability[existingIndex] = updatedAvailability
      } else {
        allAvailability.push(updatedAvailability)
      }

      await mockStorage.set(this.availabilityKey, allAvailability)
    } catch (error) {
      console.error('Error updating service availability:', error)
      throw error
    }
  }

  /**
   * Initialize availability calendar for new service (1 year ahead)
   */
  async initializeServiceAvailability(serviceId: string, serviceType: ServiceAvailability['serviceType']): Promise<void> {
    const availability: AvailabilitySlot[] = []
    const today = new Date()
    
    // Create 365 days of availability slots
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      availability.push({
        date: date.toISOString().split('T')[0],
        isAvailable: true
      })
    }

    await this.updateServiceAvailability(serviceId, serviceType, availability)
  }

  /**
   * Block dates for a booking
   */
  async blockDatesForBooking(serviceId: string, bookingId: string, startDate: string, endDate: string): Promise<void> {
    try {
      const serviceAvailability = await this.getServiceAvailability(serviceId)
      if (!serviceAvailability) return

      const start = new Date(startDate)
      const end = new Date(endDate)

      const updatedAvailability = serviceAvailability.availability.map(slot => {
        const slotDate = new Date(slot.date)
        if (slotDate >= start && slotDate <= end) {
          return {
            ...slot,
            isAvailable: false,
            bookingId,
            blockedReason: 'booking'
          }
        }
        return slot
      })

      await this.updateServiceAvailability(serviceId, serviceAvailability.serviceType, updatedAvailability)
    } catch (error) {
      console.error('Error blocking dates:', error)
      throw error
    }
  }

  /**
   * Release blocked dates (for cancelled bookings)
   */
  async releaseDates(serviceId: string, bookingId: string): Promise<void> {
    try {
      const serviceAvailability = await this.getServiceAvailability(serviceId)
      if (!serviceAvailability) return

      const updatedAvailability = serviceAvailability.availability.map(slot => {
        if (slot.bookingId === bookingId) {
          return {
            ...slot,
            isAvailable: true,
            bookingId: undefined,
            blockedReason: undefined
          }
        }
        return slot
      })

      await this.updateServiceAvailability(serviceId, serviceAvailability.serviceType, updatedAvailability)
    } catch (error) {
      console.error('Error releasing dates:', error)
      throw error
    }
  }

  /**
   * Check if dates are available
   */
  async checkAvailability(serviceId: string, startDate: string, endDate: string): Promise<boolean> {
    try {
      const serviceAvailability = await this.getServiceAvailability(serviceId)
      if (!serviceAvailability) return false

      const start = new Date(startDate)
      const end = new Date(endDate)

      return serviceAvailability.availability.every(slot => {
        const slotDate = new Date(slot.date)
        if (slotDate >= start && slotDate <= end) {
          return slot.isAvailable
        }
        return true
      })
    } catch (error) {
      console.error('Error checking availability:', error)
      return false
    }
  }

  /**
   * Get all bookings for a user
   */
  async getUserBookings(userId: string): Promise<BookingStatus[]> {
    try {
      const allBookings = await spark.kv.get<BookingStatus[]>(this.bookingsKey) || []
      return allBookings.filter(booking => booking.userId === userId)
    } catch (error) {
      console.error('Error getting user bookings:', error)
      return []
    }
  }

  /**
   * Get all bookings for a service provider
   */
  async getProviderBookings(serviceIds: string[]): Promise<BookingStatus[]> {
    try {
      const allBookings = await spark.kv.get<BookingStatus[]>(this.bookingsKey) || []
      return allBookings.filter(booking => serviceIds.includes(booking.serviceId))
    } catch (error) {
      console.error('Error getting provider bookings:', error)
      return []
    }
  }

  /**
   * Create new booking
   */
  async createBooking(booking: Omit<BookingStatus, 'id'>): Promise<string> {
    try {
      const bookingId = Math.random().toString(36).substr(2, 9)
      const newBooking: BookingStatus = {
        ...booking,
        id: bookingId
      }

      const allBookings = await spark.kv.get<BookingStatus[]>(this.bookingsKey) || []
      allBookings.push(newBooking)
      await spark.kv.set(this.bookingsKey, allBookings)

      // Block the dates for this booking
      await this.blockDatesForBooking(booking.serviceId, bookingId, booking.startDate, booking.endDate)

      return bookingId
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: BookingStatus['status'], location?: BookingStatus['realTimeLocation']): Promise<void> {
    try {
      const allBookings = await spark.kv.get<BookingStatus[]>(this.bookingsKey) || []
      const bookingIndex = allBookings.findIndex(booking => booking.id === bookingId)

      if (bookingIndex >= 0) {
        allBookings[bookingIndex] = {
          ...allBookings[bookingIndex],
          status,
          ...(location && { realTimeLocation: location })
        }
        await spark.kv.set(this.bookingsKey, allBookings)

        // If booking is cancelled, release the dates
        if (status === 'cancelled') {
          await this.releaseDates(allBookings[bookingIndex].serviceId, bookingId)
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  /**
   * Get real-time booking status
   */
  async getBookingStatus(bookingId: string): Promise<BookingStatus | null> {
    try {
      const allBookings = await spark.kv.get<BookingStatus[]>(this.bookingsKey) || []
      return allBookings.find(booking => booking.id === bookingId) || null
    } catch (error) {
      console.error('Error getting booking status:', error)
      return null
    }
  }

  /**
   * Get available dates for a service in a date range
   */
  async getAvailableDates(serviceId: string, startDate: string, endDate: string): Promise<string[]> {
    try {
      const serviceAvailability = await this.getServiceAvailability(serviceId)
      if (!serviceAvailability) return []

      const start = new Date(startDate)
      const end = new Date(endDate)

      return serviceAvailability.availability
        .filter(slot => {
          const slotDate = new Date(slot.date)
          return slotDate >= start && slotDate <= end && slot.isAvailable
        })
        .map(slot => slot.date)
    } catch (error) {
      console.error('Error getting available dates:', error)
      return []
    }
  }
}

export const availabilityService = new AvailabilityService()