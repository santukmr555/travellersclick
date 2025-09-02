import { useState } from 'react'
import { User } from '@/App'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Close, Upload } from '@mui/icons-material'
import { toast } from 'sonner'

interface AddServiceFormProps {
  serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
  currentUser: User
  onCancel: () => void
  onSave: (service: any) => void
}

const formFields = {
  bike: {
    title: 'Add New Bike Service',
    fields: [
      // Basic Information
      { name: 'name', label: 'Bike Name', type: 'text', category: 'basic' },
      { name: 'brand', label: 'Brand', type: 'select', options: ['Honda', 'Mahindra', 'Maruti Suzuki', 'Piaggio', 'Royal Enfield', 'Suzuki', 'Triumph', 'TVS', 'Yamaha'], category: 'basic' },
      { name: 'model', label: 'Model', type: 'text', category: 'basic' },
      { name: 'year', label: 'Make Year', type: 'select', options: Array.from({ length: 26 }, (_, i) => (2000 + i).toString()), category: 'basic' },
      
      // Technical Specifications
      { name: 'transmission', label: 'Transmission', type: 'select', options: ['gear', 'gearless'], category: 'technical' },
      { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['petrol', 'cng', 'cng-petrol', 'diesel', 'EV'], category: 'technical' },
      
      // Pricing
      { name: 'pricePerHour', label: 'Price Per Hour (₹)', type: 'number', category: 'pricing' },
      { name: 'pricePerDay', label: 'Price Per Day (₹)', type: 'number', category: 'pricing' },
      { name: 'pricePerWeek', label: 'Price Per Week (₹)', type: 'number', optional: true, category: 'pricing' },
      { name: 'pricePerMonth', label: 'Price Per Month (₹)', type: 'number', optional: true, category: 'pricing' },
      { name: 'safetyDeposit', label: 'Safety Deposit (₹)', type: 'number', category: 'pricing' },
      
      // Location & Availability  
      { name: 'city', label: 'City', type: 'select', options: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad', 'Goa', 'Manali', 'Udaipur'], category: 'location' },
      { name: 'pickupLocation', label: 'Pickup Location', type: 'text', placeholder: 'e.g., Andheri West, Koramangala', category: 'location' },
      { name: 'operatingHours', label: 'Operating Hours', type: 'text', placeholder: '6:00 AM - 10:00 PM', category: 'location' },
      { name: 'coordinates', label: 'GPS Coordinates', type: 'coordinates', placeholder: 'Lat: 19.1367, Lng: 72.8269', category: 'location' },
      
      // Documentation & Terms
      { name: 'documentsRequired', label: 'Documents Required', type: 'multitext', placeholder: 'Enter documents (one per line)', category: 'documentation' },
      { name: 'termsAndConditions', label: 'Terms and Conditions', type: 'textarea', category: 'documentation' },
      
      // Status
      { name: 'available', label: 'Available for Booking', type: 'checkbox', description: 'Toggle availability on/off', category: 'status' }
    ]
  },
  car: {
    title: 'Add New Car Service',
    fields: [
      // Basic Information
      { name: 'name', label: 'Car Name', type: 'text', placeholder: 'e.g., Tata Nexon', category: 'basic' },
      { name: 'brand', label: 'Brand', type: 'select', options: ['Tata', 'Mahindra', 'Maruti Suzuki', 'Honda', 'Hyundai', 'Toyota', 'Ford', 'Volkswagen', 'BMW', 'Audi', 'Kia', 'Nissan', 'Mercedes', 'Renault'], category: 'basic' },
      { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g., Nexon, Swift, i20', category: 'basic' },
      { name: 'year', label: 'Make Year', type: 'select', options: Array.from({ length: 26 }, (_, i) => (2000 + i).toString()), category: 'basic' },
      { name: 'carType', label: 'Car Type', type: 'select', options: ['hatchback', 'sedan', 'SUV', 'MUV', 'luxury'], category: 'basic' },

      // Technical Specifications
      { name: 'transmission', label: 'Transmission', type: 'select', options: ['manual', 'automatic'], category: 'technical' },
      { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['petrol', 'diesel', 'cng', 'hybrid', 'electric'], category: 'technical' },
      { name: 'seatingCapacity', label: 'Seating Capacity', type: 'select', options: ['4', '5', '6', '7', '8'], category: 'technical' },
      { name: 'baggageCapacity', label: 'Baggage Capacity', type: 'text', placeholder: 'e.g., 2 Large Bags, 1 Medium Bag', category: 'technical' },
      { name: 'features', label: 'Car Features', type: 'multitext', placeholder: 'Air Conditioning\nPower Steering\nMusic System\nGPS Navigation\nPower Windows\nCentral Locking', category: 'technical' },

      // Pricing & Availability
      { name: 'pricePerHour', label: 'Price Per Hour (₹)', type: 'number', placeholder: '120', category: 'pricing' },
      { name: 'pricePerDay', label: 'Price Per Day (₹)', type: 'number', placeholder: '2500', category: 'pricing' },
      { name: 'pricePerWeek', label: 'Price Per Week (₹)', type: 'number', placeholder: '16000', category: 'pricing' },
      { name: 'pricePerMonth', label: 'Price Per Month (₹)', type: 'number', placeholder: '60000', category: 'pricing' },
      { name: 'safetyDeposit', label: 'Security Deposit (₹)', type: 'number', placeholder: '5000', category: 'pricing' },
      { name: 'operatingHours', label: 'Operating Hours', type: 'text', placeholder: '6:00 AM - 11:00 PM', category: 'pricing' },

      // Location & Coordinates
      { name: 'city', label: 'City', type: 'select', options: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'], category: 'location' },
      { name: 'pickupLocation', label: 'Pickup Location', type: 'text', placeholder: 'e.g., Andheri West, Near Metro Station', category: 'location' },
      { name: 'coordinates', label: 'GPS Coordinates', type: 'coordinates', category: 'location' },

      // Documentation & Terms
      { name: 'documentsRequired', label: 'Documents Required', type: 'multitext', placeholder: 'Driving License (Valid)\nAadhar Card\nPAN Card\nSelf-Photo with License', category: 'documentation' },
      { name: 'termsAndConditions', label: 'Terms and Conditions', type: 'textarea', placeholder: 'Please read and agree to our terms and conditions before booking...', category: 'documentation' },

      // Status & Settings
      { name: 'available', label: 'Available for Booking', type: 'checkbox', description: 'Toggle availability on/off', category: 'status' }
    ]
  },
  campervan: {
    title: 'Add New Campervan Service',
    fields: [
      // Basic Information
      { name: 'name', label: 'Campervan Name', type: 'text', placeholder: 'e.g., Tata Adventure Van', category: 'basic' },
      { name: 'brand', label: 'Brand', type: 'select', options: ['Tata', 'Mahindra', 'Toyota', 'Ford', 'Iveco', 'Mercedes', 'Volkswagen', 'Kia', 'Hyundai', 'Ashok Leyland', 'BMW', 'Force', 'Eicher', 'Maruti Suzuki', 'Bajaj', 'Volvo', 'Scania', 'MAN', 'Renault'], category: 'basic' },
      { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g., Adventure Van, Explorer', category: 'basic' },
      { name: 'year', label: 'Make Year', type: 'select', options: Array.from({ length: 26 }, (_, i) => (2000 + i).toString()), category: 'basic' },
      { name: 'carType', label: 'Vehicle Type', type: 'select', options: ['SUV', 'hatchback', 'sedan'], category: 'basic' },

      // Technical Specifications
      { name: 'transmission', label: 'Transmission', type: 'select', options: ['manual', 'automatic'], category: 'technical' },
      { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['petrol', 'cng', 'cng-petrol', 'diesel', 'EV'], category: 'technical' },
      { name: 'seatingCapacity', label: 'Seating Capacity', type: 'select', options: ['4', '5', '6', '7'], category: 'technical' },
      { name: 'baggageCapacity', label: 'Baggage Capacity', type: 'text', placeholder: 'e.g., 3 Large Bags, 2 Medium Bags', category: 'technical' },
      { name: 'toiletType', label: 'Toilet Type', type: 'select', options: ['portable toilet', 'bathroom tent', 'wc with shower'], category: 'technical' },
      { name: 'showerType', label: 'Shower Type', type: 'select', options: ['inside shower', 'outside shower'], category: 'technical' },
      { name: 'amenities', label: 'Campervan Amenities', type: 'multitext', placeholder: 'TV\nFridge\nStudy Table\nDining Table\nKitchen\nAir Conditioning\nMusic System', category: 'technical' },

      // Pricing & Availability
      { name: 'pricePerHour', label: 'Price Per Hour (₹)', type: 'number', placeholder: '200', category: 'pricing' },
      { name: 'pricePerDay', label: 'Price Per Day (₹)', type: 'number', placeholder: '4000', category: 'pricing' },
      { name: 'pricePerWeek', label: 'Price Per Week (₹)', type: 'number', placeholder: '25000', category: 'pricing' },
      { name: 'pricePerMonth', label: 'Price Per Month (₹)', type: 'number', placeholder: '90000', category: 'pricing' },
      { name: 'safetyDeposit', label: 'Security Deposit (₹)', type: 'number', placeholder: '10000', category: 'pricing' },
      { name: 'operatingHours', label: 'Operating Hours', type: 'text', placeholder: '6:00 AM - 11:00 PM', category: 'pricing' },

      // Location & Coordinates
      { name: 'city', label: 'City', type: 'select', options: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'], category: 'location' },
      { name: 'pickupLocation', label: 'Pickup Location', type: 'text', placeholder: 'e.g., Andheri West, Near Metro Station', category: 'location' },
      { name: 'coordinates', label: 'GPS Coordinates', type: 'coordinates', category: 'location' },

      // Documentation & Terms
      { name: 'documentsRequired', label: 'Documents Required', type: 'multitext', placeholder: 'Driving License (Valid)\nAadhar Card\nPAN Card\nSelf-Photo with License\nAddress Proof', category: 'documentation' },
      { name: 'termsAndConditions', label: 'Terms and Conditions', type: 'textarea', placeholder: 'Please read and agree to our terms and conditions before booking...', category: 'documentation' },

      // Status & Settings
      { name: 'available', label: 'Available for Booking', type: 'checkbox', description: 'Toggle availability on/off', category: 'status' }
    ]
  },
  hotel: {
    title: 'Add New Nomad Hotel Service',
    fields: [
      // Basic Information
      { name: 'name', label: 'Property Name', type: 'text', placeholder: 'e.g., Cozy Apartment near Beach', category: 'basic' },
      { name: 'propertyType', label: 'Property Type', type: 'select', options: ['apartment', 'hotel', 'homestay', 'resort', 'capsule hotel', 'lodge', 'farm stay', 'villa', 'luxury tent', 'campground', 'vacation home'], category: 'basic' },
      { name: 'description', label: 'Property Description', type: 'textarea', placeholder: 'Describe the property, work amenities, unique features, and what makes it special for nomads...', category: 'basic' },
      { name: 'bedrooms', label: 'Bedrooms', type: 'select', options: ['1', '2', '3', '4', '5'], category: 'basic' },
      { name: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4'], category: 'basic' },

      // Room & Guest Details
      { name: 'bedPreference', label: 'Bed Type', type: 'select', options: ['single', 'double', 'queen', 'king'], category: 'accommodation' },
      { name: 'guestCapacity', label: 'Guest Capacity', type: 'select', options: ['1', '2', '3', '4', '5', '6', '8', '10'], category: 'accommodation' },
      { name: 'facilities', label: 'Hotel Facilities', type: 'multitext', placeholder: 'Parking\nFree WiFi\nRoom Service\nGym\nFamily Rooms\nElectric Charging\nSwimming Pool\nFireplace\nPets Allowed', category: 'accommodation' },
      { name: 'roomFacilities', label: 'Room Facilities', type: 'multitext', placeholder: 'Private Bathroom\nAir Conditioning\nBalcony\nSea View\nKitchen\nHot Tub\nMountain View\nTerrace\nRefrigerator\nWashing Machine\nTV\nMicrowave', category: 'accommodation' },

      // Pricing & Availability
      { name: 'pricePerDay', label: 'Price Per Night (₹)', type: 'number', placeholder: '3000', category: 'pricing' },
      { name: 'pricePerWeek', label: 'Price Per Week (₹)', type: 'number', placeholder: '18000', category: 'pricing' },
      { name: 'pricePerMonth', label: 'Price Per Month (₹)', type: 'number', placeholder: '65000', category: 'pricing' },
      { name: 'safetyDeposit', label: 'Security Deposit (₹)', type: 'number', placeholder: '5000', category: 'pricing' },
      { name: 'operatingHours', label: 'Check-in Hours', type: 'text', placeholder: '24/7 Check-in or 2:00 PM - 10:00 PM', category: 'pricing' },
      { name: 'minimumDuration', label: 'Minimum Stay', type: 'text', placeholder: '1 night, 3 days, 1 week', category: 'pricing' },
      { name: 'maximumDuration', label: 'Maximum Stay', type: 'text', placeholder: '6 months, 1 year', category: 'pricing' },

      // Location & Contact
      { name: 'city', label: 'City', type: 'select', options: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Goa', 'Manali', 'Udaipur', 'Jaipur', 'Rishikesh', 'Kerala'], category: 'location' },
      { name: 'location', label: 'Location/Area', type: 'text', placeholder: 'e.g., Anjuna, Koramangala, Bandra West', category: 'location' },
      { name: 'address', label: 'Full Address', type: 'textarea', placeholder: 'Complete address with landmarks for easy finding...', category: 'location' },
      { name: 'coordinates', label: 'GPS Coordinates', type: 'coordinates', category: 'location' },

      // Policies & Features
      { name: 'workFriendly', label: 'Work Friendly', type: 'checkbox', description: 'Suitable for remote work with dedicated workspace and good WiFi', category: 'policies' },
      { name: 'instantBook', label: 'Instant Book', type: 'checkbox', description: 'Allow guests to book instantly without approval', category: 'policies' },
      { name: 'cancellationPolicy', label: 'Cancellation Policy', type: 'select', options: ['Flexible', 'Moderate', 'Strict', 'Super Strict'], category: 'policies' },
      { name: 'termsAndConditions', label: 'Terms and Conditions', type: 'textarea', placeholder: 'House rules, check-in/out procedures, and other important policies...', category: 'policies' },

      // Status & Settings
      { name: 'available', label: 'Available for Booking', type: 'checkbox', description: 'Toggle availability on/off', category: 'status' }
    ]
  }
}

const amenities = {
  car: ['indoor sports', 'gym', 'swimming pool', 'tub bath', 'complimentary breakfast', 'study table', 'laptop work table'],
  campervan: ['tv', 'fridge', 'study table', 'dining table'],
  hotel: {
    facilities: ['parking', 'free wifi', 'room service', 'gym', 'family rooms', 'electric charging', 'swimming pool', 'fireplace', 'pets allowed'],
    roomFacilities: ['private bathroom', 'air conditioning', 'balcony', 'sea view', 'kitchen', 'hot tub', 'mountain view', 'terrace', 'refrigerator', 'washing machine', 'TV', 'cot', 'microwave', 'toilet', 'dishwasher', 'micro oven', 'shower']
  }
}

export function AddServiceForm({ serviceType, currentUser, onCancel, onSave }: AddServiceFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({
    available: true, // Default to available
    coordinates: { latitude: '', longitude: '' },
    features: [], // For car features array
    amenities: [], // For campervan amenities array
    facilities: [], // For hotel facilities array
    roomFacilities: [] // For hotel room facilities array
  })
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [selectedRoomFacilities, setSelectedRoomFacilities] = useState<string[]>([])
  const [documentsRequired, setDocumentsRequired] = useState<string[]>([])
  const [carFeatures, setCarFeatures] = useState<string[]>([]) // For car features
  const [campervanAmenities, setCampervanAmenities] = useState<string[]>([]) // For campervan amenities
  const [hotelFacilities, setHotelFacilities] = useState<string[]>([]) // For hotel facilities
  const [hotelRoomFacilities, setHotelRoomFacilities] = useState<string[]>([]) // For hotel room facilities
  const [availableDates, setAvailableDates] = useState<Set<number>>(new Set()) // For calendar availability
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const config = formFields[serviceType]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      const currentAmenities = prev || []
      return currentAmenities.includes(amenity) 
        ? currentAmenities.filter(a => a !== amenity)
        : [...currentAmenities, amenity]
    })
  }

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => {
      const currentFacilities = prev || []
      return currentFacilities.includes(facility) 
        ? currentFacilities.filter(f => f !== facility)
        : [...currentFacilities, facility]
    })
  }

  const toggleRoomFacility = (facility: string) => {
    setSelectedRoomFacilities(prev => {
      const currentFacilities = prev || []
      return currentFacilities.includes(facility) 
        ? currentFacilities.filter(f => f !== facility)
        : [...currentFacilities, facility]
    })
  }

  const toggleDateAvailability = (dateIndex: number) => {
    setAvailableDates(prev => {
      const newDates = new Set(prev)
      if (newDates.has(dateIndex)) {
        newDates.delete(dateIndex)
      } else {
        newDates.add(dateIndex)
      }
      return newDates
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const newService = {
        id: Math.random().toString(36).substr(2, 9),
        type: serviceType,
        ...formData,
        amenities: selectedAmenities,
        ...(serviceType === 'hotel' && {
          facilities: selectedFacilities,
          roomFacilities: selectedRoomFacilities
        }),
        images,
        available: formData.available !== false, // Default to true unless explicitly set to false
        bookingsCount: 0,
        rating: 0,
        dateAdded: new Date().toISOString().split('T')[0],
        availableDates: Array.from(availableDates) // Include availability calendar data
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(newService)
      toast.success('Service added successfully!')
    } catch (error) {
      toast.error('Failed to add service')
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case 'select':
        return (
          <Select onValueChange={(value) => handleInputChange(field.name, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'textarea':
        return (
          <Textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={4}
            className="resize-none"
          />
        )
      
      case 'multitext':
        return (
          <div>
            <Textarea
              value={field.name === 'documentsRequired' 
                ? documentsRequired.join('\n')
                : field.name === 'features' 
                  ? carFeatures.join('\n')
                : field.name === 'amenities'
                  ? campervanAmenities.join('\n')
                : field.name === 'facilities'
                  ? hotelFacilities.join('\n')
                : field.name === 'roomFacilities'
                  ? hotelRoomFacilities.join('\n')
                  : (formData[field.name] || []).join('\n')
              }
              onChange={(e) => {
                const items = e.target.value.split('\n').filter(item => item.trim())
                if (field.name === 'documentsRequired') {
                  setDocumentsRequired(items)
                  handleInputChange(field.name, items)
                } else if (field.name === 'features') {
                  setCarFeatures(items)
                  handleInputChange(field.name, items)
                } else if (field.name === 'amenities') {
                  setCampervanAmenities(items)
                  handleInputChange(field.name, items)
                } else if (field.name === 'facilities') {
                  setHotelFacilities(items)
                  handleInputChange(field.name, items)
                } else if (field.name === 'roomFacilities') {
                  setHotelRoomFacilities(items)
                  handleInputChange(field.name, items)
                } else {
                  handleInputChange(field.name, items)
                }
              }}
              placeholder={field.placeholder || `Enter each item on a new line`}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {field.name === 'documentsRequired' 
                ? 'Enter each document on a new line (e.g., Driving License, Aadhar Card, etc.)'
                : field.name === 'features'
                  ? 'Enter each feature on a new line (e.g., Air Conditioning, Power Steering, etc.)'
                : field.name === 'amenities'
                  ? 'Enter each amenity on a new line (e.g., TV, Fridge, Kitchen, etc.)'
                : field.name === 'facilities'
                  ? 'Enter each hotel facility on a new line (e.g., Parking, Free WiFi, Gym, etc.)'
                : field.name === 'roomFacilities'
                  ? 'Enter each room facility on a new line (e.g., Private Bathroom, AC, Balcony, etc.)'
                  : 'Enter each item on a new line'
              }
            </p>
          </div>
        )
      
      case 'coordinates':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Latitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates?.latitude || ''}
                onChange={(e) => handleInputChange('coordinates', {
                  ...formData.coordinates,
                  latitude: parseFloat(e.target.value) || ''
                })}
                placeholder="19.1367"
              />
            </div>
            <div>
              <Label className="text-xs">Longitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates?.longitude || ''}
                onChange={(e) => handleInputChange('coordinates', {
                  ...formData.coordinates,
                  longitude: parseFloat(e.target.value) || ''
                })}
                placeholder="72.8269"
              />
            </div>
          </div>
        )
      
      case 'number':
        return (
          <Input
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            min="0"
          />
        )
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleInputChange(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm">
              {field.description || field.label}
            </Label>
          </div>
        )
      
      default:
        return (
          <Input
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          />
        )
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
        <p className="text-muted-foreground">
          Fill in the details for your new {serviceType} service
        </p>
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {/* Images Upload */}
            <div className="space-y-3">
              <Label>Images</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-4 text-muted-foreground" style={{ fontSize: 48 }} />
                <p className="text-muted-foreground mb-2">Upload up to 10 images</p>
                <Button type="button" variant="outline">Choose Files</Button>
              </div>
            </div>

            {/* Form Fields */}
            {(serviceType === 'bike' || serviceType === 'car' || serviceType === 'campervan' || serviceType === 'hotel') ? (
              /* Bike, Car, Campervan & Hotel Services - Full Width Categorized Layout */
              <div className="w-full max-w-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  
                  {/* Basic Information */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-blue-600 border-b pb-2">
                      📝 Basic Information
                    </h3>
                    <div className="space-y-4">
                      {config.fields
                        .filter((field: any) => field.category === 'basic')
                        .map((field: any) => (
                          <div key={field.name}>
                            <Label className="text-sm font-medium">{field.label}</Label>
                            <div className="mt-1">{renderField(field)}</div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  {/* Technical Specifications / Room & Guest Details */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-green-600 border-b pb-2">
                      {serviceType === 'hotel' ? '🏨 Room & Guest Details' : '⚙️ Technical Specifications'}
                    </h3>
                    <div className="space-y-4">
                      {config.fields
                        .filter((field: any) => field.category === 'technical' || field.category === 'accommodation')
                        .map((field: any) => (
                          <div key={field.name}>
                            <Label className="text-sm font-medium">{field.label}</Label>
                            <div className="mt-1">{renderField(field)}</div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  {/* Pricing & Availability */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-purple-600 border-b pb-2">
                      💰 Pricing & Availability
                    </h3>
                    <div className="space-y-4">
                      {config.fields
                        .filter((field: any) => field.category === 'pricing')
                        .map((field: any) => (
                          <div key={field.name}>
                            <Label className="text-sm font-medium">{field.label}</Label>
                            <div className="mt-1">{renderField(field)}</div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  {/* Location & Coordinates */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-orange-600 border-b pb-2">
                      📍 Location & Coordinates
                    </h3>
                    <div className="space-y-4">
                      {config.fields
                        .filter((field: any) => field.category === 'location')
                        .map((field: any) => (
                          <div key={field.name}>
                            <Label className="text-sm font-medium">{field.label}</Label>
                            <div className="mt-1">{renderField(field)}</div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  {/* Documentation & Terms / Policies & Features */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-red-600 border-b pb-2">
                      {serviceType === 'hotel' ? '📋 Policies & Features' : '📋 Documentation & Terms'}
                    </h3>
                    <div className="space-y-4">
                      {config.fields
                        .filter((field: any) => field.category === 'documentation' || field.category === 'policies')
                        .map((field: any) => (
                          <div key={field.name}>
                            <Label className="text-sm font-medium">{field.label}</Label>
                            <div className="mt-1">{renderField(field)}</div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  {/* Status & Settings */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-indigo-600 border-b pb-2">
                      ⚡ Status & Settings
                    </h3>
                    <div className="space-y-4">
                      {config.fields
                        .filter((field: any) => field.category === 'status')
                        .map((field: any) => (
                          <div key={field.name}>
                            <Label className="text-sm font-medium">{field.label}</Label>
                            <div className="mt-1">{renderField(field)}</div>
                          </div>
                        ))}
                    </div>
                  </Card>

                </div>
              </div>
            ) : (
              /* Other Services - Standard Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label>
                      {field.label} 
                      {field.optional && <span className="text-muted-foreground text-sm"> (Optional)</span>}
                    </Label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            )}

            {/* Amenities */}
            {serviceType === 'hotel' ? (
              <>
                {/* Hotel Facilities */}
                <div className="space-y-3">
                  <Label>Hotel Facilities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities.hotel.facilities.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={(selectedFacilities || []).includes(facility)}
                          onCheckedChange={() => toggleFacility(facility)}
                        />
                        <Label htmlFor={facility} className="text-sm capitalize">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {selectedFacilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedFacilities.map((facility) => (
                        <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                          {facility}
                          <Close 
                            fontSize="small" 
                            className="cursor-pointer" 
                            onClick={() => toggleFacility(facility)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Room Facilities */}
                <div className="space-y-3">
                  <Label>Room Facilities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities.hotel.roomFacilities.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={(selectedRoomFacilities || []).includes(facility)}
                          onCheckedChange={() => toggleRoomFacility(facility)}
                        />
                        <Label htmlFor={facility} className="text-sm capitalize">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {selectedRoomFacilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedRoomFacilities.map((facility) => (
                        <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                          {facility}
                          <Close 
                            fontSize="small" 
                            className="cursor-pointer" 
                            onClick={() => toggleRoomFacility(facility)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Other service types amenities */
              amenities[serviceType as keyof typeof amenities] && (
                <div className="space-y-3">
                  <Label>Amenities (Checkboxes)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(amenities[serviceType as keyof typeof amenities] as string[]).map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={(selectedAmenities || []).includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-sm capitalize">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {selectedAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedAmenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                          {amenity}
                          <Close 
                            fontSize="small" 
                            className="cursor-pointer" 
                            onClick={() => toggleAmenity(amenity)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}

            {/* Availability Calendar - For Bike, Car, Campervan and Hotel */}
            {(serviceType === 'bike' || serviceType === 'car' || serviceType === 'campervan' || serviceType === 'hotel') && (
              <div className="space-y-3">
                <Label>Availability Calendar</Label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    Mark the dates when your {
                      serviceType === 'bike' ? 'bike' : 
                      serviceType === 'car' ? 'car' : 
                      serviceType === 'campervan' ? 'campervan' : 
                      'property'
                    } is available for booking. 
                    You can update this calendar anytime from your dashboard.
                  </p>
                  
                  {/* Calendar Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-sm">Current Month</h4>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        <span>Unavailable</span>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    <div className="font-medium py-2 text-gray-600">Sun</div>
                    <div className="font-medium py-2 text-gray-600">Mon</div>
                    <div className="font-medium py-2 text-gray-600">Tue</div>
                    <div className="font-medium py-2 text-gray-600">Wed</div>
                    <div className="font-medium py-2 text-gray-600">Thu</div>
                    <div className="font-medium py-2 text-gray-600">Fri</div>
                    <div className="font-medium py-2 text-gray-600">Sat</div>
                    
                    {/* Calendar Days */}
                    {Array.from({ length: 35 }, (_, i) => {
                      const isAvailable = availableDates.has(i + 1)
                      return (
                        <Button
                          key={i}
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`h-8 w-8 p-0 text-xs transition-colors ${
                            isAvailable 
                              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleDateAvailability(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Click on dates to toggle availability. Green = Available, Gray = Unavailable
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          // Mark all dates as available
                          setAvailableDates(new Set(Array.from({ length: 35 }, (_, i) => i + 1)))
                        }}
                      >
                        Select All Available
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          // Clear all selected dates
                          setAvailableDates(new Set())
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Adding...' : 'Add Service'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}