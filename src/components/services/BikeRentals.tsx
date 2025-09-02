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
  ArrowBack,
  CheckCircle,
  AccessTime,
  Warning,
  Cancel,
  CreditCard,
  Payment,
  AccountBalance
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

interface BikeRentalsProps {
  currentUser: User | null
  filterSidebarOpen: boolean
}

interface BikeFilters {
  city: string
  fromDateTime: Dayjs | null
  toDateTime: Dayjs | null
  pickupLocation: string[]
  transmission: string[]
  fuelType: string[]
  rentType: string[]
  brands: string[]
  makeYear: number[]
  priceRange: [number, number]
  nearMe: boolean
}

interface Bike {
  id: string
  name: string
  model: string
  brand: string
  year: number
  transmission: string
  fuelType: string
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
}

const mockBikes: Bike[] = [
  // Mumbai Bikes
  {
    id: '1',
    name: 'Honda Activa 6G',
    model: 'Activa 6G',
    brand: 'Honda',
    year: 2023,
    transmission: 'gearless',
    fuelType: 'petrol',
    pricePerHour: 25,
    pricePerDay: 400,
    pricePerWeek: 2500,
    pricePerMonth: 8000,
    rating: 4.5,
    reviews: 156,
    trips: 89,
    safetyDeposit: 3000,
    city: 'Mumbai',
    pickupLocation: 'Andheri West',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.1367, longitude: 72.8269 },
    providerId: 'provider1',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Helmet mandatory. No modifications allowed.'
  },
  {
    id: '2',
    name: 'Royal Enfield Classic 350',
    model: 'Classic 350',
    brand: 'Royal Enfield',
    year: 2022,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 50,
    pricePerDay: 800,
    pricePerWeek: 5000,
    pricePerMonth: 18000,
    rating: 4.7,
    reviews: 89,
    trips: 134,
    safetyDeposit: 5000,
    city: 'Mumbai',
    pickupLocation: 'Bandra East',
    operatingHours: '7:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    providerId: 'provider2',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Full tank return policy. No pillion rider without helmet.'
  },
  {
    id: '3',
    name: 'TVS Jupiter',
    model: 'Jupiter',
    brand: 'TVS',
    year: 2021,
    transmission: 'gearless',
    fuelType: 'petrol',
    pricePerHour: 20,
    pricePerDay: 350,
    pricePerWeek: 2200,
    pricePerMonth: 7500,
    rating: 4.3,
    reviews: 67,
    trips: 124,
    safetyDeposit: 2500,
    city: 'Mumbai',
    pickupLocation: 'Powai',
    operatingHours: '6:30 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.1176, longitude: 72.9060 },
    providerId: 'provider1',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Return with same fuel level. Late charges applicable.'
  },
  // Delhi Bikes
  {
    id: '4',
    name: 'Honda CB Hornet 160R',
    model: 'CB Hornet 160R',
    brand: 'Honda',
    year: 2023,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 40,
    pricePerDay: 600,
    pricePerWeek: 3800,
    pricePerMonth: 14000,
    rating: 4.6,
    reviews: 112,
    trips: 78,
    safetyDeposit: 4000,
    city: 'Delhi',
    pickupLocation: 'Connaught Place',
    operatingHours: '6:00 AM - 11:00 PM',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    providerId: 'provider3',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'No night riding after 11 PM. Fuel charges extra.'
  },
  {
    id: '5',
    name: 'Yamaha FZ-S',
    model: 'FZ-S',
    brand: 'Yamaha',
    year: 2022,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 45,
    pricePerDay: 750,
    pricePerWeek: 4500,
    pricePerMonth: 16000,
    rating: 4.8,
    reviews: 203,
    trips: 156,
    safetyDeposit: 5000,
    city: 'Delhi',
    pickupLocation: 'Karol Bagh',
    operatingHours: '5:30 AM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6542, longitude: 77.1905 },
    providerId: 'provider4',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Strict no smoking policy. GPS tracking enabled.'
  },
  // Bangalore Bikes
  {
    id: '6',
    name: 'KTM Duke 200',
    model: 'Duke 200',
    brand: 'KTM',
    year: 2023,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 60,
    pricePerDay: 1000,
    pricePerWeek: 6500,
    pricePerMonth: 22000,
    rating: 4.9,
    reviews: 87,
    trips: 95,
    safetyDeposit: 8000,
    city: 'Bangalore',
    pickupLocation: 'Koramangala',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    providerId: 'provider5',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Performance bike - experienced riders only. Speed limit 80 km/h.'
  },
  {
    id: '7',
    name: 'Suzuki Gixxer',
    model: 'Gixxer',
    brand: 'Suzuki',
    year: 2022,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 35,
    pricePerDay: 550,
    pricePerWeek: 3500,
    pricePerMonth: 12500,
    rating: 4.4,
    reviews: 134,
    trips: 98,
    safetyDeposit: 4000,
    city: 'Bangalore',
    pickupLocation: 'Whitefield',
    operatingHours: '6:30 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9698, longitude: 77.7500 },
    providerId: 'provider6',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Regular maintenance checks. Fuel policy as per usage.'
  },
  // Chennai Bikes
  {
    id: '8',
    name: 'Honda Dio',
    model: 'Dio',
    brand: 'Honda',
    year: 2021,
    transmission: 'gearless',
    fuelType: 'petrol',
    pricePerHour: 22,
    pricePerDay: 380,
    pricePerWeek: 2400,
    pricePerMonth: 8500,
    rating: 4.2,
    reviews: 76,
    trips: 89,
    safetyDeposit: 2500,
    city: 'Chennai',
    pickupLocation: 'T. Nagar',
    operatingHours: '6:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    providerId: 'provider7',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'City riding only. No highway usage allowed.'
  },
  {
    id: '9',
    name: 'Bajaj Pulsar NS200',
    model: 'Pulsar NS200',
    brand: 'Bajaj',
    year: 2023,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 42,
    pricePerDay: 700,
    pricePerWeek: 4200,
    pricePerMonth: 15000,
    rating: 4.6,
    reviews: 98,
    trips: 67,
    safetyDeposit: 5000,
    city: 'Chennai',
    pickupLocation: 'Anna Nagar',
    operatingHours: '5:30 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0878, longitude: 80.2785 },
    providerId: 'provider8',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Sports bike handling experience required. Insurance included.'
  },
  // Kolkata Bikes
  {
    id: '10',
    name: 'TVS Apache RTR 160',
    model: 'Apache RTR 160',
    brand: 'TVS',
    year: 2022,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 38,
    pricePerDay: 620,
    pricePerWeek: 3800,
    pricePerMonth: 13500,
    rating: 4.5,
    reviews: 145,
    trips: 78,
    safetyDeposit: 4000,
    city: 'Kolkata',
    pickupLocation: 'Park Street',
    operatingHours: '6:00 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    providerId: 'provider9',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Regular servicing maintained. Traffic rule compliance mandatory.'
  },
  // Hyderabad Bikes
  {
    id: '11',
    name: 'Royal Enfield Bullet 350',
    model: 'Bullet 350',
    brand: 'Royal Enfield',
    year: 2021,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 48,
    pricePerDay: 850,
    pricePerWeek: 5200,
    pricePerMonth: 18500,
    rating: 4.7,
    reviews: 67,
    trips: 89,
    safetyDeposit: 6000,
    city: 'Hyderabad',
    pickupLocation: 'Banjara Hills',
    operatingHours: '6:30 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 17.3850, longitude: 78.4867 },
    providerId: 'provider10',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Classic bike experience. Proper gear recommended.'
  },
  // Pune Bikes
  {
    id: '12',
    name: 'Bajaj Dominar 400',
    model: 'Dominar 400',
    brand: 'Bajaj',
    year: 2023,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 55,
    pricePerDay: 900,
    pricePerWeek: 5800,
    pricePerMonth: 20000,
    rating: 4.8,
    reviews: 89,
    trips: 45,
    safetyDeposit: 7000,
    city: 'Pune',
    pickupLocation: 'Koregaon Park',
    operatingHours: '6:00 AM - 10:30 PM',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.5204, longitude: 73.8567 },
    providerId: 'provider11',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Touring bike suitable for long rides. Full insurance coverage.'
  },
  {
    id: '13',
    name: 'Hero Splendor Plus',
    model: 'Splendor Plus',
    brand: 'Hero',
    year: 2022,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 18,
    pricePerDay: 300,
    pricePerWeek: 1800,
    pricePerMonth: 6500,
    rating: 4.1,
    reviews: 234,
    trips: 156,
    safetyDeposit: 2000,
    city: 'Pune',
    pickupLocation: 'Shivaji Nagar',
    operatingHours: '6:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.5362, longitude: 73.8512 },
    providerId: 'provider12',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Economic option for daily commute. Fuel efficient.'
  },
  // Ahmedabad Bikes
  {
    id: '14',
    name: 'Yamaha R15 V3',
    model: 'R15 V3',
    brand: 'Yamaha',
    year: 2023,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 65,
    pricePerDay: 1100,
    pricePerWeek: 7000,
    pricePerMonth: 25000,
    rating: 4.9,
    reviews: 78,
    trips: 34,
    safetyDeposit: 10000,
    city: 'Ahmedabad',
    pickupLocation: 'Satellite',
    operatingHours: '7:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    providerId: 'provider13',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Sports bike - minimum 2 years riding experience required.'
  },
  {
    id: '15',
    name: 'Suzuki Access 125',
    model: 'Access 125',
    brand: 'Suzuki',
    year: 2022,
    transmission: 'gearless',
    fuelType: 'petrol',
    pricePerHour: 24,
    pricePerDay: 420,
    pricePerWeek: 2600,
    pricePerMonth: 9000,
    rating: 4.4,
    reviews: 167,
    trips: 123,
    safetyDeposit: 3000,
    city: 'Ahmedabad',
    pickupLocation: 'Navrangpura',
    operatingHours: '6:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 23.0395, longitude: 72.5662 },
    providerId: 'provider14',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Comfortable scooter for city rides. Storage space available.'
  },
  // Additional bikes for variety
  {
    id: '16',
    name: 'Honda CB Shine',
    model: 'CB Shine',
    brand: 'Honda',
    year: 2021,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 28,
    pricePerDay: 450,
    pricePerWeek: 2800,
    pricePerMonth: 10000,
    rating: 4.3,
    reviews: 198,
    trips: 145,
    safetyDeposit: 3000,
    city: 'Mumbai',
    pickupLocation: 'Thane',
    operatingHours: '6:00 AM - 9:30 PM',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.2183, longitude: 72.9781 },
    providerId: 'provider1',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Reliable bike for daily use. Regular maintenance done.'
  },
  {
    id: '17',
    name: 'KTM RC 200',
    model: 'RC 200',
    brand: 'KTM',
    year: 2023,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 70,
    pricePerDay: 1200,
    pricePerWeek: 7500,
    pricePerMonth: 26000,
    rating: 4.8,
    reviews: 45,
    trips: 23,
    safetyDeposit: 12000,
    city: 'Delhi',
    pickupLocation: 'Gurgaon',
    operatingHours: '7:00 AM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    providerId: 'provider15',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Track-focused bike. Professional riding experience mandatory.'
  },
  {
    id: '18',
    name: 'Mahindra Mojo',
    model: 'Mojo',
    brand: 'Mahindra',
    year: 2022,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 52,
    pricePerDay: 850,
    pricePerWeek: 5500,
    pricePerMonth: 19000,
    rating: 4.5,
    reviews: 67,
    trips: 43,
    safetyDeposit: 6000,
    city: 'Bangalore',
    pickupLocation: 'Electronic City',
    operatingHours: '6:30 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.8456, longitude: 77.6603 },
    providerId: 'provider16',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card'],
    termsAndConditions: 'Touring bike ideal for weekend trips. GPS navigation included.'
  },
  {
    id: '19',
    name: 'Triumph Street Twin',
    model: 'Street Twin',
    brand: 'Triumph',
    year: 2023,
    transmission: 'gear',
    fuelType: 'petrol',
    pricePerHour: 80,
    pricePerDay: 1500,
    pricePerWeek: 9500,
    pricePerMonth: 35000,
    rating: 4.9,
    reviews: 23,
    trips: 12,
    safetyDeposit: 15000,
    city: 'Chennai',
    pickupLocation: 'Adyar',
    operatingHours: '8:00 AM - 7:00 PM',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0067, longitude: 80.2206 },
    providerId: 'provider17',
    documentsRequired: ['Driving License', 'Aadhar Card', 'PAN Card', 'Passport'],
    termsAndConditions: 'Premium motorcycle. Advanced riding skills required. Full insurance.'
  },
  {
    id: '20',
    name: 'Piaggio Vespa',
    model: 'Vespa SXL 150',
    brand: 'Piaggio',
    year: 2021,
    transmission: 'gearless',
    fuelType: 'petrol',
    pricePerHour: 32,
    pricePerDay: 550,
    pricePerWeek: 3200,
    pricePerMonth: 12000,
    rating: 4.6,
    reviews: 89,
    trips: 67,
    safetyDeposit: 4000,
    city: 'Kolkata',
    pickupLocation: 'Salt Lake',
    operatingHours: '7:00 AM - 8:30 PM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5958, longitude: 88.4497 },
    providerId: 'provider18',
    documentsRequired: ['Driving License', 'Aadhar Card'],
    termsAndConditions: 'Stylish scooter perfect for city exploration. Vintage charm included.'
  }
]

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']
const transmissionTypes = ['gear', 'gearless']
const fuelTypes = ['petrol', 'cng', 'cng-petrol', 'diesel', 'EV']
const rentTypes = ['hours', 'days', 'weeks', 'months']
const brands = ['Honda', 'Mahindra', 'Maruti Suzuki', 'Piaggio', 'Royal Enfield', 'Suzuki', 'Triumph', 'TVS', 'Yamaha']
const makeYears = Array.from({ length: 26 }, (_, i) => 2000 + i)

export function BikeRentals({ currentUser, filterSidebarOpen }: BikeRentalsProps) {
  const [bikes] = useLocalStorage<Bike[]>('bikes', mockBikes)
  const [filters, setFilters] = useState<BikeFilters>({
    city: '',
    fromDateTime: null,
    toDateTime: null,
    pickupLocation: [],
    transmission: [],
    fuelType: [],
    rentType: [],
    brands: [],
    makeYear: [],
    priceRange: [100, 10000],
    nearMe: false
  })
  
  const [sortBy, setSortBy] = useState('rating')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>(bikes)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list')

  const pickupLocations = Array.from(new Set(bikes.map(bike => bike.pickupLocation)))

  // Filter and sort bikes based on current filters
  useEffect(() => {
    let result = bikes.filter(bike => {
      if (!bike.available) return false
      
      // City filter
      if (filters.city && bike.city !== filters.city) return false
      
      // Pickup location filter (OR logic)
      if (filters.pickupLocation.length > 0 && !filters.pickupLocation.includes(bike.pickupLocation)) return false
      
      // Transmission filter (OR logic)
      if (filters.transmission.length > 0 && !filters.transmission.includes(bike.transmission)) return false
      
      // Fuel type filter (OR logic)
      if (filters.fuelType.length > 0 && !filters.fuelType.includes(bike.fuelType)) return false
      
      // Brand filter (OR logic)
      if (filters.brands.length > 0 && !filters.brands.includes(bike.brand)) return false
      
      // Year filter (OR logic)
      if (filters.makeYear.length > 0 && !filters.makeYear.includes(bike.year)) return false
      
      // Price range filter
      const price = bike.pricePerDay
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      
      return true
    })

    // Apply search terms within each filter category
    Object.entries(searchTerms).forEach(([category, term]) => {
      if (term) {
        switch (category) {
          case 'brands':
            result = result.filter(bike => 
              bike.brand.toLowerCase().includes(term.toLowerCase())
            )
            break
          case 'pickupLocation':
            result = result.filter(bike => 
              bike.pickupLocation.toLowerCase().includes(term.toLowerCase())
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

    setFilteredBikes(result)
  }, [bikes, filters, sortBy, sortOrder, userLocation, searchTerms])

  const handleFilterChange = (category: keyof BikeFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleMultiSelectFilter = (category: keyof BikeFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[category] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [category]: newValues
      }
    })
  }

  const handleRemoveFilter = (category: keyof BikeFilters, value?: string) => {
    if (value) {
      handleMultiSelectFilter(category, value)
    } else {
      if (category === 'nearMe') {
        handleFilterChange('nearMe', false)
      } else if (category === 'priceRange') {
        handleFilterChange('priceRange', [100, 10000])
      } else {
        handleFilterChange(category, category.includes('DateTime') ? null : '')
      }
    }
  }

  const handleNearMe = async () => {
    try {
      const location = await locationService.getCurrentLocation()
      setUserLocation(location)
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

  const handleBookNow = (bike: Bike) => {
    setSelectedBike(bike)
    setCurrentView('detail')
  }

  const getActiveFilterChips = () => {
    const chips: Array<{ label: string; category: keyof BikeFilters; value?: string }> = []
    
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
    filters.brands.forEach(brand => 
      chips.push({ label: `Brand: ${brand}`, category: 'brands', value: brand })
    )
    filters.makeYear.forEach(year => 
      chips.push({ label: `Year: ${year}`, category: 'makeYear', value: year.toString() })
    )
    
    if (filters.priceRange[0] !== 100 || filters.priceRange[1] !== 10000) {
      chips.push({ label: `Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`, category: 'priceRange' })
    }
    
    return chips
  }

  // Detailed Bike View Component - New Structure
  const BikeDetailPage = ({ bike }: { bike: Bike }) => {
    // Import required components for inline booking
    const [bookingDetails, setBookingDetails] = useState({
      startDateTime: dayjs().add(1, 'hour'),
      endDateTime: dayjs().add(1, 'day'),
      rentType: 'days' as 'hours' | 'days' | 'weeks' | 'months',
      totalAmount: 0,
      securityDeposit: bike.safetyDeposit,
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
        amount = hours * bike.pricePerHour
      } else if (bookingDetails.rentType === 'days') {
        const days = Math.ceil(endTime.diff(startTime, 'day', true))
        amount = days * bike.pricePerDay
      } else if (bookingDetails.rentType === 'weeks') {
        const weeks = Math.ceil(endTime.diff(startTime, 'week', true))
        amount = weeks * bike.pricePerWeek
      } else if (bookingDetails.rentType === 'months') {
        const months = Math.ceil(endTime.diff(startTime, 'month', true))
        amount = months * bike.pricePerMonth
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
        
        toast.success('🎉 Booking confirmed successfully!')
        setCurrentView('list')
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
                onClick={() => setCurrentView('list')}
                sx={{ mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {bike.name}
              </Typography>
              <Chip 
                label={bike.available ? "Available" : "Booked"} 
                color={bike.available ? "success" : "error"}
                variant="outlined"
              />
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" className="py-6">
            {/* First Row: Bike Image + Booking Panel */}
            <Box className="mb-8">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Left: Bike Image */}
                <Card className="overflow-hidden">
                  <CardMedia
                    component="img"
                    height="400"
                    image={bike.image}
                    alt={bike.name}
                    className="object-cover"
                    sx={{ width: '100%', height: '400px' }}
                  />
                </Card>

                {/* Right: Booking Panel */}
                <Card>
                  <CardContent className="p-6">
                    <Typography variant="h5" className="font-bold mb-2">
                      Complete Your Booking
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-4">
                      Fill in the details below to book {bike.brand} {bike.model}
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
                          <MenuItem value="hours">Hourly (₹{bike.pricePerHour}/hour)</MenuItem>
                          <MenuItem value="days">Daily (₹{bike.pricePerDay}/day)</MenuItem>
                          <MenuItem value="weeks">Weekly (₹{bike.pricePerWeek}/week)</MenuItem>
                          <MenuItem value="months">Monthly (₹{bike.pricePerMonth}/month)</MenuItem>
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
                      disabled={loading || !bike.available}
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

            {/* Second Row: Complete Bike Details in One Box */}
            <Card>
              <CardContent className="p-6">
                <Typography variant="h4" className="font-bold mb-6 text-center">
                  {bike.brand} {bike.model} - Complete Details
                </Typography>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                  
                  {/* Overview Section */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-blue-600 border-b border-blue-200 pb-2">
                      📋 Overview
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Brand:</Typography>
                        <Typography variant="body2" className="font-medium">{bike.brand}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Model:</Typography>
                        <Typography variant="body2" className="font-medium">{bike.model}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Year:</Typography>
                        <Typography variant="body2" className="font-medium">{bike.year}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Rating:</Typography>
                        <Box className="flex items-center">
                          <Rating value={bike.rating} readOnly size="small" />
                          <Typography variant="body2" className="ml-1">({bike.reviews} reviews)</Typography>
                        </Box>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Total Trips:</Typography>
                        <Typography variant="body2" className="font-medium">{bike.trips}</Typography>
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
                        <Typography variant="body2" className="font-medium capitalize">{bike.transmission}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Fuel Type:</Typography>
                        <Typography variant="body2" className="font-medium uppercase">{bike.fuelType}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Engine:</Typography>
                        <Typography variant="body2" className="font-medium">110cc (Estimated)</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Mileage:</Typography>
                        <Typography variant="body2" className="font-medium">60 km/l (Approx)</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Max Speed:</Typography>
                        <Typography variant="body2" className="font-medium">85 km/h</Typography>
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
                        <Typography variant="body2" className="font-medium text-green-600">₹{bike.pricePerHour}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Day:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{bike.pricePerDay}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Week:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{bike.pricePerWeek}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Per Month:</Typography>
                        <Typography variant="body2" className="font-medium text-green-600">₹{bike.pricePerMonth}</Typography>
                      </Box>
                      <Box className="flex justify-between border-t pt-2">
                        <Typography variant="body2" className="font-semibold">Security Deposit:</Typography>
                        <Typography variant="body2" className="font-semibold text-orange-600">₹{bike.safetyDeposit}</Typography>
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
                        <Typography variant="body2" className="font-medium">{bike.city}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Location:</Typography>
                        <Typography variant="body2" className="font-medium">{bike.pickupLocation}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Operating Hours:</Typography>
                        <Typography variant="body2" className="font-medium">{bike.operatingHours}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Coordinates:</Typography>
                        <Typography variant="body2" className="font-medium text-xs">
                          {bike.coordinates.latitude.toFixed(4)}, {bike.coordinates.longitude.toFixed(4)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Required Documents */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-indigo-600 border-b border-indigo-200 pb-2">
                      📄 Required Documents
                    </Typography>
                    <Box className="space-y-2">
                      {bike.documentsRequired.map((doc, index) => (
                        <Box key={index} className="flex items-center">
                          <CheckCircle className="text-green-500 mr-2" fontSize="small" />
                          <Typography variant="body2">{doc}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Service Provider Contact */}
                  <Box>
                    <Typography variant="h6" className="mb-3 font-semibold text-teal-600 border-b border-teal-200 pb-2">
                      📞 Service Provider Contact
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Provider:</Typography>
                        <Typography variant="body2" className="font-medium">TravelSpark Rentals</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Phone:</Typography>
                        <Typography variant="body2" className="font-medium text-blue-600">+91-9876543210</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2" color="textSecondary">Email:</Typography>
                        <Typography variant="body2" className="font-medium text-blue-600">support@travelspark.com</Typography>
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
                    {bike.termsAndConditions}
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
                          • Late return penalty: ₹1000 + one day additional rent
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

  // Show detailed view if selected
  if (currentView === 'detail' && selectedBike) {
    return <BikeDetailPage bike={selectedBike} />
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

          {/* Rent Type Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Rent Duration</Typography>
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
              min={100}
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
                  {filteredBikes.length} Bikes Available
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

          {/* Bikes Grid */}
          {filteredBikes.length === 0 ? (
            <Alert severity="info" className="text-center">
              No bike rides available for selected criteria. Change filter options and try again.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredBikes.map(bike => (
                <Grid item xs={12} md={6} lg={4} key={bike.id}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardMedia
                      component="img"
                      height="200"
                      image={bike.image}
                      alt={bike.name}
                      className="h-48 object-cover"
                    />
                    <CardContent className="flex-1 flex flex-col">
                      <Box className="flex items-start justify-between mb-2">
                        <Box>
                          <Typography variant="h6" className="font-semibold text-foreground">
                            {bike.brand} {bike.model}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {bike.year} • {bike.transmission} • {bike.fuelType.toUpperCase()} • trips {bike.trips}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-2 mb-3">
                        <Rating value={bike.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({bike.reviews} reviews)
                        </Typography>
                      </Box>

                      <Box className="mb-3">
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                          <Schedule fontSize="small" />
                          {bike.operatingHours}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1 mt-1">
                          <LocationOn fontSize="small" />
                          {bike.pickupLocation}, {bike.city}
                        </Typography>
                      </Box>

                      <Divider className="my-2" />

                      <Box className="mb-3">
                        <Typography variant="body1" className="font-semibold text-primary">
                          ₹{bike.pricePerHour}/hour • ₹{bike.pricePerDay}/day
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Safety Deposit: ₹{bike.safetyDeposit}
                        </Typography>
                      </Box>

                      <Box className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        {/* Removed trips badge as it's now in the main description */}
                      </Box>

                      <Box className="flex gap-2 mt-auto">
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleBookNow(bike)}
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
        {selectedBike && (
          <BookingModal
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            bike={selectedBike}
            currentUser={currentUser}
          />
        )}
      </Box>
    </LocalizationProvider>
  )
}