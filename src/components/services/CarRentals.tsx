import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Box,
  Typography,
  Grid,
  Paper,
  Rating,
  Slider,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Avatar,
  Alert,
  CircularProgress,
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Stack,
  Container,
  ListItemIcon,
} from '@mui/material'
import {
  LocationOn,
  Star as StarIcon,
  Close,
  FilterList,
  ExpandMore,
  Schedule,
  LocalGasStation,
  Settings,
  CalendarToday,
  Search,
  MyLocation,
  Verified,
  TrendingUp,
  GpsFixed,
  DirectionsCar,
  Group,
  AirlineSeatReclineNormal,
  Luggage,
  ArrowBack,
  CheckCircle,
  Speed,
  Security,
  CarRental,
  Warning,
  Cancel,
  CreditCard,
  Payment,
  AccountBalance,
  AccessTime
} from '@mui/icons-material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { User } from '@/App'
import { locationService, Location } from '@/services/locationService'
import { BookingModal } from '@/components/booking/BookingModal'
import { NearMeButton } from '@/components/ui/NearMeButton'
import { toast } from 'sonner'

interface CarRentalsProps {
  currentUser: User | null
  filterSidebarOpen: boolean
}

interface CarFilters {
  city: string
  fromDateTime: Dayjs | null
  toDateTime: Dayjs | null
  pickupLocation: string[]
  transmission: string[]
  fuelType: string[]
  carType: string[]
  brands: string[]
  seatingCapacity: number[]
  makeYear: number[]
  priceRange: [number, number]
  nearMe: boolean
}

interface Car {
  id: string
  name: string
  model: string
  brand: string
  year: number
  transmission: string
  fuelType: string
  carType: string
  seatingCapacity: number
  pricePerHour: number
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  rating: number
  reviews: number
  trips: number
  safetyDeposit: number
  city: string
  pickupLocation: string
  operatingHours: string
  image: string
  images: string[]
  available: boolean
  coordinates: { latitude: number; longitude: number }
  providerId: string
  documentsRequired: string[]
  termsAndConditions: string
  baggageCapacity: string
  features: string[]
}

const mockCars: Car[] = [
  // Mumbai Cars
  {
    id: '1',
    name: 'Tata Nexon',
    brand: 'Tata',
    model: 'Nexon',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 120,
    pricePerDay: 2500,
    pricePerWeek: 16000,
    pricePerMonth: 60000,
    rating: 4.6,
    reviews: 89,
    trips: 145,
    safetyDeposit: 5000,
    city: 'Mumbai',
    pickupLocation: 'Andheri West',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.1367, longitude: 72.8269 },
    providerId: 'provider1',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Full fuel return policy. No smoking allowed.',
    baggageCapacity: '350L',
    features: ['AC', 'GPS', 'Bluetooth', 'ABS', 'Airbags']
  },
  {
    id: '2',
    name: 'Mahindra XUV300',
    brand: 'Mahindra',
    model: 'XUV300',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 140,
    pricePerDay: 3000,
    pricePerWeek: 19000,
    pricePerMonth: 70000,
    rating: 4.4,
    reviews: 67,
    trips: 98,
    safetyDeposit: 6000,
    city: 'Mumbai',
    pickupLocation: 'Bandra East',
    operatingHours: '7:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    providerId: 'provider2',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Fuel at same level on return. No modifications allowed.',
    baggageCapacity: '257L',
    features: ['AC', 'GPS', 'Sunroof', 'USB Charging', 'Airbags']
  },
  {
    id: '3',
    name: 'Maruti Swift',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'manual',
    carType: 'hatchback',
    seatingCapacity: 5,
    pricePerHour: 80,
    pricePerDay: 1800,
    pricePerWeek: 11000,
    pricePerMonth: 40000,
    rating: 4.3,
    reviews: 124,
    trips: 201,
    safetyDeposit: 3000,
    city: 'Mumbai',
    pickupLocation: 'Powai',
    operatingHours: '6:30 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.1176, longitude: 72.9060 },
    providerId: 'provider1',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Return with same fuel level. Late charges applicable.',
    baggageCapacity: '268L',
    features: ['AC', 'Music System', 'Power Steering']
  },
  // Delhi Cars
  {
    id: '4',
    name: 'Honda City',
    brand: 'Honda',
    model: 'City',
    year: 2022,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'sedan',
    seatingCapacity: 5,
    pricePerHour: 100,
    pricePerDay: 2200,
    pricePerWeek: 14000,
    pricePerMonth: 50000,
    rating: 4.5,
    reviews: 156,
    trips: 178,
    safetyDeposit: 4000,
    city: 'Delhi',
    pickupLocation: 'Connaught Place',
    operatingHours: '6:00 AM - 11:00 PM',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    providerId: 'provider3',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Professional use only. No night driving after 11 PM.',
    baggageCapacity: '506L',
    features: ['AC', 'GPS', 'Bluetooth', 'Reverse Camera', 'Airbags']
  },
  {
    id: '5',
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 150,
    pricePerDay: 3200,
    pricePerWeek: 20000,
    pricePerMonth: 75000,
    rating: 4.7,
    reviews: 203,
    trips: 156,
    safetyDeposit: 7000,
    city: 'Delhi',
    pickupLocation: 'Karol Bagh',
    operatingHours: '5:30 AM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6542, longitude: 77.1905 },
    providerId: 'provider4',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Premium SUV. GPS tracking enabled.',
    baggageCapacity: '433L',
    features: ['AC', 'GPS', 'Sunroof', 'Wireless Charging', 'Premium Audio']
  },
  // Bangalore Cars
  {
    id: '6',
    name: 'Toyota Innova Crysta',
    brand: 'Toyota',
    model: 'Innova Crysta',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'MUV',
    seatingCapacity: 7,
    pricePerHour: 180,
    pricePerDay: 3800,
    pricePerWeek: 24000,
    pricePerMonth: 90000,
    rating: 4.8,
    reviews: 87,
    trips: 95,
    safetyDeposit: 10000,
    city: 'Bangalore',
    pickupLocation: 'Koramangala',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    providerId: 'provider5',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Family vehicle - seat 7 people comfortably.',
    baggageCapacity: '300L',
    features: ['AC', 'GPS', 'Captain Chairs', 'Premium Interiors', 'Multiple USB Ports']
  },
  {
    id: '7',
    name: 'BMW 3 Series',
    brand: 'BMW',
    model: '3 Series',
    year: 2022,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'luxury',
    seatingCapacity: 5,
    pricePerHour: 300,
    pricePerDay: 6000,
    pricePerWeek: 38000,
    pricePerMonth: 140000,
    rating: 4.9,
    reviews: 34,
    trips: 28,
    safetyDeposit: 25000,
    city: 'Bangalore',
    pickupLocation: 'Whitefield',
    operatingHours: '8:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9698, longitude: 77.7500 },
    providerId: 'provider6',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Luxury vehicle - experienced drivers only.',
    baggageCapacity: '480L',
    features: ['Premium AC', 'GPS', 'Leather Seats', 'Harman Kardon Audio', 'Panoramic Sunroof']
  },
  // Chennai Cars
  {
    id: '8',
    name: 'Maruti Baleno',
    brand: 'Maruti Suzuki',
    model: 'Baleno',
    year: 2021,
    fuelType: 'petrol',
    transmission: 'manual',
    carType: 'hatchback',
    seatingCapacity: 5,
    pricePerHour: 85,
    pricePerDay: 1900,
    pricePerWeek: 12000,
    pricePerMonth: 42000,
    rating: 4.2,
    reviews: 76,
    trips: 89,
    safetyDeposit: 3500,
    city: 'Chennai',
    pickupLocation: 'T. Nagar',
    operatingHours: '6:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    providerId: 'provider7',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'City use only. No highway driving allowed.',
    baggageCapacity: '339L',
    features: ['AC', 'Music System', 'Power Windows', 'Central Locking']
  },
  {
    id: '9',
    name: 'Ford EcoSport',
    brand: 'Ford',
    model: 'EcoSport',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 110,
    pricePerDay: 2400,
    pricePerWeek: 15000,
    pricePerMonth: 55000,
    rating: 4.4,
    reviews: 98,
    trips: 67,
    safetyDeposit: 5000,
    city: 'Chennai',
    pickupLocation: 'Anna Nagar',
    operatingHours: '5:30 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0878, longitude: 80.2785 },
    providerId: 'provider8',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Compact SUV. Insurance included.',
    baggageCapacity: '346L',
    features: ['AC', 'GPS', 'Touchscreen', 'Reverse Parking Sensors']
  },
  // Kolkata Cars
  {
    id: '10',
    name: 'Volkswagen Polo',
    brand: 'Volkswagen',
    model: 'Polo',
    year: 2022,
    fuelType: 'petrol',
    transmission: 'manual',
    carType: 'hatchback',
    seatingCapacity: 5,
    pricePerHour: 95,
    pricePerDay: 2100,
    pricePerWeek: 13000,
    pricePerMonth: 48000,
    rating: 4.3,
    reviews: 145,
    trips: 78,
    safetyDeposit: 4000,
    city: 'Kolkata',
    pickupLocation: 'Park Street',
    operatingHours: '6:00 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    providerId: 'provider9',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'German engineering. Regular maintenance done.',
    baggageCapacity: '280L',
    features: ['AC', 'Music System', 'ABS', 'Power Steering']
  },
  // Hyderabad Cars
  {
    id: '11',
    name: 'Audi A4',
    brand: 'Audi',
    model: 'A4',
    year: 2021,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'luxury',
    seatingCapacity: 5,
    pricePerHour: 280,
    pricePerDay: 5500,
    pricePerWeek: 35000,
    pricePerMonth: 130000,
    rating: 4.8,
    reviews: 67,
    trips: 89,
    safetyDeposit: 20000,
    city: 'Hyderabad',
    pickupLocation: 'Banjara Hills',
    operatingHours: '6:30 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 17.3850, longitude: 78.4867 },
    providerId: 'provider10',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Premium luxury sedan. Chauffeur available.',
    baggageCapacity: '460L',
    features: ['Premium AC', 'GPS', 'Leather Seats', 'Bang & Olufsen Audio', 'Sunroof']
  },
  // Pune Cars
  {
    id: '12',
    name: 'Mahindra Scorpio',
    brand: 'Mahindra',
    model: 'Scorpio',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 7,
    pricePerHour: 130,
    pricePerDay: 2800,
    pricePerWeek: 18000,
    pricePerMonth: 65000,
    rating: 4.5,
    reviews: 89,
    trips: 45,
    safetyDeposit: 6000,
    city: 'Pune',
    pickupLocation: 'Koregaon Park',
    operatingHours: '6:00 AM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.5204, longitude: 73.8567 },
    providerId: 'provider11',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Rugged SUV perfect for long drives. Full insurance.',
    baggageCapacity: '203L',
    features: ['AC', 'GPS', '4WD', 'Hill Hold Assist', 'Touchscreen']
  },
  {
    id: '13',
    name: 'Honda Amaze',
    brand: 'Honda',
    model: 'Amaze',
    year: 2022,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'sedan',
    seatingCapacity: 5,
    pricePerHour: 90,
    pricePerDay: 2000,
    pricePerWeek: 12500,
    pricePerMonth: 45000,
    rating: 4.1,
    reviews: 234,
    trips: 156,
    safetyDeposit: 3500,
    city: 'Pune',
    pickupLocation: 'Shivaji Nagar',
    operatingHours: '6:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.5362, longitude: 73.8512 },
    providerId: 'provider12',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Compact sedan ideal for daily commute. Fuel efficient.',
    baggageCapacity: '420L',
    features: ['AC', 'Touchscreen', 'Reverse Camera', 'Cruise Control']
  },
  // Ahmedabad Cars
  {
    id: '14',
    name: 'Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'hatchback',
    seatingCapacity: 5,
    pricePerHour: 105,
    pricePerDay: 2300,
    pricePerWeek: 14500,
    pricePerMonth: 52000,
    rating: 4.6,
    reviews: 78,
    trips: 34,
    safetyDeposit: 4500,
    city: 'Ahmedabad',
    pickupLocation: 'Satellite',
    operatingHours: '7:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    providerId: 'provider13',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Premium hatchback with latest features.',
    baggageCapacity: '311L',
    features: ['AC', 'GPS', 'Touchscreen', 'Wireless Android Auto', 'Ambient Lighting']
  },
  {
    id: '15',
    name: 'Tata Harrier',
    brand: 'Tata',
    model: 'Harrier',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 160,
    pricePerDay: 3400,
    pricePerWeek: 21000,
    pricePerMonth: 78000,
    rating: 4.7,
    reviews: 167,
    trips: 123,
    safetyDeposit: 8000,
    city: 'Ahmedabad',
    pickupLocation: 'Navrangpura',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 23.0395, longitude: 72.5662 },
    providerId: 'provider14',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Large SUV perfect for family trips. Premium features.',
    baggageCapacity: '425L',
    features: ['AC', 'GPS', 'JBL Audio', 'Panoramic Sunroof', 'Drive Modes']
  },
  // Additional Premium Cars
  {
    id: '16',
    name: 'Maruti Dzire',
    brand: 'Maruti Suzuki',
    model: 'Dzire',
    year: 2021,
    fuelType: 'cng',
    transmission: 'manual',
    carType: 'sedan',
    seatingCapacity: 5,
    pricePerHour: 75,
    pricePerDay: 1700,
    pricePerWeek: 10500,
    pricePerMonth: 38000,
    rating: 4.0,
    reviews: 198,
    trips: 145,
    safetyDeposit: 3000,
    city: 'Delhi',
    pickupLocation: 'Lajpat Nagar',
    operatingHours: '6:00 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.5658, longitude: 77.2439 },
    providerId: 'provider15',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Eco-friendly CNG sedan. Lower running costs.',
    baggageCapacity: '378L',
    features: ['AC', 'Music System', 'Power Steering', 'CNG Kit']
  },
  {
    id: '17',
    name: 'Kia Seltos',
    brand: 'Kia',
    model: 'Seltos',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 145,
    pricePerDay: 3100,
    pricePerWeek: 19500,
    pricePerMonth: 72000,
    rating: 4.6,
    reviews: 45,
    trips: 23,
    safetyDeposit: 7000,
    city: 'Bangalore',
    pickupLocation: 'HSR Layout',
    operatingHours: '7:00 AM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9082, longitude: 77.6476 },
    providerId: 'provider16',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Modern SUV with latest technology. Connected features.',
    baggageCapacity: '433L',
    features: ['AC', 'GPS', '10.25" Touchscreen', 'Wireless Charging', 'UVO Connect']
  },
  {
    id: '18',
    name: 'Nissan Magnite',
    brand: 'Nissan',
    model: 'Magnite',
    year: 2022,
    fuelType: 'petrol',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 100,
    pricePerDay: 2200,
    pricePerWeek: 13500,
    pricePerMonth: 50000,
    rating: 4.2,
    reviews: 67,
    trips: 43,
    safetyDeposit: 4500,
    city: 'Chennai',
    pickupLocation: 'OMR',
    operatingHours: '6:30 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.8956, longitude: 80.2267 },
    providerId: 'provider17',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Compact SUV perfect for city and highway. Tech-loaded.',
    baggageCapacity: '336L',
    features: ['AC', 'GPS', '8" Touchscreen', 'Around View Monitor', 'Wireless Apple CarPlay']
  },
  {
    id: '19',
    name: 'Mercedes C-Class',
    brand: 'Mercedes',
    model: 'C-Class',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'luxury',
    seatingCapacity: 5,
    pricePerHour: 350,
    pricePerDay: 7000,
    pricePerWeek: 44000,
    pricePerMonth: 165000,
    rating: 4.9,
    reviews: 23,
    trips: 12,
    safetyDeposit: 30000,
    city: 'Mumbai',
    pickupLocation: 'Bandra Kurla Complex',
    operatingHours: '8:00 AM - 7:00 PM',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.0596, longitude: 72.8656 },
    providerId: 'provider18',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Ultra-luxury sedan. Chauffeur service available.',
    baggageCapacity: '455L',
    features: ['Premium AC', 'GPS', 'Massage Seats', 'Burmester Audio', 'MBUX Infotainment']
  },
  {
    id: '20',
    name: 'Renault Kwid',
    brand: 'Renault',
    model: 'Kwid',
    year: 2021,
    fuelType: 'petrol',
    transmission: 'manual',
    carType: 'hatchback',
    seatingCapacity: 5,
    pricePerHour: 70,
    pricePerDay: 1500,
    pricePerWeek: 9500,
    pricePerMonth: 35000,
    rating: 3.9,
    reviews: 89,
    trips: 67,
    safetyDeposit: 2500,
    city: 'Kolkata',
    pickupLocation: 'Salt Lake',
    operatingHours: '7:00 AM - 8:30 PM',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5958, longitude: 88.4497 },
    providerId: 'provider19',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Budget-friendly option. Perfect for city exploration.',
    baggageCapacity: '279L',
    features: ['AC', 'Digital Cluster', 'Touchscreen', 'Rear Parking Camera']
  }
]

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']
const transmissionTypes = ['manual', 'automatic']
const fuelTypes = ['petrol', 'diesel', 'cng', 'hybrid', 'electric']
const carTypes = ['hatchback', 'sedan', 'SUV', 'MUV', 'luxury']
const brands = ['Tata', 'Mahindra', 'Maruti Suzuki', 'Honda', 'Hyundai', 'Toyota', 'Ford', 'Volkswagen', 'BMW', 'Audi', 'Kia', 'Nissan', 'Mercedes', 'Renault']
const seatingCapacities = [4, 5, 6, 7, 8]
const makeYears = Array.from({ length: 26 }, (_, i) => 2000 + i)

// Helper functions for tabs
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export function CarRentals({ currentUser, filterSidebarOpen }: CarRentalsProps) {
  const [cars] = useLocalStorage<Car[]>('cars', mockCars)
  const [filters, setFilters] = useState<CarFilters>({
    city: '',
    fromDateTime: null,
    toDateTime: null,
    pickupLocation: [],
    transmission: [],
    fuelType: [],
    carType: [],
    brands: [],
    seatingCapacity: [],
    makeYear: [],
    priceRange: [1000, 10000],
    nearMe: false
  })
  
  const [sortBy, setSortBy] = useState('rating')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedCarForDetail, setSelectedCarForDetail] = useState<Car | null>(null)

  const pickupLocations = Array.from(new Set(cars.map(car => car.pickupLocation)))

  // Filter and sort cars based on current filters
  useEffect(() => {
    let result = cars.filter(car => {
      if (!car.available) return false
      
      // City filter
      if (filters.city && car.city !== filters.city) return false
      
      // Pickup location filter (OR logic)
      if (filters.pickupLocation.length > 0 && !filters.pickupLocation.includes(car.pickupLocation)) return false
      
      // Transmission filter (OR logic)
      if (filters.transmission.length > 0 && !filters.transmission.includes(car.transmission)) return false
      
      // Fuel type filter (OR logic)
      if (filters.fuelType.length > 0 && !filters.fuelType.includes(car.fuelType)) return false
      
      // Car type filter (OR logic)
      if (filters.carType.length > 0 && !filters.carType.includes(car.carType)) return false
      
      // Brand filter (OR logic)
      if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) return false
      
      // Seating capacity filter (OR logic)
      if (filters.seatingCapacity.length > 0 && !filters.seatingCapacity.includes(car.seatingCapacity)) return false
      
      // Year filter (OR logic)
      if (filters.makeYear.length > 0 && !filters.makeYear.includes(car.year)) return false
      
      // Price range filter
      const price = car.pricePerDay
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      
      return true
    })

    // Apply search terms within each filter category
    Object.entries(searchTerms).forEach(([category, term]) => {
      if (term) {
        switch (category) {
          case 'brands':
            result = result.filter(car => 
              car.brand.toLowerCase().includes(term.toLowerCase())
            )
            break
          case 'pickupLocation':
            result = result.filter(car => 
              car.pickupLocation.toLowerCase().includes(term.toLowerCase())
            )
            break
        }
      }
    })

    // Sort results
    result.sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case 'rating':
          aVal = a.rating
          bVal = b.rating
          break
        case 'reviews':
          aVal = a.reviews
          bVal = b.reviews
          break
        case 'cost':
          aVal = a.pricePerDay
          bVal = b.pricePerDay
          break
        case 'trips':
          aVal = a.trips
          bVal = b.trips
          break
        default:
          aVal = a.rating
          bVal = b.rating
      }
      
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })

    // Apply location-based sorting if nearMe is enabled
    if (filters.nearMe && userLocation) {
      result.sort((a, b) => {
        const distA = locationService.calculateDistance(
          userLocation.latitude, userLocation.longitude,
          a.coordinates.latitude, a.coordinates.longitude
        )
        const distB = locationService.calculateDistance(
          userLocation.latitude, userLocation.longitude,
          b.coordinates.latitude, b.coordinates.longitude
        )
        return distA - distB
      })
    }

    setFilteredCars(result)
  }, [cars, filters, sortBy, sortOrder, userLocation, searchTerms])

  const handleFilterChange = (category: keyof CarFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleMultiSelectFilter = (category: keyof CarFilters, value: string | number) => {
    setFilters(prev => {
      const currentValues = prev[category] as (string | number)[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [category]: newValues
      }
    })
  }

  const handleRemoveFilter = (category: keyof CarFilters, value?: string | number) => {
    if (value !== undefined) {
      handleMultiSelectFilter(category, value)
    } else {
      if (category === 'nearMe') {
        handleFilterChange('nearMe', false)
      } else if (category === 'priceRange') {
        handleFilterChange('priceRange', [1000, 10000])
      } else {
        handleFilterChange(category, category.includes('DateTime') ? null : '')
      }
    }
  }

  const handleNearMe = async () => {
    try {
      const location = await locationService.getCurrentLocation()
      setUserLocation(location as Location)
      handleFilterChange('nearMe', true)
    } catch (error) {
      console.error('Location access denied:', error)
    }
  }

  const handleSearchInFilter = (category: string, term: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [category]: term
    }))
  }

  const handleBookNow = (car: Car) => {
    setSelectedCarForDetail(car)
    setView('detail')
  }

  const getActiveFilterChips = () => {
    const chips: Array<{ label: string; category: keyof CarFilters; value?: string | number }> = []
    
    if (filters.city) chips.push({ label: `City: ${filters.city}`, category: 'city' })
    if (filters.fromDateTime) chips.push({ label: `From: ${filters.fromDateTime.format('DD/MM/YY HH:mm')}`, category: 'fromDateTime' })
    if (filters.toDateTime) chips.push({ label: `To: ${filters.toDateTime.format('DD/MM/YY HH:mm')}`, category: 'toDateTime' })
    if (filters.nearMe) chips.push({ label: 'Near Me', category: 'nearMe' })
    
    filters.pickupLocation.forEach(location => 
      chips.push({ label: `Pickup: ${location}`, category: 'pickupLocation', value: location })
    )
    filters.transmission.forEach(type => 
      chips.push({ label: `Transmission: ${type}`, category: 'transmission', value: type })
    )
    filters.fuelType.forEach(type => 
      chips.push({ label: `Fuel: ${type}`, category: 'fuelType', value: type })
    )
    filters.carType.forEach(type => 
      chips.push({ label: `Type: ${type}`, category: 'carType', value: type })
    )
    filters.brands.forEach(brand => 
      chips.push({ label: `Brand: ${brand}`, category: 'brands', value: brand })
    )
    filters.seatingCapacity.forEach(capacity => 
      chips.push({ label: `${capacity} seats`, category: 'seatingCapacity', value: capacity })
    )
    filters.makeYear.forEach(year => 
      chips.push({ label: `Year: ${year}`, category: 'makeYear', value: year })
    )
    
    if (filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 10000) {
      chips.push({ label: `Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`, category: 'priceRange' })
    }
    
    return chips
  }

  // Car Detail Page Component
  // Detailed Car View Component - New Structure
  const CarDetailPage = ({ car }: { car: Car }) => {
    // Import required components for inline booking
    const [bookingDetails, setBookingDetails] = useState({
      startDateTime: dayjs().add(1, 'hour'),
      endDateTime: dayjs().add(1, 'day'),
      rentType: 'days' as 'hours' | 'days' | 'weeks' | 'months',
      totalAmount: 0,
      securityDeposit: car.safetyDeposit,
    })
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card')
    const [paymentDetails, setPaymentDetails] = useState({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      upiId: '',
      bankAccount: ''
    })
    const [loading, setLoading] = useState(false)

    // Calculate amount based on rent type and duration
    const calculateAmount = () => {
      if (!bookingDetails.startDateTime || !bookingDetails.endDateTime) return 0
      
      const startTime = bookingDetails.startDateTime
      const endTime = bookingDetails.endDateTime
      
      let amount = 0
      if (bookingDetails.rentType === 'hours') {
        const hours = Math.ceil(endTime.diff(startTime, 'hour', true))
        amount = hours * car.pricePerHour
      } else if (bookingDetails.rentType === 'days') {
        const days = Math.ceil(endTime.diff(startTime, 'day', true))
        amount = days * car.pricePerDay
      } else if (bookingDetails.rentType === 'weeks') {
        const weeks = Math.ceil(endTime.diff(startTime, 'week', true))
        amount = weeks * car.pricePerWeek
      } else if (bookingDetails.rentType === 'months') {
        const months = Math.ceil(endTime.diff(startTime, 'month', true))
        amount = months * car.pricePerMonth
      }
      
      return Math.max(amount, 0)
    }

    // Update total amount when booking details change
    useEffect(() => {
      const amount = calculateAmount()
      setBookingDetails(prev => ({ ...prev, totalAmount: amount }))
    }, [bookingDetails.startDateTime, bookingDetails.endDateTime, bookingDetails.rentType])

    const handleCompleteBooking = async () => {
      if (!currentUser) {
        toast.error('Please login to complete booking')
        return
      }

      // Validate payment details
      if (paymentMethod === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardHolder) {
          toast.error('Please fill all card details')
          return
        }
      } else if (paymentMethod === 'upi') {
        if (!paymentDetails.upiId) {
          toast.error('Please enter UPI ID')
          return
        }
      } else if (paymentMethod === 'netbanking') {
        if (!paymentDetails.bankAccount) {
          toast.error('Please select bank')
          return
        }
      }

      setLoading(true)
      
      try {
        // Simulate booking process
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        toast.success('🎉 Car booking confirmed successfully!')
        setView('list')
        setSelectedCarForDetail(null)
      } catch (error) {
        toast.error('Booking failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box className="min-h-screen bg-background">
          {/* Header with back button */}
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              <IconButton
                edge="start"
                onClick={() => {
                  setView('list')
                  setSelectedCarForDetail(null)
                }}
                sx={{ mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {car.name}
              </Typography>
              <Chip 
                label={car.available ? "Available" : "Booked"} 
                color={car.available ? "success" : "error"}
                variant="outlined"
              />
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" className="py-6">
            {/* First Row: Car Image + Booking Panel */}
            <Box className="mb-8">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Left: Car Image */}
                <Card className="overflow-hidden">
                  <CardMedia
                    component="img"
                    height="400"
                    image={car.image}
                    alt={car.name}
                    className="object-cover"
                    sx={{ width: '100%', height: '400px' }}
                  />
                </Card>

                {/* Right: Booking Panel */}
                <Card>
                  <CardContent className="p-6">
                    <Typography variant="h5" className="font-bold mb-2">
                      Complete Your Car Booking
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-4">
                      Fill in the details below to book {car.brand} {car.model}
                    </Typography>

                    {/* Rental Period Selection */}
                    <Box className="mb-4">
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Rent Type</InputLabel>
                        <Select
                          value={bookingDetails.rentType}
                          label="Rent Type"
                          onChange={(e) => setBookingDetails(prev => ({ 
                            ...prev, 
                            rentType: e.target.value as any 
                          }))}
                        >
                          <MenuItem value="hours">Hourly (₹{car.pricePerHour}/hour)</MenuItem>
                          <MenuItem value="days">Daily (₹{car.pricePerDay}/day)</MenuItem>
                          <MenuItem value="weeks">Weekly (₹{car.pricePerWeek}/week)</MenuItem>
                          <MenuItem value="months">Monthly (₹{car.pricePerMonth}/month)</MenuItem>
                        </Select>
                      </FormControl>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <DateTimePicker
                          label="Start Date & Time"
                          value={bookingDetails.startDateTime}
                          onChange={(value) => setBookingDetails(prev => ({ 
                            ...prev, 
                            startDateTime: value || dayjs() 
                          }))}
                          slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                        <DateTimePicker
                          label="End Date & Time"
                          value={bookingDetails.endDateTime}
                          onChange={(value) => setBookingDetails(prev => ({ 
                            ...prev, 
                            endDateTime: value || dayjs().add(1, 'day') 
                          }))}
                          slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                      </div>
                    </Box>

                    <Divider className="my-4" />

                    {/* Payment Method Selection */}
                    <Typography variant="h6" className="mb-3">
                      Select Payment Method
                    </Typography>
                    
                    <Box className="mb-4">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                        <Button
                          variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => setPaymentMethod('card')}
                        >
                          Card
                        </Button>
                        <Button
                          variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => setPaymentMethod('upi')}
                        >
                          UPI
                        </Button>
                        <Button
                          variant={paymentMethod === 'netbanking' ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => setPaymentMethod('netbanking')}
                        >
                          Net Banking
                        </Button>
                      </div>

                      {/* Payment Details Form */}
                      {paymentMethod === 'card' && (
                        <Box className="space-y-3">
                          <TextField
                            fullWidth
                            label="Card Number"
                            size="small"
                            value={paymentDetails.cardNumber}
                            onChange={(e) => setPaymentDetails(prev => ({ 
                              ...prev, 
                              cardNumber: e.target.value 
                            }))}
                            placeholder="1234 5678 9012 3456"
                          />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <TextField
                              label="MM/YY"
                              size="small"
                              value={paymentDetails.expiryDate}
                              onChange={(e) => setPaymentDetails(prev => ({ 
                                ...prev, 
                                expiryDate: e.target.value 
                              }))}
                            />
                            <TextField
                              label="CVV"
                              size="small"
                              value={paymentDetails.cvv}
                              onChange={(e) => setPaymentDetails(prev => ({ 
                                ...prev, 
                                cvv: e.target.value 
                              }))}
                            />
                          </div>
                          <TextField
                            fullWidth
                            label="Cardholder Name"
                            size="small"
                            value={paymentDetails.cardHolder}
                            onChange={(e) => setPaymentDetails(prev => ({ 
                              ...prev, 
                              cardHolder: e.target.value 
                            }))}
                          />
                        </Box>
                      )}

                      {paymentMethod === 'upi' && (
                        <TextField
                          fullWidth
                          label="UPI ID"
                          size="small"
                          value={paymentDetails.upiId}
                          onChange={(e) => setPaymentDetails(prev => ({ 
                            ...prev, 
                            upiId: e.target.value 
                          }))}
                          placeholder="yourname@upi"
                        />
                      )}

                      {paymentMethod === 'netbanking' && (
                        <FormControl fullWidth size="small">
                          <InputLabel>Select Bank</InputLabel>
                          <Select
                            value={paymentDetails.bankAccount}
                            label="Select Bank"
                            onChange={(e) => setPaymentDetails(prev => ({ 
                              ...prev, 
                              bankAccount: e.target.value 
                            }))}
                          >
                            <MenuItem value="sbi">State Bank of India</MenuItem>
                            <MenuItem value="hdfc">HDFC Bank</MenuItem>
                            <MenuItem value="icici">ICICI Bank</MenuItem>
                            <MenuItem value="axis">Axis Bank</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Box>

                    {/* Pricing Summary */}
                    <Card variant="outlined" className="mb-4">
                      <CardContent className="py-3">
                        <Typography variant="h6" className="mb-2">Booking Summary</Typography>
                        <Box className="space-y-1">
                          <Box className="flex justify-between">
                            <Typography variant="body2">Rental Amount:</Typography>
                            <Typography variant="body2">₹{bookingDetails.totalAmount}</Typography>
                          </Box>
                          <Box className="flex justify-between">
                            <Typography variant="body2">Security Deposit:</Typography>
                            <Typography variant="body2">₹{bookingDetails.securityDeposit}</Typography>
                          </Box>
                          <Divider />
                          <Box className="flex justify-between">
                            <Typography variant="h6">Total Amount:</Typography>
                            <Typography variant="h6" color="primary">
                              ₹{bookingDetails.totalAmount + bookingDetails.securityDeposit}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleCompleteBooking}
                      disabled={loading || !car.available}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Processing...' : `Complete Booking - ₹${bookingDetails.totalAmount + bookingDetails.securityDeposit}`}
                    </Button>
                    
                    <Typography variant="caption" color="textSecondary" className="block mt-2 text-center">
                      Secure payment • Free cancellation up to 2 hours before pickup
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </Box>

            {/* Second Row: Complete Car Details in One Box */}
            <Card>
              <CardContent className="p-6">
                <Typography variant="h4" className="font-bold mb-6 text-center">
                  {car.brand} {car.model} ({car.year}) - Complete Details
                </Typography>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                  
                  {/* Overview Section */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-blue-600 border-b border-blue-200 pb-2">
                      🚗 Overview
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Brand:</Typography>
                        <Typography variant="body2" className="font-medium">{car.brand}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Model:</Typography>
                        <Typography variant="body2" className="font-medium">{car.model}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Year:</Typography>
                        <Typography variant="body2" className="font-medium">{car.year}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Car Type:</Typography>
                        <Typography variant="body2" className="font-medium capitalize">{car.carType}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Rating:</Typography>
                        <Box className="flex items-center">
                          <Rating value={car.rating} readOnly size="small" />
                          <Typography variant="body2" className="ml-1">({car.reviews} reviews)</Typography>
                        </Box>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Total Trips:</Typography>
                        <Typography variant="body2" className="font-medium">{car.trips}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Technical Specifications */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-green-600 border-b border-green-200 pb-2">
                      🔧 Technical Specifications
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Transmission:</Typography>
                        <Typography variant="body2" className="font-medium capitalize">{car.transmission}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Fuel Type:</Typography>
                        <Typography variant="body2" className="font-medium uppercase">{car.fuelType}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Seating Capacity:</Typography>
                        <Typography variant="body2" className="font-medium">{car.seatingCapacity} People</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Baggage Capacity:</Typography>
                        <Typography variant="body2" className="font-medium">{car.baggageCapacity}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Mileage:</Typography>
                        <Typography variant="body2" className="font-medium">15-20 km/l (Estimated)</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Rental Pricing */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-purple-600 border-b border-purple-200 pb-2">
                      💰 Rental Pricing
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Hour:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{car.pricePerHour}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Day:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{car.pricePerDay}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Week:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{car.pricePerWeek}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Month:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{car.pricePerMonth}</Typography>
                      </Box>
                      <Box className="flex justify-between border-t pt-2">
                        <Typography variant="body2" className="font-semibold">Security Deposit:</Typography>
                        <Typography variant="body2" className="font-semibold text-orange-600">₹{car.safetyDeposit}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Pickup Location Details */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-red-600 border-b border-red-200 pb-2">
                      📍 Pickup Location Details
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">City:</Typography>
                        <Typography variant="body2" className="font-medium">{car.city}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Location:</Typography>
                        <Typography variant="body2" className="font-medium">{car.pickupLocation}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Operating Hours:</Typography>
                        <Typography variant="body2" className="font-medium">{car.operatingHours}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Coordinates:</Typography>
                        <Typography variant="body2" className="font-medium text-xs">
                          {car.coordinates.latitude.toFixed(4)}, {car.coordinates.longitude.toFixed(4)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Car Features */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-indigo-600 border-b border-indigo-200 pb-2">
                      ✨ Car Features
                    </Typography>
                    <Box className="space-y-2">
                      {car.features.map((feature, index) => (
                        <Box key={index} className="flex items-center">
                          <CheckCircle className="text-green-500 mr-2" fontSize="small" />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Required Documents */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-teal-600 border-b border-teal-200 pb-2">
                      📄 Required Documents
                    </Typography>
                    <Box className="space-y-2">
                      {car.documentsRequired.map((doc, index) => (
                        <Box key={index} className="flex items-center">
                          <Verified className="text-blue-500 mr-2" fontSize="small" />
                          <Typography variant="body2">{doc}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Service Provider Contact */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-cyan-600 border-b border-cyan-200 pb-2">
                      📞 Service Provider Contact
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Provider:</Typography>
                        <Typography variant="body2" className="font-medium">TravelSpark Car Rentals</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Phone:</Typography>
                        <Typography variant="body2" className="font-medium text-blue-600">+91-9876543210</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Email:</Typography>
                        <Typography variant="body2" className="font-medium text-blue-600">cars@travelspark.com</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Support Hours:</Typography>
                        <Typography variant="body2" className="font-medium">24/7 Available</Typography>
                      </Box>
                    </Box>
                  </Box>

                </div>

                {/* Terms & Conditions - Full Width */}
                <Box className="mt-8">
                  <Typography variant="h6" className="mb-3 font-semibold text-gray-700 border-b border-gray-200 pb-2">
                    📜 Terms & Conditions
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="mb-3 leading-relaxed">
                    {car.termsAndConditions}
                  </Typography>
                  
                  <Box className="mt-4 p-4 bg-red-50 rounded-lg">
                    <Typography variant="h6" className="mb-2 font-semibold text-red-700">
                      🚫 Cancellation Policy
                    </Typography>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-2 mt-0.5" fontSize="small" />
                        <Typography variant="body2" color="textSecondary">
                          <strong>Free cancellation:</strong> Cancel up to 2 hours before pickup for full refund
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Warning className="text-orange-500 mr-2 mt-0.5" fontSize="small" />
                        <Typography variant="body2" color="textSecondary">
                          <strong>Partial refund:</strong> 50% refund if cancelled 2-24 hours before pickup
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Cancel className="text-red-500 mr-2 mt-0.5" fontSize="small" />
                        <Typography variant="body2" color="textSecondary">
                          <strong>No refund:</strong> No refund for no-shows or cancellations within 2 hours
                        </Typography>
                      </li>
                    </ul>
                  </Box>

                  <Box className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <Typography variant="h6" className="mb-2 font-semibold text-blue-700">
                      ⚠️ Important Notes
                    </Typography>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Valid driving license and original ID proof required at pickup
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Fuel charges not included in rental cost
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Late return penalty: ₹2000 + one day additional rent
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Customer liable for service charges in case of damage
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • GPS tracking enabled during rental period for security
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Comprehensive insurance coverage included
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </LocalizationProvider>
    )
  }

  // Handle detailed view
  if (view === 'detail' && selectedCarForDetail) {
    return <CarDetailPage car={selectedCarForDetail} />
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex min-h-screen bg-background">
        {/* Left Sidebar - 15% width */}
        {filterSidebarOpen && (
          <Paper 
            elevation={2}
            className="w-[15%] min-w-[250px] p-4 overflow-y-auto h-screen sticky top-0"
            sx={{ borderRadius: 0 }}
          >
            <Typography variant="h6" className="mb-4 font-semibold text-foreground">
              <FilterList className="inline mr-2" />
              Filters
          </Typography>

          {/* Near Me Button */}
          <Box className="mb-4">
            <NearMeButton 
              onClick={handleNearMe}
              isActive={filters.nearMe}
              className="w-full"
            />
          </Box>

          {/* City Filter */}
          <Box className="mb-4">
            <FormControl fullWidth size="small">
              <InputLabel>City</InputLabel>
              <Select
                value={filters.city}
                label="City"
                onChange={(e) => handleFilterChange('city', e.target.value)}
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Date Time Filters */}
          <Box className="mb-4 space-y-4">
            <DateTimePicker
              label="From Date & Time"
              value={filters.fromDateTime}
              onChange={(value) => handleFilterChange('fromDateTime', value)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <DateTimePicker
              label="To Date & Time"
              value={filters.toDateTime}
              onChange={(value) => handleFilterChange('toDateTime', value)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Box>

          {/* Pickup Location Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Pickup Locations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                size="small"
                placeholder="Search locations..."
                value={searchTerms.pickupLocation || ''}
                onChange={(e) => handleSearchInFilter('pickupLocation', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  )
                }}
                className="mb-2 w-full"
              />
              <Box className="max-h-32 overflow-y-auto">
                <FormGroup>
                  {pickupLocations
                    .filter(location => 
                      !searchTerms.pickupLocation || 
                      location.toLowerCase().includes(searchTerms.pickupLocation.toLowerCase())
                    )
                    .map(location => (
                    <FormControlLabel
                      key={location}
                      control={
                        <Checkbox
                          size="small"
                          checked={filters.pickupLocation.includes(location)}
                          onChange={() => handleMultiSelectFilter('pickupLocation', location)}
                        />
                      }
                      label={<Typography variant="body2">{location}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Car Type Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Car Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {carTypes.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.carType.includes(type)}
                        onChange={() => handleMultiSelectFilter('carType', type)}
                      />
                    }
                    label={<Typography variant="body2" className="capitalize">{type}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Transmission Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Transmission Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {transmissionTypes.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.transmission.includes(type)}
                        onChange={() => handleMultiSelectFilter('transmission', type)}
                      />
                    }
                    label={<Typography variant="body2" className="capitalize">{type}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Fuel Type Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Fuel Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {fuelTypes.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.fuelType.includes(type)}
                        onChange={() => handleMultiSelectFilter('fuelType', type)}
                      />
                    }
                    label={<Typography variant="body2" className="capitalize">{type}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Seating Capacity Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Seating Capacity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {seatingCapacities.map(capacity => (
                  <FormControlLabel
                    key={capacity}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.seatingCapacity.includes(capacity)}
                        onChange={() => handleMultiSelectFilter('seatingCapacity', capacity)}
                      />
                    }
                    label={<Typography variant="body2">{capacity} seats</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Brands Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Brands</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                size="small"
                placeholder="Search brands..."
                value={searchTerms.brands || ''}
                onChange={(e) => handleSearchInFilter('brands', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  )
                }}
                className="mb-2 w-full"
              />
              <Box className="max-h-32 overflow-y-auto">
                <FormGroup>
                  {brands
                    .filter(brand => 
                      !searchTerms.brands || 
                      brand.toLowerCase().includes(searchTerms.brands.toLowerCase())
                    )
                    .map(brand => (
                    <FormControlLabel
                      key={brand}
                      control={
                        <Checkbox
                          size="small"
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleMultiSelectFilter('brands', brand)}
                        />
                      }
                      label={<Typography variant="body2">{brand}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Make Year Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Make Year</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                size="small"
                placeholder="Search years..."
                value={searchTerms.makeYear || ''}
                onChange={(e) => handleSearchInFilter('makeYear', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  )
                }}
                className="mb-2 w-full"
              />
              <Box className="max-h-32 overflow-y-auto">
                <FormGroup>
                  {makeYears
                    .filter(year => 
                      !searchTerms.makeYear || 
                      year.toString().includes(searchTerms.makeYear)
                    )
                    .map(year => (
                    <FormControlLabel
                      key={year}
                      control={
                        <Checkbox
                          size="small"
                          checked={filters.makeYear.includes(year)}
                          onChange={() => handleMultiSelectFilter('makeYear', year)}
                        />
                      }
                      label={<Typography variant="body2">{year}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Price Range Filter */}
          <Box className="mb-4">
            <Typography variant="body2" className="mb-2">
              Price Range (₹{filters.priceRange[0]} - ₹{filters.priceRange[1]})
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
              min={1000}
              max={10000}
              step={100}
              valueLabelDisplay="auto"
              size="small"
            />
          </Box>
        </Paper>
        )}

        {/* Main Content Area - adjust width based on sidebar visibility */}
        <Box className={filterSidebarOpen ? "flex-1 p-6" : "w-full p-6"}>
          {/* Top Bar with Filters and Sort */}
          <Paper elevation={1} className="p-4 mb-6">
            <Box className="flex items-center justify-between flex-wrap gap-4">
              <Box className="flex items-center gap-2">
                <Typography variant="h6" className="text-foreground">
                  {filteredCars.length} Cars Available
                </Typography>
              </Box>
              
              <Box className="flex items-center gap-2">
                <FormControl size="small" className="min-w-[200px]">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={`${sortBy}-${sortOrder}`}
                    label="Sort By"
                    onChange={(e) => {
                      const [newSortBy, newOrder] = e.target.value.split('-')
                      setSortBy(newSortBy)
                      setSortOrder(newOrder as 'asc' | 'desc')
                    }}
                  >
                    <MenuItem value="rating-desc">Rating (High to Low)</MenuItem>
                    <MenuItem value="rating-asc">Rating (Low to High)</MenuItem>
                    <MenuItem value="reviews-desc">Reviews (High to Low)</MenuItem>
                    <MenuItem value="reviews-asc">Reviews (Low to High)</MenuItem>
                    <MenuItem value="cost-asc">Price (Low to High)</MenuItem>
                    <MenuItem value="cost-desc">Price (High to Low)</MenuItem>
                    <MenuItem value="trips-desc">Trips (High to Low)</MenuItem>
                    <MenuItem value="trips-asc">Trips (Low to High)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Active Filter Chips */}
            <Box className="flex flex-wrap gap-2 mt-4">
              {getActiveFilterChips().map((chip, index) => (
                <Chip
                  key={`${chip.category}-${chip.value || 'main'}-${index}`}
                  label={chip.label}
                  onDelete={() => handleRemoveFilter(chip.category, chip.value)}
                  deleteIcon={<Close />}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>

          {/* Cars Grid */}
          {filteredCars.length === 0 ? (
            <Alert severity="info" className="text-center">
              No cars available for selected criteria. Change filter options and try again.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredCars.map(car => (
                <Grid item xs={12} md={6} lg={4} key={car.id}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardMedia
                      component="img"
                      height="200"
                      image={car.image}
                      alt={car.name}
                      className="h-48 object-cover"
                    />
                    <CardContent className="flex-1 flex flex-col">
                      <Box className="flex items-start justify-between mb-2">
                        <Box>
                          <Typography variant="h6" className="font-semibold text-foreground">
                            {car.brand} {car.model}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {car.year} • {car.transmission} • {car.fuelType} • {car.carType}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-2 mb-3">
                        <Rating value={car.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({car.reviews} reviews)
                        </Typography>
                      </Box>

                      <Box className="mb-3">
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                          <Schedule fontSize="small" />
                          {car.operatingHours}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1 mt-1">
                          <LocationOn fontSize="small" />
                          {car.pickupLocation}, {car.city}
                        </Typography>
                      </Box>

                      <Box className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Group fontSize="small" />
                          {car.seatingCapacity} seats
                        </div>
                        <div className="flex items-center gap-1">
                          <Luggage fontSize="small" />
                          {car.baggageCapacity}
                        </div>
                        <span>{car.trips} trips</span>
                      </Box>

                      <Divider className="my-2" />

                      <Box className="mb-3">
                        <Typography variant="body1" className="font-semibold text-primary">
                          ₹{car.pricePerHour}/hour • ₹{car.pricePerDay}/day
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Safety Deposit: ₹{car.safetyDeposit}
                        </Typography>
                      </Box>

                      <Box className="flex gap-2 mt-auto">
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleBookNow(car)}
                          disabled={!currentUser}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Booking Modal */}
        {selectedCar && (
          <BookingModal
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            bike={selectedCar}
            currentUser={currentUser}
          />
        )}
      </Box>
    </LocalizationProvider>
  )
}