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
  Container,
  IconButton,
  AppBar,
  Toolbar,
  Tabs,
  Tab
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
  Home,
  Shower,
  Wc,
  Tv,
  Kitchen,
  TableRestaurant,
  MenuBook,
  ArrowBack,
  CheckCircle,
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

interface CampervanRentalsProps {
  currentUser: User | null
  filterSidebarOpen: boolean
}

interface CampervanFilters {
  city: string
  fromDateTime: Dayjs | null
  toDateTime: Dayjs | null
  pickupLocation: string[]
  transmission: string[]
  fuelType: string[]
  rentType: string[]
  brands: string[]
  makeYear: number[]
  carType: string[]
  seatingCapacity: number[]
  toiletType: string[]
  showerType: string[]
  amenities: string[]
  priceRange: [number, number]
  nearMe: boolean
}

interface Campervan {
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
  toiletType: string
  showerType: string
  amenities: string[]
}

const mockCampervans: Campervan[] = [
  // Mumbai Campervans
  {
    id: '1',
    name: 'Tata Adventure Van',
    brand: 'Tata',
    model: 'Adventure Van',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 6,
    pricePerHour: 200,
    pricePerDay: 4500,
    pricePerWeek: 28000,
    pricePerMonth: 100000,
    rating: 4.7,
    reviews: 34,
    trips: 78,
    safetyDeposit: 10000,
    city: 'Mumbai',
    pickupLocation: 'Andheri West',
    operatingHours: '9:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.1367, longitude: 72.8269 },
    providerId: 'provider1',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Full fuel return policy. Damage charges applicable.',
    baggageCapacity: '500L',
    toiletType: 'portable toilet',
    showerType: 'outside shower',
    amenities: ['tv', 'fridge', 'dining table']
  },
  {
    id: '2',
    name: 'Mahindra Explorer RV',
    brand: 'Mahindra',
    model: 'Explorer RV',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 4,
    pricePerHour: 250,
    pricePerDay: 5500,
    pricePerWeek: 35000,
    pricePerMonth: 120000,
    rating: 4.8,
    reviews: 67,
    trips: 45,
    safetyDeposit: 15000,
    city: 'Mumbai',
    pickupLocation: 'Bandra East',
    operatingHours: '9:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    providerId: 'provider2',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Professional driving experience required.',
    baggageCapacity: '600L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  {
    id: '3',
    name: 'Toyota Hiace Camper',
    brand: 'Toyota',
    model: 'Hiace Camper',
    year: 2021,
    fuelType: 'petrol',
    transmission: 'manual',
    carType: 'hatchback',
    seatingCapacity: 5,
    pricePerHour: 180,
    pricePerDay: 4000,
    pricePerWeek: 25000,
    pricePerMonth: 85000,
    rating: 4.5,
    reviews: 89,
    trips: 134,
    safetyDeposit: 8000,
    city: 'Mumbai',
    pickupLocation: 'Powai',
    operatingHours: '9:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.1176, longitude: 72.9060 },
    providerId: 'provider1',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Return with same fuel level. Smoking prohibited.',
    baggageCapacity: '450L',
    toiletType: 'bathroom tent',
    showerType: 'outside shower',
    amenities: ['fridge', 'dining table']
  },
  // Delhi Campervans
  {
    id: '4',
    name: 'Ford Transit Camper',
    brand: 'Ford',
    model: 'Transit Camper',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 6,
    pricePerHour: 220,
    pricePerDay: 5000,
    pricePerWeek: 32000,
    pricePerMonth: 115000,
    rating: 4.6,
    reviews: 45,
    trips: 67,
    safetyDeposit: 12000,
    city: 'Delhi',
    pickupLocation: 'Connaught Place',
    operatingHours: '8:00 AM - 11:00 PM',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    providerId: 'provider3',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'No night parking in restricted areas. GPS tracking enabled.',
    baggageCapacity: '550L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  {
    id: '5',
    name: 'Iveco Daily Motorhome',
    brand: 'Iveco',
    model: 'Daily Motorhome',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 7,
    pricePerHour: 280,
    pricePerDay: 6200,
    pricePerWeek: 40000,
    pricePerMonth: 140000,
    rating: 4.9,
    reviews: 23,
    trips: 34,
    safetyDeposit: 18000,
    city: 'Delhi',
    pickupLocation: 'Karol Bagh',
    operatingHours: '7:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6542, longitude: 77.1905 },
    providerId: 'provider4',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Premium motorhome. Experienced drivers only.',
    baggageCapacity: '700L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  // Bangalore Campervans
  {
    id: '6',
    name: 'Mercedes Sprinter Van',
    brand: 'Mercedes',
    model: 'Sprinter Van',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 8,
    pricePerHour: 350,
    pricePerDay: 7500,
    pricePerWeek: 48000,
    pricePerMonth: 180000,
    rating: 4.9,
    reviews: 18,
    trips: 25,
    safetyDeposit: 25000,
    city: 'Bangalore',
    pickupLocation: 'Koramangala',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    providerId: 'provider5',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Luxury camper van. Premium insurance included.',
    baggageCapacity: '800L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  {
    id: '7',
    name: 'Volkswagen Crafter',
    brand: 'Volkswagen',
    model: 'Crafter',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 6,
    pricePerHour: 240,
    pricePerDay: 5400,
    pricePerWeek: 34000,
    pricePerMonth: 125000,
    rating: 4.7,
    reviews: 31,
    trips: 52,
    safetyDeposit: 14000,
    city: 'Bangalore',
    pickupLocation: 'Whitefield',
    operatingHours: '8:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9698, longitude: 77.7500 },
    providerId: 'provider6',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'German engineering. Regular maintenance guaranteed.',
    baggageCapacity: '620L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'dining table']
  },
  // Chennai Campervans
  {
    id: '8',
    name: 'Kia Carnival Camper',
    brand: 'Kia',
    model: 'Carnival Camper',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 7,
    pricePerHour: 190,
    pricePerDay: 4300,
    pricePerWeek: 27000,
    pricePerMonth: 98000,
    rating: 4.4,
    reviews: 56,
    trips: 89,
    safetyDeposit: 9000,
    city: 'Chennai',
    pickupLocation: 'T. Nagar',
    operatingHours: '6:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    providerId: 'provider7',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Family-friendly camper. Beach access allowed.',
    baggageCapacity: '480L',
    toiletType: 'portable toilet',
    showerType: 'outside shower',
    amenities: ['fridge', 'dining table']
  },
  {
    id: '9',
    name: 'Hyundai H350 Camper',
    brand: 'Hyundai',
    model: 'H350 Camper',
    year: 2021,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 170,
    pricePerDay: 3800,
    pricePerWeek: 24000,
    pricePerMonth: 88000,
    rating: 4.2,
    reviews: 78,
    trips: 112,
    safetyDeposit: 7000,
    city: 'Chennai',
    pickupLocation: 'Anna Nagar',
    operatingHours: '5:30 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0878, longitude: 80.2785 },
    providerId: 'provider8',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Coastal driving allowed. Salt water protection applied.',
    baggageCapacity: '410L',
    toiletType: 'bathroom tent',
    showerType: 'outside shower',
    amenities: ['fridge', 'dining table']
  },
  // Kolkata Campervans
  {
    id: '10',
    name: 'Tata Winger Camper',
    brand: 'Tata',
    model: 'Winger Camper',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 6,
    pricePerHour: 160,
    pricePerDay: 3600,
    pricePerWeek: 22500,
    pricePerMonth: 82000,
    rating: 4.3,
    reviews: 92,
    trips: 156,
    safetyDeposit: 6000,
    city: 'Kolkata',
    pickupLocation: 'Park Street',
    operatingHours: '6:00 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    providerId: 'provider9',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Cultural heritage tours welcome. Local guide available.',
    baggageCapacity: '380L',
    toiletType: 'portable toilet',
    showerType: 'outside shower',
    amenities: ['fridge', 'dining table']
  },
  {
    id: '11',
    name: 'Ashok Leyland Camper',
    brand: 'Ashok Leyland',
    model: 'Camper',
    year: 2021,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 8,
    pricePerHour: 200,
    pricePerDay: 4400,
    pricePerWeek: 28000,
    pricePerMonth: 102000,
    rating: 4.1,
    reviews: 67,
    trips: 98,
    safetyDeposit: 8000,
    city: 'Kolkata',
    pickupLocation: 'Salt Lake',
    operatingHours: '7:00 AM - 8:30 PM',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5958, longitude: 88.4497 },
    providerId: 'provider10',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Large group friendly. Himalayan routes accessible.',
    baggageCapacity: '520L',
    toiletType: 'bathroom tent',
    showerType: 'outside shower',
    amenities: ['tv', 'fridge', 'dining table']
  },
  // Hyderabad Campervans
  {
    id: '12',
    name: 'BMW X7 Camper',
    brand: 'BMW',
    model: 'X7 Camper',
    year: 2023,
    fuelType: 'petrol',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 6,
    pricePerHour: 400,
    pricePerDay: 8500,
    pricePerWeek: 55000,
    pricePerMonth: 200000,
    rating: 4.9,
    reviews: 15,
    trips: 22,
    safetyDeposit: 30000,
    city: 'Hyderabad',
    pickupLocation: 'Banjara Hills',
    operatingHours: '6:30 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 17.3850, longitude: 78.4867 },
    providerId: 'provider11',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Ultra-luxury camper. Chauffeur service available.',
    baggageCapacity: '850L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  // Pune Campervans
  {
    id: '13',
    name: 'Force Traveller Camper',
    brand: 'Force',
    model: 'Traveller Camper',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 7,
    pricePerHour: 180,
    pricePerDay: 4000,
    pricePerWeek: 25000,
    pricePerMonth: 92000,
    rating: 4.5,
    reviews: 73,
    trips: 124,
    safetyDeposit: 7500,
    city: 'Pune',
    pickupLocation: 'Koregaon Park',
    operatingHours: '6:00 AM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.5204, longitude: 73.8567 },
    providerId: 'provider12',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Hill station specialist. Mountain routes certified.',
    baggageCapacity: '460L',
    toiletType: 'bathroom tent',
    showerType: 'outside shower',
    amenities: ['tv', 'fridge', 'dining table']
  },
  {
    id: '14',
    name: 'Eicher Skyline Camper',
    brand: 'Eicher',
    model: 'Skyline Camper',
    year: 2021,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 150,
    pricePerDay: 3400,
    pricePerWeek: 21000,
    pricePerMonth: 78000,
    rating: 4.0,
    reviews: 98,
    trips: 167,
    safetyDeposit: 5500,
    city: 'Pune',
    pickupLocation: 'Shivaji Nagar',
    operatingHours: '6:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.5362, longitude: 73.8512 },
    providerId: 'provider13',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Budget-friendly option. Perfect for weekend getaways.',
    baggageCapacity: '320L',
    toiletType: 'portable toilet',
    showerType: 'outside shower',
    amenities: ['fridge', 'dining table']
  },
  // Ahmedabad Campervans
  {
    id: '15',
    name: 'Maruti Suzuki Eeco Camper',
    brand: 'Maruti Suzuki',
    model: 'Eeco Camper',
    year: 2023,
    fuelType: 'cng-petrol',
    transmission: 'manual',
    carType: 'hatchback',
    seatingCapacity: 6,
    pricePerHour: 120,
    pricePerDay: 2800,
    pricePerWeek: 17500,
    pricePerMonth: 65000,
    rating: 3.9,
    reviews: 134,
    trips: 189,
    safetyDeposit: 4000,
    city: 'Ahmedabad',
    pickupLocation: 'Satellite',
    operatingHours: '7:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    providerId: 'provider14',
    termsAndConditions: 'Eco-friendly CNG option. Desert safari certified.',
    baggageCapacity: '280L',
    toiletType: 'portable toilet',
    showerType: 'outside shower',
    amenities: ['fridge'],
    documentsRequired: ['Driving License', 'Aadhar Card']
  },
  {
    id: '16',
    name: 'Bajaj Maxximo Camper',
    brand: 'Bajaj',
    model: 'Maxximo Camper',
    year: 2021,
    fuelType: 'cng',
    transmission: 'manual',
    carType: 'hatchback',
    seatingCapacity: 4,
    pricePerHour: 100,
    pricePerDay: 2200,
    pricePerWeek: 14000,
    pricePerMonth: 52000,
    rating: 3.7,
    reviews: 156,
    trips: 234,
    safetyDeposit: 3000,
    city: 'Ahmedabad',
    pickupLocation: 'Navrangpura',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 23.0395, longitude: 72.5662 },
    providerId: 'provider15',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Compact and economical. City exploration specialist.',
    baggageCapacity: '200L',
    toiletType: 'portable toilet',
    showerType: 'outside shower',
    amenities: ['fridge']
  },
  // Additional Premium Campervans
  {
    id: '17',
    name: 'Volvo 9400 Luxury RV',
    brand: 'Volvo',
    model: '9400 Luxury RV',
    year: 2023,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 8,
    pricePerHour: 450,
    pricePerDay: 9500,
    pricePerWeek: 62000,
    pricePerMonth: 220000,
    rating: 5.0,
    reviews: 8,
    trips: 12,
    safetyDeposit: 35000,
    city: 'Delhi',
    pickupLocation: 'New Delhi Railway Station',
    operatingHours: '8:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6434, longitude: 77.2100 },
    providerId: 'provider16',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Premium luxury RV. Professional chauffeur included.',
    baggageCapacity: '1000L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  {
    id: '18',
    name: 'Scania Touring Camper',
    brand: 'Scania',
    model: 'Touring Camper',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'automatic',
    carType: 'SUV',
    seatingCapacity: 6,
    pricePerHour: 320,
    pricePerDay: 7000,
    pricePerWeek: 45000,
    pricePerMonth: 165000,
    rating: 4.8,
    reviews: 12,
    trips: 18,
    safetyDeposit: 22000,
    city: 'Mumbai',
    pickupLocation: 'Gateway of India',
    operatingHours: '9:00 AM - 7:00 PM',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.9220, longitude: 72.8347 },
    providerId: 'provider17',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'European luxury standards. Long-distance touring specialist.',
    baggageCapacity: '750L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  {
    id: '19',
    name: 'MAN TGE Camper',
    brand: 'MAN',
    model: 'TGE Camper',
    year: 2021,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 5,
    pricePerHour: 260,
    pricePerDay: 5800,
    pricePerWeek: 37000,
    pricePerMonth: 135000,
    rating: 4.6,
    reviews: 27,
    trips: 39,
    safetyDeposit: 16000,
    city: 'Bangalore',
    pickupLocation: 'Electronic City',
    operatingHours: '7:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.8456, longitude: 77.6603 },
    providerId: 'provider18',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'German engineering excellence. Tech-savvy features.',
    baggageCapacity: '580L',
    toiletType: 'wc with shower',
    showerType: 'inside shower',
    amenities: ['tv', 'fridge', 'study table', 'dining table']
  },
  {
    id: '20',
    name: 'Renault Master Camper',
    brand: 'Renault',
    model: 'Master Camper',
    year: 2022,
    fuelType: 'diesel',
    transmission: 'manual',
    carType: 'SUV',
    seatingCapacity: 7,
    pricePerHour: 210,
    pricePerDay: 4700,
    pricePerWeek: 30000,
    pricePerMonth: 110000,
    rating: 4.3,
    reviews: 45,
    trips: 71,
    safetyDeposit: 11000,
    city: 'Chennai',
    pickupLocation: 'Marina Beach',
    operatingHours: '6:30 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1544717440-6021ca08d826?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0475, longitude: 80.2824 },
    providerId: 'provider19',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'French design excellence. Coastal touring optimized.',
    baggageCapacity: '520L',
    toiletType: 'bathroom tent',
    showerType: 'outside shower',
    amenities: ['tv', 'fridge', 'dining table']
  }
]

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']
const transmissionTypes = ['manual', 'automatic']
const fuelTypes = ['petrol', 'cng', 'cng-petrol', 'diesel', 'EV']
const rentTypes = ['hours', 'days', 'weeks', 'monthly']
const brands = ['Tata', 'Mahindra', 'Toyota', 'Ford', 'Iveco', 'Mercedes', 'Volkswagen', 'Kia', 'Hyundai', 'Ashok Leyland', 'BMW', 'Force', 'Eicher', 'Maruti Suzuki', 'Bajaj', 'Volvo', 'Scania', 'MAN', 'Renault']
const carTypes = ['SUV', 'hatchback', 'sedan']
const seatingCapacities = [4, 5, 6, 7]
const toiletTypes = ['portable toilet', 'bathroom tent', 'wc with shower']
const showerTypes = ['inside shower', 'outside shower']
const amenitiesList = ['tv', 'fridge', 'study table', 'dining table']
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

export function CampervanRentals({ currentUser, filterSidebarOpen }: CampervanRentalsProps) {
  const [campervans] = useLocalStorage<Campervan[]>('campervans', mockCampervans)
  const [filters, setFilters] = useState<CampervanFilters>({
    city: '',
    fromDateTime: null,
    toDateTime: null,
    pickupLocation: [],
    transmission: [],
    fuelType: [],
    rentType: [],
    brands: [],
    makeYear: [],
    carType: [],
    seatingCapacity: [],
    toiletType: [],
    showerType: [],
    amenities: [],
    priceRange: [1000, 100000],
    nearMe: false
  })
  
  const [sortBy, setSortBy] = useState('rating')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filteredCampervans, setFilteredCampervans] = useState<Campervan[]>(campervans)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [selectedCampervan, setSelectedCampervan] = useState<Campervan | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedCampervanForDetail, setSelectedCampervanForDetail] = useState<Campervan | null>(null)

  const pickupLocations = Array.from(new Set(campervans.map(campervan => campervan.pickupLocation)))

  // Filter and sort campervans based on current filters
  useEffect(() => {
    let result = campervans.filter(campervan => {
      if (!campervan.available) return false
      
      // City filter
      if (filters.city && campervan.city !== filters.city) return false
      
      // Pickup location filter (OR logic)
      if (filters.pickupLocation.length > 0 && !filters.pickupLocation.includes(campervan.pickupLocation)) return false
      
      // Transmission filter (OR logic)
      if (filters.transmission.length > 0 && !filters.transmission.includes(campervan.transmission)) return false
      
      // Fuel type filter (OR logic)
      if (filters.fuelType.length > 0 && !filters.fuelType.includes(campervan.fuelType)) return false
      
      // Car type filter (OR logic)
      if (filters.carType.length > 0 && !filters.carType.includes(campervan.carType)) return false
      
      // Brand filter (OR logic)
      if (filters.brands.length > 0 && !filters.brands.includes(campervan.brand)) return false
      
      // Seating capacity filter (OR logic)
      if (filters.seatingCapacity.length > 0 && !filters.seatingCapacity.includes(campervan.seatingCapacity)) return false
      
      // Toilet type filter (OR logic)
      if (filters.toiletType.length > 0 && !filters.toiletType.includes(campervan.toiletType)) return false
      
      // Shower type filter (OR logic)
      if (filters.showerType.length > 0 && !filters.showerType.includes(campervan.showerType)) return false
      
      // Amenities filter (OR logic)
      if (filters.amenities.length > 0 && !filters.amenities.some(amenity => campervan.amenities.includes(amenity))) return false
      
      // Year filter (OR logic)
      if (filters.makeYear.length > 0 && !filters.makeYear.includes(campervan.year)) return false
      
      // Price range filter
      const price = campervan.pricePerDay
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      
      return true
    })

    // Apply search terms within each filter category
    Object.entries(searchTerms).forEach(([category, term]) => {
      if (term) {
        switch (category) {
          case 'brands':
            result = result.filter(campervan => 
              campervan.brand.toLowerCase().includes(term.toLowerCase())
            )
            break
          case 'pickupLocation':
            result = result.filter(campervan => 
              campervan.pickupLocation.toLowerCase().includes(term.toLowerCase())
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

    setFilteredCampervans(result)
  }, [campervans, filters, sortBy, sortOrder, userLocation, searchTerms])

  const handleFilterChange = (category: keyof CampervanFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleMultiSelectFilter = (category: keyof CampervanFilters, value: string | number) => {
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

  const handleRemoveFilter = (category: keyof CampervanFilters, value?: string | number) => {
    if (value !== undefined) {
      handleMultiSelectFilter(category, value)
    } else {
      if (category === 'nearMe') {
        handleFilterChange('nearMe', false)
      } else if (category === 'priceRange') {
        handleFilterChange('priceRange', [1000, 100000])
      } else {
        handleFilterChange(category, category.includes('DateTime') ? null : '')
      }
    }
  }

  const handleNearMe = async () => {
    try {
      const locationResult = await locationService.getCurrentLocation()
      setUserLocation({
        latitude: locationResult.location.latitude,
        longitude: locationResult.location.longitude
      })
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

  const handleBookNow = (campervan: Campervan) => {
    setSelectedCampervanForDetail(campervan)
    setView('detail')
  }

  const getActiveFilterChips = () => {
    const chips: Array<{ label: string; category: keyof CampervanFilters; value?: string | number }> = []
    
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
    filters.rentType.forEach(type => 
      chips.push({ label: `Rent: ${type}`, category: 'rentType', value: type })
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
    filters.toiletType.forEach(type => 
      chips.push({ label: `Toilet: ${type}`, category: 'toiletType', value: type })
    )
    filters.showerType.forEach(type => 
      chips.push({ label: `Shower: ${type}`, category: 'showerType', value: type })
    )
    filters.amenities.forEach(amenity => 
      chips.push({ label: `${amenity}`, category: 'amenities', value: amenity })
    )
    filters.makeYear.forEach(year => 
      chips.push({ label: `Year: ${year}`, category: 'makeYear', value: year })
    )
    
    if (filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 100000) {
      chips.push({ label: `Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`, category: 'priceRange' })
    }
    
    return chips
  }

  // Utility function for amenity icons
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'tv': return <Tv fontSize="small" />
      case 'fridge': return <Kitchen fontSize="small" />
      case 'study table': return <MenuBook fontSize="small" />
      case 'dining table': return <TableRestaurant fontSize="small" />
      default: return <Settings fontSize="small" />
    }
  }

  // Campervan Detail Page Component
  // Detailed Campervan View Component - New Structure
  const CampervanDetailPage = ({ campervan }: { campervan: Campervan }) => {
    // Import required components for inline booking
    const [bookingDetails, setBookingDetails] = useState({
      startDateTime: dayjs().add(1, 'hour'),
      endDateTime: dayjs().add(1, 'day'),
      rentType: 'days' as 'hours' | 'days' | 'weeks' | 'months',
      totalAmount: 0,
      securityDeposit: campervan.safetyDeposit,
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
        amount = hours * campervan.pricePerHour
      } else if (bookingDetails.rentType === 'days') {
        const days = Math.ceil(endTime.diff(startTime, 'day', true))
        amount = days * campervan.pricePerDay
      } else if (bookingDetails.rentType === 'weeks') {
        const weeks = Math.ceil(endTime.diff(startTime, 'week', true))
        amount = weeks * campervan.pricePerWeek
      } else if (bookingDetails.rentType === 'months') {
        const months = Math.ceil(endTime.diff(startTime, 'month', true))
        amount = months * campervan.pricePerMonth
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
        
        toast.success('🎉 Campervan booking confirmed successfully!')
        setView('list')
        setSelectedCampervanForDetail(null)
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
                  setSelectedCampervanForDetail(null)
                }}
                sx={{ mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {campervan.name}
              </Typography>
              <Chip 
                label={campervan.available ? "Available" : "Booked"} 
                color={campervan.available ? "success" : "error"}
                variant="outlined"
              />
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" className="py-6">
            {/* First Row: Campervan Image + Booking Panel */}
            <Box className="mb-8">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Left: Campervan Image */}
                <Card className="overflow-hidden">
                  <CardMedia
                    component="img"
                    height="400"
                    image={campervan.image}
                    alt={campervan.name}
                    className="object-cover"
                    sx={{ width: '100%', height: '400px' }}
                  />
                </Card>

                {/* Right: Booking Panel */}
                <Card>
                  <CardContent className="p-6">
                    <Typography variant="h5" className="font-bold mb-2">
                      Complete Your Campervan Booking
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-4">
                      Fill in the details below to book {campervan.brand} {campervan.model}
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
                          <MenuItem value="hours">Hourly (₹{campervan.pricePerHour}/hour)</MenuItem>
                          <MenuItem value="days">Daily (₹{campervan.pricePerDay}/day)</MenuItem>
                          <MenuItem value="weeks">Weekly (₹{campervan.pricePerWeek}/week)</MenuItem>
                          <MenuItem value="months">Monthly (₹{campervan.pricePerMonth}/month)</MenuItem>
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
                      disabled={loading || !campervan.available}
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

            {/* Second Row: Complete Campervan Details in One Box */}
            <Card>
              <CardContent className="p-6">
                <Typography variant="h4" className="font-bold mb-6 text-center">
                  {campervan.brand} {campervan.model} ({campervan.year}) - Complete Details
                </Typography>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                  
                  {/* Overview Section */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-blue-600 border-b border-blue-200 pb-2">
                      🏕️ Overview
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Brand:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.brand}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Model:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.model}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Year:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.year}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Vehicle Type:</Typography>
                        <Typography variant="body2" className="font-medium capitalize">{campervan.carType}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Rating:</Typography>
                        <Box className="flex items-center">
                          <Rating value={campervan.rating} readOnly size="small" />
                          <Typography variant="body2" className="ml-1">({campervan.reviews} reviews)</Typography>
                        </Box>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Total Trips:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.trips}</Typography>
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
                        <Typography variant="body2" className="font-medium capitalize">{campervan.transmission}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Fuel Type:</Typography>
                        <Typography variant="body2" className="font-medium uppercase">{campervan.fuelType}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Seating Capacity:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.seatingCapacity} People</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Baggage Capacity:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.baggageCapacity}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Toilet Type:</Typography>
                        <Typography variant="body2" className="font-medium capitalize">{campervan.toiletType}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Shower Type:</Typography>
                        <Typography variant="body2" className="font-medium capitalize">{campervan.showerType}</Typography>
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
                        <Typography variant="body2" className="font-medium text-green-600">₹{campervan.pricePerHour}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Day:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{campervan.pricePerDay}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Week:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{campervan.pricePerWeek}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Month:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{campervan.pricePerMonth}</Typography>
                      </Box>
                      <Box className="flex justify-between border-t pt-2">
                        <Typography variant="body2" className="font-semibold">Security Deposit:</Typography>
                        <Typography variant="body2" className="font-semibold text-orange-600">₹{campervan.safetyDeposit}</Typography>
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
                        <Typography variant="body2" className="font-medium">{campervan.city}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Location:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.pickupLocation}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Operating Hours:</Typography>
                        <Typography variant="body2" className="font-medium">{campervan.operatingHours}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Coordinates:</Typography>
                        <Typography variant="body2" className="font-medium text-xs">
                          {campervan.coordinates.latitude.toFixed(4)}, {campervan.coordinates.longitude.toFixed(4)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Campervan Amenities */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-indigo-600 border-b border-indigo-200 pb-2">
                      ✨ Campervan Amenities
                    </Typography>
                    <Box className="space-y-2">
                      {campervan.amenities.map((amenity, index) => (
                        <Box key={index} className="flex items-center">
                          {getAmenityIcon(amenity)}
                          <Typography variant="body2" className="ml-2">{amenity}</Typography>
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
                      {campervan.documentsRequired.map((doc, index) => (
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
                        <Typography variant="body2" className="font-medium">TravelSpark Campervan Rentals</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Phone:</Typography>
                        <Typography variant="body2" className="font-medium text-blue-600">+91-9876543210</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Email:</Typography>
                        <Typography variant="body2" className="font-medium text-blue-600">campervan@travelspark.com</Typography>
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
                    {campervan.termsAndConditions}
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
                      ⚠️ Important Notes for Campervan Rental
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
                          • Late return penalty: ₹3000 + one day additional rent
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Customer liable for cleaning charges if returned in poor condition
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • GPS tracking enabled during rental period for security
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Comprehensive insurance and roadside assistance included
                        </Typography>
                      </li>
                      <li className="flex items-start">
                        <Typography variant="body2" color="textSecondary">
                          • Water and waste tank emptying charges may apply
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
  if (view === 'detail' && selectedCampervanForDetail) {
    return <CampervanDetailPage campervan={selectedCampervanForDetail} />
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

          {/* Rental Type Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Rental Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {rentTypes.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.rentType.includes(type)}
                        onChange={() => handleMultiSelectFilter('rentType', type)}
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
                    label={<Typography variant="body2" className="uppercase">{type}</Typography>}
                  />
                ))}
              </FormGroup>
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

          {/* Toilet Type Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Toilet</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {toiletTypes.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.toiletType.includes(type)}
                        onChange={() => handleMultiSelectFilter('toiletType', type)}
                      />
                    }
                    label={<Typography variant="body2">{type}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Shower Type Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Shower</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {showerTypes.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.showerType.includes(type)}
                        onChange={() => handleMultiSelectFilter('showerType', type)}
                      />
                    }
                    label={<Typography variant="body2">{type}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Amenities Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Amenities</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {amenitiesList.map(amenity => (
                  <FormControlLabel
                    key={amenity}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleMultiSelectFilter('amenities', amenity)}
                      />
                    }
                    label={<Typography variant="body2">{amenity}</Typography>}
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
              Cost Range (₹{filters.priceRange[0]} - ₹{filters.priceRange[1]})
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
              min={1000}
              max={100000}
              step={1000}
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
                  {filteredCampervans.length} Campervans Available
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

          {/* Campervans Grid */}
          {filteredCampervans.length === 0 ? (
            <Alert severity="info" className="text-center">
              No campervans available for selected criteria. Change filter options and try again.
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampervans.map(campervan => (
                <div key={campervan.id}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardMedia
                      component="img"
                      height="200"
                      image={campervan.image}
                      alt={campervan.name}
                      className="h-48 object-cover"
                    />
                    <CardContent className="flex-1 flex flex-col">
                      <Box className="flex items-start justify-between mb-2">
                        <Box>
                          <Typography variant="h6" className="font-semibold text-foreground">
                            {campervan.brand} {campervan.model}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {campervan.year} • {campervan.transmission} • {campervan.fuelType} • {campervan.carType}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-2 mb-3">
                        <Rating value={campervan.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({campervan.reviews} reviews)
                        </Typography>
                      </Box>

                      <Box className="mb-3">
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                          <Schedule fontSize="small" />
                          {campervan.operatingHours}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1 mt-1">
                          <LocationOn fontSize="small" />
                          {campervan.pickupLocation}, {campervan.city}
                        </Typography>
                      </Box>

                      <Box className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Group fontSize="small" />
                          {campervan.seatingCapacity} seats
                        </div>
                        <div className="flex items-center gap-1">
                          <Luggage fontSize="small" />
                          {campervan.baggageCapacity}
                        </div>
                        <span>{campervan.trips} trips</span>
                      </Box>

                      {/* Toilet and Shower Info */}
                      <Box className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Wc fontSize="small" />
                          {campervan.toiletType}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shower fontSize="small" />
                          {campervan.showerType}
                        </div>
                      </Box>

                      {/* Amenities */}
                      <Box className="mb-3">
                        <Typography variant="body2" className="font-medium mb-2">Amenities:</Typography>
                        <Box className="flex flex-wrap gap-1">
                          {campervan.amenities.map(amenity => (
                            <Chip
                              key={amenity}
                              size="small"
                              label={amenity}
                              variant="outlined"
                              icon={getAmenityIcon(amenity)}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Divider className="my-2" />

                      <Box className="mb-3">
                        <Typography variant="body1" className="font-semibold text-primary">
                          ₹{campervan.pricePerHour}/hour • ₹{campervan.pricePerDay}/day
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{campervan.pricePerWeek}/week • Safety Deposit: ₹{campervan.safetyDeposit}
                        </Typography>
                      </Box>

                      <Box className="flex gap-2 mt-auto">
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleBookNow(campervan)}
                          disabled={!currentUser}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Box>

        {/* Booking Modal */}
        {selectedCampervan && (
          <BookingModal
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            bike={selectedCampervan}
            currentUser={currentUser}
          />
        )}
      </Box>
    </LocalizationProvider>
  )
}