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
  CardMedia
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
  Bed,
  Wifi,
  Pool,
  FitnessCenter,
  Kitchen,
  AcUnit,
  Bathtub,
  Balcony,
  Pets,
  LocalParking,
  RoomService,
  Business,
  Fireplace,
  HotTub,
  Terrain,
  Hotel,
  Home,
  Villa,
  Apartment,
  ArrowBack,
  CheckCircle,
  AccessTime,
  Security,
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
import { AppBar, Toolbar, Tabs, Tab, IconButton } from '@mui/material'
import { BookingModal } from '@/components/booking/BookingModal'
import { NearMeButton } from '@/components/ui/NearMeButton'
import { toast } from 'sonner'

interface NomadHotelsProps {
  currentUser: User | null
  filterSidebarOpen: boolean
}

interface HotelFilters {
  city: string
  fromDateTime: Dayjs | null
  toDateTime: Dayjs | null
  location: string[]
  propertyType: string[]
  bedrooms: number[]
  bathrooms: number[]
  bedPreference: string[]
  duration: string[]
  priceRange: [number, number]
  facilities: string[]
  roomFacilities: string[]
  guestCapacity: number[]
  nearMe: boolean
}

interface Hotel {
  id: string
  name: string
  propertyType: string
  city: string
  location: string
  address: string
  bedrooms: number
  bathrooms: number
  bedPreference: string
  guestCapacity: number
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  rating: number
  reviews: number
  bookings: number
  safetyDeposit: number
  operatingHours: string
  minimumDuration: string
  maximumDuration: string
  image: string
  images: string[]
  available: boolean
  coordinates: { latitude: number; longitude: number }
  providerId: string
  termsAndConditions: string
  facilities: string[]
  roomFacilities: string[]
  description: string
  workFriendly: boolean
  instantBook: boolean
  cancellationPolicy: string
}

// Mock data for hotels
const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'WorkSpace Villa Premium',
    propertyType: 'villa',
    city: 'Goa',
    location: 'Baga Beach',
    address: '123 Beach Road, Baga, Goa 403516',
    bedrooms: 3,
    bathrooms: 2,
    bedPreference: 'double',
    guestCapacity: 6,
    pricePerDay: 3500,
    pricePerWeek: 21000,
    pricePerMonth: 80000,
    rating: 4.8,
    reviews: 256,
    bookings: 134,
    safetyDeposit: 10000,
    operatingHours: '24/7 Reception',
    minimumDuration: '3 days',
    maximumDuration: '6 months',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 15.5557, longitude: 73.7544 },
    providerId: 'provider1',
    termsAndConditions: 'No smoking, no pets. Check-in after 2 PM, check-out before 11 AM.',
    facilities: ['free wifi', 'swimming pool', 'parking', 'gym'],
    roomFacilities: ['air conditioning', 'TV', 'private bathroom', 'balcony', 'kitchen'],
    description: 'Luxury villa with modern amenities, perfect for remote work and relaxation.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in'
  },
  {
    id: '2',
    name: 'Nomad Hub Apartment',
    propertyType: 'apartment',
    city: 'Bangalore',
    location: 'Koramangala',
    address: '456 Tech Park Road, Koramangala, Bangalore 560034',
    bedrooms: 2,
    bathrooms: 2,
    bedPreference: 'queen',
    guestCapacity: 4,
    pricePerDay: 2800,
    pricePerWeek: 17000,
    pricePerMonth: 65000,
    rating: 4.6,
    reviews: 189,
    bookings: 98,
    safetyDeposit: 5000,
    operatingHours: '24/7 Security',
    minimumDuration: '1 week',
    maximumDuration: '1 year',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    providerId: 'provider2',
    termsAndConditions: 'Working professionals preferred. Quiet hours 10 PM - 7 AM.',
    facilities: ['free wifi', 'gym', 'parking', 'family rooms'],
    roomFacilities: ['air conditioning', 'TV', 'kitchen', 'washing machine', 'private bathroom'],
    description: 'Modern apartment in tech hub, ideal for digital nomads and remote workers.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Flexible cancellation policy'
  },
  {
    id: '3',
    name: 'Beach Resort Studio',
    propertyType: 'resort',
    city: 'Mumbai',
    location: 'Juhu Beach',
    address: '789 Beach Front, Juhu, Mumbai 400049',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'king',
    guestCapacity: 2,
    pricePerDay: 4200,
    pricePerWeek: 25000,
    pricePerMonth: 95000,
    rating: 4.7,
    reviews: 134,
    bookings: 45,
    safetyDeposit: 7000,
    operatingHours: '24/7 Concierge',
    minimumDuration: '2 days',
    maximumDuration: '3 months',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.0990, longitude: 72.8258 },
    providerId: 'provider3',
    termsAndConditions: 'Resort rules apply. Beach access included.',
    facilities: ['free wifi', 'swimming pool', 'gym', 'room service', 'family rooms'],
    roomFacilities: ['air conditioning', 'sea view', 'TV', 'refrigerator', 'private bathroom'],
    description: 'Luxury beach resort perfect for working remotely with ocean views.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '4',
    name: 'Mountain Homestay',
    propertyType: 'homestay',
    city: 'Manali',
    location: 'Old Manali',
    address: '321 Hill Station Road, Old Manali, HP 175131',
    bedrooms: 2,
    bathrooms: 2,
    bedPreference: 'single',
    guestCapacity: 4,
    pricePerDay: 1800,
    pricePerWeek: 11000,
    pricePerMonth: 40000,
    rating: 4.4,
    reviews: 78,
    bookings: 123,
    safetyDeposit: 2000,
    operatingHours: '8:00 AM - 8:00 PM',
    minimumDuration: '5 days',
    maximumDuration: '2 months',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 32.2432, longitude: 77.1892 },
    providerId: 'provider1',
    termsAndConditions: 'Mountain safety guidelines must be followed.',
    facilities: ['free wifi', 'parking', 'fireplace', 'mountain view'],
    roomFacilities: ['kitchen', 'TV', 'fireplace', 'mountain view', 'private bathroom'],
    description: 'Peaceful mountain retreat perfect for remote work with stunning views.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Strict cancellation policy'
  },
  {
    id: '5',
    name: 'Tech Hub Coliving',
    propertyType: 'apartment',
    city: 'Delhi',
    location: 'Connaught Place',
    address: '50 Central Delhi, Connaught Place, Delhi 110001',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'queen',
    guestCapacity: 2,
    pricePerDay: 3200,
    pricePerWeek: 19000,
    pricePerMonth: 72000,
    rating: 4.5,
    reviews: 167,
    bookings: 89,
    safetyDeposit: 6000,
    operatingHours: '24/7 Security',
    minimumDuration: '1 week',
    maximumDuration: '1 year',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    providerId: 'provider4',
    termsAndConditions: 'Professionals only. No parties allowed.',
    facilities: ['free wifi', 'gym', 'parking', 'electric charging'],
    roomFacilities: ['air conditioning', 'TV', 'kitchen', 'refrigerator', 'private bathroom'],
    description: 'Modern coliving space in the heart of Delhi for digital nomads.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '6',
    name: 'Heritage Palace Hotel',
    propertyType: 'hotel',
    city: 'Udaipur',
    location: 'Lake Pichola',
    address: '12 Palace Road, Lake Pichola, Udaipur 313001',
    bedrooms: 2,
    bathrooms: 2,
    bedPreference: 'king',
    guestCapacity: 4,
    pricePerDay: 5500,
    pricePerWeek: 33000,
    pricePerMonth: 125000,
    rating: 4.9,
    reviews: 312,
    bookings: 156,
    safetyDeposit: 15000,
    operatingHours: '24/7 Concierge',
    minimumDuration: '2 days',
    maximumDuration: '1 month',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 24.5854, longitude: 73.7125 },
    providerId: 'provider5',
    termsAndConditions: 'Palace etiquette expected. Cultural dress code for common areas.',
    facilities: ['free wifi', 'swimming pool', 'room service', 'gym', 'family rooms'],
    roomFacilities: ['air conditioning', 'balcony', 'TV', 'refrigerator', 'private bathroom'],
    description: 'Luxury heritage palace with lake views and royal treatment.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Strict cancellation policy'
  },
  {
    id: '7',
    name: 'Coastal Retreat Lodge',
    propertyType: 'lodge',
    city: 'Chennai',
    location: 'Marina Beach',
    address: '88 Beach Road, Marina Beach, Chennai 600001',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'double',
    guestCapacity: 3,
    pricePerDay: 2200,
    pricePerWeek: 13500,
    pricePerMonth: 50000,
    rating: 4.3,
    reviews: 98,
    bookings: 67,
    safetyDeposit: 3000,
    operatingHours: '6:00 AM - 11:00 PM',
    minimumDuration: '3 days',
    maximumDuration: '3 months',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
    providerId: 'provider6',
    termsAndConditions: 'Beach access included. No loud music after 9 PM.',
    facilities: ['free wifi', 'parking', 'family rooms'],
    roomFacilities: ['air conditioning', 'sea view', 'TV', 'private bathroom'],
    description: 'Peaceful lodge with direct beach access and ocean views.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Flexible cancellation policy'
  },
  {
    id: '8',
    name: 'Cultural Heritage Stay',
    propertyType: 'homestay',
    city: 'Kolkata',
    location: 'Park Street',
    address: '25 Park Street, Kolkata 700016',
    bedrooms: 3,
    bathrooms: 2,
    bedPreference: 'single',
    guestCapacity: 5,
    pricePerDay: 1900,
    pricePerWeek: 11500,
    pricePerMonth: 42000,
    rating: 4.4,
    reviews: 145,
    bookings: 112,
    safetyDeposit: 2500,
    operatingHours: '7:00 AM - 10:00 PM',
    minimumDuration: '1 week',
    maximumDuration: '6 months',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    providerId: 'provider7',
    termsAndConditions: 'Respect for local culture expected. Bengali cuisine available.',
    facilities: ['free wifi', 'parking', 'family rooms'],
    roomFacilities: ['air conditioning', 'TV', 'kitchen', 'private bathroom'],
    description: 'Traditional Bengali homestay in the cultural heart of Kolkata.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '9',
    name: 'Business Capsule Hotel',
    propertyType: 'capsule hotel',
    city: 'Hyderabad',
    location: 'HITEC City',
    address: '100 Cyber Towers, HITEC City, Hyderabad 500081',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'single',
    guestCapacity: 1,
    pricePerDay: 1200,
    pricePerWeek: 7500,
    pricePerMonth: 28000,
    rating: 4.1,
    reviews: 89,
    bookings: 234,
    safetyDeposit: 1000,
    operatingHours: '24/7 Access',
    minimumDuration: '1 day',
    maximumDuration: '1 month',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c39a?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1520637836862-4d197d17c39a?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 17.4435, longitude: 78.3772 },
    providerId: 'provider8',
    termsAndConditions: 'Corporate travelers preferred. Quiet capsule environment.',
    facilities: ['free wifi', 'electric charging', 'gym'],
    roomFacilities: ['air conditioning', 'TV', 'private bathroom'],
    description: 'Modern capsule hotel perfect for business travelers and short stays.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Free cancellation up to 24 hours'
  },
  {
    id: '10',
    name: 'Garden Farm Stay',
    propertyType: 'farm stay',
    city: 'Pune',
    location: 'Lonavala',
    address: '45 Hill Station Road, Lonavala, Pune 410401',
    bedrooms: 2,
    bathrooms: 2,
    bedPreference: 'double',
    guestCapacity: 4,
    pricePerDay: 2500,
    pricePerWeek: 15000,
    pricePerMonth: 55000,
    rating: 4.6,
    reviews: 178,
    bookings: 95,
    safetyDeposit: 3500,
    operatingHours: '6:00 AM - 9:00 PM',
    minimumDuration: '2 days',
    maximumDuration: '3 months',
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 18.7537, longitude: 73.4076 },
    providerId: 'provider9',
    termsAndConditions: 'Farm activities included. Early morning wake-up calls.',
    facilities: ['free wifi', 'parking', 'pets allowed', 'fireplace'],
    roomFacilities: ['mountain view', 'TV', 'kitchen', 'private bathroom'],
    description: 'Organic farm stay with fresh air and mountain views.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Flexible cancellation policy'
  },
  {
    id: '11',
    name: 'Desert Luxury Tent',
    propertyType: 'luxury tent',
    city: 'Jaipur',
    location: 'Thar Desert',
    address: '75 Desert Safari Camp, Thar Desert, Jaipur 302012',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'king',
    guestCapacity: 2,
    pricePerDay: 4800,
    pricePerWeek: 29000,
    pricePerMonth: 110000,
    rating: 4.8,
    reviews: 267,
    bookings: 78,
    safetyDeposit: 8000,
    operatingHours: 'Sunrise to Sunset',
    minimumDuration: '1 day',
    maximumDuration: '1 month',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 26.9124, longitude: 70.9017 },
    providerId: 'provider10',
    termsAndConditions: 'Desert experience. Camel safari included.',
    facilities: ['free wifi', 'room service', 'fireplace'],
    roomFacilities: ['air conditioning', 'terrace', 'private bathroom'],
    description: 'Luxurious desert camping experience with modern amenities.',
    workFriendly: false,
    instantBook: true,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '12',
    name: 'Riverside Vacation Home',
    propertyType: 'vacation home',
    city: 'Ahmedabad',
    location: 'Sabarmati Riverfront',
    address: '30 River View, Sabarmati Riverfront, Ahmedabad 380005',
    bedrooms: 4,
    bathrooms: 3,
    bedPreference: 'queen',
    guestCapacity: 8,
    pricePerDay: 3800,
    pricePerWeek: 23000,
    pricePerMonth: 85000,
    rating: 4.5,
    reviews: 156,
    bookings: 67,
    safetyDeposit: 7000,
    operatingHours: '24/7 Access',
    minimumDuration: '3 days',
    maximumDuration: '6 months',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 23.0225, longitude: 72.5714 },
    providerId: 'provider11',
    termsAndConditions: 'Family groups preferred. River activities included.',
    facilities: ['free wifi', 'swimming pool', 'parking', 'family rooms'],
    roomFacilities: ['air conditioning', 'TV', 'kitchen', 'washing machine', 'private bathroom'],
    description: 'Spacious riverside home perfect for families and groups.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Strict cancellation policy'
  },
  {
    id: '13',
    name: 'Urban Loft Studio',
    propertyType: 'apartment',
    city: 'Mumbai',
    location: 'Bandra West',
    address: '85 Linking Road, Bandra West, Mumbai 400050',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'queen',
    guestCapacity: 2,
    pricePerDay: 3600,
    pricePerWeek: 21500,
    pricePerMonth: 82000,
    rating: 4.7,
    reviews: 201,
    bookings: 134,
    safetyDeposit: 6500,
    operatingHours: '24/7 Security',
    minimumDuration: '1 week',
    maximumDuration: '1 year',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    providerId: 'provider12',
    termsAndConditions: 'Working professionals only. No loud music.',
    facilities: ['free wifi', 'gym', 'parking', 'electric charging'],
    roomFacilities: ['air conditioning', 'balcony', 'TV', 'kitchen', 'private bathroom'],
    description: 'Stylish loft in trendy Bandra with modern workspace.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '14',
    name: 'Eco Adventure Campground',
    propertyType: 'campground',
    city: 'Rishikesh',
    location: 'Ganges Riverbank',
    address: '12 Adventure Camp, Ganges Riverbank, Rishikesh 249201',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'single',
    guestCapacity: 2,
    pricePerDay: 1500,
    pricePerWeek: 9000,
    pricePerMonth: 32000,
    rating: 4.2,
    reviews: 145,
    bookings: 189,
    safetyDeposit: 1500,
    operatingHours: '6:00 AM - 10:00 PM',
    minimumDuration: '1 day',
    maximumDuration: '1 month',
    image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 30.0869, longitude: 78.2676 },
    providerId: 'provider13',
    termsAndConditions: 'Adventure activities included. River rafting available.',
    facilities: ['free wifi', 'parking', 'fireplace'],
    roomFacilities: ['mountain view', 'cot', 'toilet', 'shower'],
    description: 'Eco-friendly camping by the Ganges with adventure activities.',
    workFriendly: false,
    instantBook: true,
    cancellationPolicy: 'Free cancellation up to 24 hours'
  },
  {
    id: '15',
    name: 'City Center Business Hotel',
    propertyType: 'hotel',
    city: 'Delhi',
    location: 'Karol Bagh',
    address: '22 Business District, Karol Bagh, Delhi 110005',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'king',
    guestCapacity: 2,
    pricePerDay: 4000,
    pricePerWeek: 24000,
    pricePerMonth: 90000,
    rating: 4.4,
    reviews: 278,
    bookings: 198,
    safetyDeposit: 8000,
    operatingHours: '24/7 Concierge',
    minimumDuration: '1 day',
    maximumDuration: '3 months',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 28.6542, longitude: 77.1905 },
    providerId: 'provider14',
    termsAndConditions: 'Business travelers preferred. Conference facilities available.',
    facilities: ['free wifi', 'gym', 'room service', 'electric charging'],
    roomFacilities: ['air conditioning', 'TV', 'refrigerator', 'microwave', 'private bathroom'],
    description: 'Premium business hotel with conference facilities and city access.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Flexible cancellation policy'
  },
  {
    id: '16',
    name: 'Backpacker Hostel Hub',
    propertyType: 'homestay',
    city: 'Bangalore',
    location: 'Brigade Road',
    address: '67 Shopping District, Brigade Road, Bangalore 560001',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'single',
    guestCapacity: 1,
    pricePerDay: 800,
    pricePerWeek: 5000,
    pricePerMonth: 18000,
    rating: 4.0,
    reviews: 234,
    bookings: 456,
    safetyDeposit: 500,
    operatingHours: '24/7 Access',
    minimumDuration: '1 day',
    maximumDuration: '3 months',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    providerId: 'provider15',
    termsAndConditions: 'Backpackers welcome. Shared common areas.',
    facilities: ['free wifi', 'parking'],
    roomFacilities: ['cot', 'shared bathroom'],
    description: 'Budget-friendly hostel perfect for backpackers and solo travelers.',
    workFriendly: false,
    instantBook: true,
    cancellationPolicy: 'Free cancellation up to 24 hours'
  },
  {
    id: '17',
    name: 'Wellness Resort Spa',
    propertyType: 'resort',
    city: 'Kerala',
    location: 'Alleppey Backwaters',
    address: '99 Wellness Road, Alleppey Backwaters, Kerala 688006',
    bedrooms: 2,
    bathrooms: 2,
    bedPreference: 'king',
    guestCapacity: 4,
    pricePerDay: 6500,
    pricePerWeek: 39000,
    pricePerMonth: 150000,
    rating: 4.9,
    reviews: 189,
    bookings: 89,
    safetyDeposit: 12000,
    operatingHours: '24/7 Spa Services',
    minimumDuration: '3 days',
    maximumDuration: '1 month',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 9.4981, longitude: 76.3388 },
    providerId: 'provider16',
    termsAndConditions: 'Wellness programs included. Ayurveda treatments available.',
    facilities: ['free wifi', 'swimming pool', 'gym', 'room service', 'family rooms'],
    roomFacilities: ['air conditioning', 'balcony', 'TV', 'hot tub', 'private bathroom'],
    description: 'Luxury wellness resort with Ayurveda treatments and backwater views.',
    workFriendly: false,
    instantBook: false,
    cancellationPolicy: 'Strict cancellation policy'
  },
  {
    id: '18',
    name: 'Historic Fort Hotel',
    propertyType: 'hotel',
    city: 'Jaipur',
    location: 'Amber Fort Area',
    address: '44 Fort Road, Amber Fort Area, Jaipur 302001',
    bedrooms: 3,
    bathrooms: 2,
    bedPreference: 'queen',
    guestCapacity: 6,
    pricePerDay: 5200,
    pricePerWeek: 31000,
    pricePerMonth: 118000,
    rating: 4.8,
    reviews: 312,
    bookings: 123,
    safetyDeposit: 10000,
    operatingHours: '24/7 Heritage Service',
    minimumDuration: '2 days',
    maximumDuration: '2 months',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 26.9855, longitude: 75.8513 },
    providerId: 'provider17',
    termsAndConditions: 'Heritage property. Cultural tours included.',
    facilities: ['free wifi', 'room service', 'family rooms', 'swimming pool'],
    roomFacilities: ['air conditioning', 'TV', 'refrigerator', 'balcony', 'private bathroom'],
    description: 'Historic fort hotel with royal treatment and cultural experiences.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '19',
    name: 'Tech Park Serviced Apartment',
    propertyType: 'apartment',
    city: 'Chennai',
    location: 'OMR IT Corridor',
    address: '156 Tech Park, OMR IT Corridor, Chennai 600096',
    bedrooms: 2,
    bathrooms: 2,
    bedPreference: 'double',
    guestCapacity: 4,
    pricePerDay: 3400,
    pricePerWeek: 20000,
    pricePerMonth: 76000,
    rating: 4.6,
    reviews: 167,
    bookings: 134,
    safetyDeposit: 7000,
    operatingHours: '24/7 Tech Support',
    minimumDuration: '1 week',
    maximumDuration: '1 year',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 12.8406, longitude: 80.1534 },
    providerId: 'provider18',
    termsAndConditions: 'IT professionals preferred. High-speed internet guaranteed.',
    facilities: ['free wifi', 'gym', 'parking', 'electric charging'],
    roomFacilities: ['air conditioning', 'TV', 'kitchen', 'washing machine', 'private bathroom'],
    description: 'Premium serviced apartment near IT companies with all amenities.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Flexible cancellation policy'
  },
  {
    id: '20',
    name: 'Rooftop Garden Villa',
    propertyType: 'villa',
    city: 'Kolkata',
    location: 'Salt Lake City',
    address: '78 Garden Estate, Salt Lake City, Kolkata 700064',
    bedrooms: 4,
    bathrooms: 3,
    bedPreference: 'king',
    guestCapacity: 8,
    pricePerDay: 4200,
    pricePerWeek: 25000,
    pricePerMonth: 95000,
    rating: 4.7,
    reviews: 198,
    bookings: 78,
    safetyDeposit: 8500,
    operatingHours: '24/7 Garden Access',
    minimumDuration: '3 days',
    maximumDuration: '6 months',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop'],
    available: true,
    coordinates: { latitude: 22.5697, longitude: 88.4337 },
    providerId: 'provider19',
    termsAndConditions: 'Garden maintenance included. Organic vegetables available.',
    facilities: ['free wifi', 'parking', 'family rooms', 'pets allowed'],
    roomFacilities: ['air conditioning', 'TV', 'kitchen', 'terrace', 'private bathroom'],
    description: 'Spacious villa with rooftop garden perfect for families and groups.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '21',
    name: 'Nomad Hub Apartment',
    propertyType: 'apartment',
    city: 'Bangalore',
    location: 'Koramangala',
    address: '456 Tech Park Road, Koramangala, Bangalore 560034',
    bedrooms: 2,
    bathrooms: 1,
    bedPreference: 'double',
    guestCapacity: 4,
    pricePerDay: 2800,
    pricePerWeek: 18000,
    pricePerMonth: 65000,
    rating: 4.6,
    reviews: 89,
    bookings: 67,
    safetyDeposit: 3000,
    operatingHours: '9:00 AM - 10:00 PM',
    minimumDuration: '1 week',
    maximumDuration: '1 year',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    available: true,
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    providerId: 'provider2',
    termsAndConditions: 'Professional use only. Maintain cleanliness.',
    facilities: ['free wifi', 'room service', 'gym', 'electric charging'],
    roomFacilities: ['private bathroom', 'kitchen', 'balcony', 'air conditioning', 'refrigerator'],
    description: 'Modern apartment in tech hub with co-working spaces nearby.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Flexible cancellation policy'
  },
  {
    id: '3',
    name: 'Beach Resort Studio',
    propertyType: 'resort',
    city: 'Mumbai',
    location: 'Juhu Beach',
    address: '789 Beach Front, Juhu, Mumbai 400049',
    bedrooms: 1,
    bathrooms: 1,
    bedPreference: 'king',
    guestCapacity: 2,
    pricePerDay: 4200,
    pricePerWeek: 25000,
    pricePerMonth: 95000,
    rating: 4.7,
    reviews: 134,
    bookings: 45,
    safetyDeposit: 7000,
    operatingHours: '24/7 Concierge',
    minimumDuration: '2 days',
    maximumDuration: '3 months',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'],
    available: true,
    coordinates: { latitude: 19.0990, longitude: 72.8258 },
    providerId: 'provider3',
    termsAndConditions: 'Resort rules apply. Beach access included.',
    facilities: ['free wifi', 'swimming pool', 'gym', 'room service', 'family rooms'],
    roomFacilities: ['air conditioning', 'sea view', 'TV', 'refrigerator', 'private bathroom'],
    description: 'Luxury beach resort perfect for working remotely with ocean views.',
    workFriendly: true,
    instantBook: true,
    cancellationPolicy: 'Moderate cancellation policy'
  },
  {
    id: '4',
    name: 'Mountain Homestay',
    propertyType: 'homestay',
    city: 'Manali',
    location: 'Old Manali',
    address: '321 Hill Station Road, Old Manali, HP 175131',
    bedrooms: 2,
    bathrooms: 2,
    bedPreference: 'single',
    guestCapacity: 4,
    pricePerDay: 1800,
    pricePerWeek: 11000,
    pricePerMonth: 40000,
    rating: 4.4,
    reviews: 78,
    bookings: 123,
    safetyDeposit: 2000,
    operatingHours: '8:00 AM - 8:00 PM',
    minimumDuration: '5 days',
    maximumDuration: '2 months',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'],
    available: true,
    coordinates: { latitude: 32.2432, longitude: 77.1892 },
    providerId: 'provider1',
    termsAndConditions: 'Mountain safety guidelines must be followed.',
    facilities: ['free wifi', 'parking', 'fireplace', 'mountain view'],
    roomFacilities: ['kitchen', 'TV', 'fireplace', 'mountain view', 'private bathroom'],
    description: 'Peaceful mountain retreat perfect for remote work with stunning views.',
    workFriendly: true,
    instantBook: false,
    cancellationPolicy: 'Strict cancellation policy'
  }
]

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Goa', 'Manali', 'Udaipur', 'Jaipur', 'Rishikesh', 'Kerala']
const propertyTypes = ['apartment', 'hotel', 'homestay', 'resort', 'capsule hotel', 'lodge', 'farm stay', 'villa', 'luxury tent', 'campground', 'vacation home']
const bedroomOptions = [1, 2, 3, 4, 5]
const bathroomOptions = [1, 2, 3, 4]
const bedPreferences = ['single', 'double', 'queen', 'king']
const durationOptions = ['days', 'weeks', 'months']
const guestCapacities = [1, 2, 3, 4, 5, 6, 8, 10]
const hotelFacilities = [
  'parking', 'free wifi', 'room service', 'gym', 'family rooms', 
  'electric charging', 'bath tub', 'swimming pool', 'fireplace', 'pets allowed'
]
const roomFacilities = [
  'private bathroom', 'air conditioning', 'balcony', 'sea view', 'kitchen', 
  'hot tub', 'mountain view', 'terrace', 'refrigerator', 'washing machine', 
  'TV', 'cot', 'microwave', 'toilet', 'dishwasher', 'micro oven', 'shower'
]

export function NomadHotels({ currentUser, filterSidebarOpen }: NomadHotelsProps) {
  const [hotels] = useLocalStorage<Hotel[]>('nomadHotels', mockHotels)
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [filters, setFilters] = useState<HotelFilters>({
    city: '',
    fromDateTime: null,
    toDateTime: null,
    location: [],
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    bedPreference: [],
    duration: [],
    priceRange: [1000, 20000],
    facilities: [],
    roomFacilities: [],
    guestCapacity: [],
    nearMe: false
  })
  
  const [sortBy, setSortBy] = useState('rating')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [showBookingModal, setShowBookingModal] = useState(false)

  const locations = Array.from(new Set(hotels.map(hotel => hotel.location)))

  // Filter and sort hotels based on current filters
  useEffect(() => {
    let result = hotels.filter(hotel => {
      if (!hotel.available) return false
      
      // City filter
      if (filters.city && hotel.city !== filters.city) return false
      
      // Location filter (OR logic)
      if (filters.location.length > 0 && !filters.location.includes(hotel.location)) return false
      
      // Property type filter (OR logic)
      if (filters.propertyType.length > 0 && !filters.propertyType.includes(hotel.propertyType)) return false
      
      // Bedrooms filter (OR logic)
      if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(hotel.bedrooms)) return false
      
      // Bathrooms filter (OR logic)
      if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(hotel.bathrooms)) return false
      
      // Bed preference filter (OR logic)
      if (filters.bedPreference.length > 0 && !filters.bedPreference.includes(hotel.bedPreference)) return false
      
      // Guest capacity filter (OR logic)
      if (filters.guestCapacity.length > 0 && !filters.guestCapacity.includes(hotel.guestCapacity)) return false
      
      // Facilities filter (AND logic - hotel must have all selected facilities)
      if (filters.facilities.length > 0 && !filters.facilities.every(facility => hotel.facilities.includes(facility))) return false
      
      // Room facilities filter (AND logic)
      if (filters.roomFacilities.length > 0 && !filters.roomFacilities.every(facility => hotel.roomFacilities.includes(facility))) return false
      
      // Price range filter
      const price = hotel.pricePerDay
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      
      return true
    })

    // Apply search terms within each filter category
    Object.entries(searchTerms).forEach(([category, term]) => {
      if (term) {
        switch (category) {
          case 'propertyType':
            result = result.filter(hotel => 
              hotel.propertyType.toLowerCase().includes(term.toLowerCase())
            )
            break
          case 'location':
            result = result.filter(hotel => 
              hotel.location.toLowerCase().includes(term.toLowerCase())
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
        case 'bookings':
          aVal = a.bookings
          bVal = b.bookings
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

    setFilteredHotels(result)
  }, [hotels, filters, sortBy, sortOrder, userLocation, searchTerms])

  const handleFilterChange = (category: keyof HotelFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleMultiSelectFilter = (category: keyof HotelFilters, value: string | number) => {
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

  const handleRemoveFilter = (category: keyof HotelFilters, value?: string | number) => {
    if (value !== undefined) {
      handleMultiSelectFilter(category, value)
    } else {
      if (category === 'nearMe') {
        handleFilterChange('nearMe', false)
      } else if (category === 'priceRange') {
        handleFilterChange('priceRange', [1000, 20000])
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

  const handleBookNow = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setView('detail')
  }

  const getActiveFilterChips = () => {
    const chips: Array<{ label: string; category: keyof HotelFilters; value?: string | number }> = []
    
    if (filters.city) chips.push({ label: `City: ${filters.city}`, category: 'city' })
    if (filters.fromDateTime) chips.push({ label: `From: ${filters.fromDateTime.format('DD/MM/YY HH:mm')}`, category: 'fromDateTime' })
    if (filters.toDateTime) chips.push({ label: `To: ${filters.toDateTime.format('DD/MM/YY HH:mm')}`, category: 'toDateTime' })
    if (filters.nearMe) chips.push({ label: 'Near Me', category: 'nearMe' })
    
    filters.location.forEach(loc => 
      chips.push({ label: `Location: ${loc}`, category: 'location', value: loc })
    )
    filters.propertyType.forEach(type => 
      chips.push({ label: `Type: ${type}`, category: 'propertyType', value: type })
    )
    filters.bedrooms.forEach(bedroom => 
      chips.push({ label: `${bedroom} bedrooms`, category: 'bedrooms', value: bedroom })
    )
    filters.bathrooms.forEach(bathroom => 
      chips.push({ label: `${bathroom} bathrooms`, category: 'bathrooms', value: bathroom })
    )
    filters.bedPreference.forEach(pref => 
      chips.push({ label: `Bed: ${pref}`, category: 'bedPreference', value: pref })
    )
    filters.guestCapacity.forEach(capacity => 
      chips.push({ label: `${capacity} guests`, category: 'guestCapacity', value: capacity })
    )
    filters.facilities.forEach(facility => 
      chips.push({ label: `${facility}`, category: 'facilities', value: facility })
    )
    filters.roomFacilities.forEach(facility => 
      chips.push({ label: `${facility}`, category: 'roomFacilities', value: facility })
    )
    
    if (filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 20000) {
      chips.push({ label: `Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`, category: 'priceRange' })
    }
    
    return chips
  }

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'free wifi': return <Wifi fontSize="small" />
      case 'swimming pool': return <Pool fontSize="small" />
      case 'gym': return <FitnessCenter fontSize="small" />
      case 'kitchen': return <Kitchen fontSize="small" />
      case 'air conditioning': return <AcUnit fontSize="small" />
      case 'bath tub': return <Bathtub fontSize="small" />
      case 'balcony': return <Balcony fontSize="small" />
      case 'pets allowed': return <Pets fontSize="small" />
      case 'parking': return <LocalParking fontSize="small" />
      case 'room service': return <RoomService fontSize="small" />
      case 'fireplace': return <Fireplace fontSize="small" />
      case 'hot tub': return <HotTub fontSize="small" />
      case 'mountain view': return <Terrain fontSize="small" />
      case 'sea view': return <Terrain fontSize="small" />
      default: return <Settings fontSize="small" />
    }
  }

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hotel': return <Hotel fontSize="small" />
      case 'resort': return <Pool fontSize="small" />
      case 'apartment': return <Apartment fontSize="small" />
      case 'villa': return <Villa fontSize="small" />
      case 'homestay': return <Home fontSize="small" />
      default: return <Hotel fontSize="small" />
    }
  }

  // Tab panel helper component
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
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
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // Hotel Detail Page Component
  const HotelDetailPage = ({ hotel }: { hotel: Hotel }) => {
    const [paymentMethod, setPaymentMethod] = useState('')
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [cardDetails, setCardDetails] = useState({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    })
    const [upiId, setUpiId] = useState('')

    const handlePayment = (method: string) => {
      setPaymentMethod(method)
      setShowPaymentForm(true)
    }

    const processPayment = () => {
      if (paymentMethod === 'card') {
        if (cardDetails.cardNumber && cardDetails.expiryDate && cardDetails.cvv && cardDetails.cardholderName) {
          toast.success('Card payment processed successfully!')
          setShowBookingModal(true)
          setShowPaymentForm(false)
        } else {
          toast.error('Please fill all card details')
        }
      } else if (paymentMethod === 'upi') {
        if (upiId) {
          toast.success('UPI payment initiated successfully!')
          setShowBookingModal(true)
          setShowPaymentForm(false)
        } else {
          toast.error('Please enter valid UPI ID')
        }
      } else if (paymentMethod === 'netbanking') {
        toast.success('Redirecting to netbanking portal...')
        setShowBookingModal(true)
        setShowPaymentForm(false)
      }
    }

    const cancelPayment = () => {
      setShowPaymentForm(false)
      setPaymentMethod('')
      setCardDetails({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' })
      setUpiId('')
    }

    return (
      <Box>
        {/* Header with back button and title */}
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setView('list')
                setSelectedHotel(null)
              }}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {hotel.name}
            </Typography>
            <Chip
              icon={<StarIcon />}
              label={hotel.rating}
              color="primary"
              size="small"
            />
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          {/* First Row: Hotel Image + Booking Panel */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            mb: 4, 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' }
          }}>
            {/* Hotel Image - 50% width */}
            <Box sx={{ flex: '1 1 50%' }}>
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </Box>

            {/* Booking Panel - 50% width */}
            <Box sx={{ flex: '1 1 50%' }}>
              <Paper elevation={3} sx={{ p: 2.5, height: 'fit-content', position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Book Your Stay
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ mb: 0.5 }}>
                    ₹{hotel.pricePerDay}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">per night</Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Weekly: ₹{hotel.pricePerWeek}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Monthly: ₹{hotel.pricePerMonth}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Quick Info */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <AccessTime sx={{ mr: 1, fontSize: 14 }} />
                    {hotel.operatingHours}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Min: {hotel.minimumDuration} • Max: {hotel.maximumDuration} • Deposit: ₹{hotel.safetyDeposit}
                  </Typography>
                </Box>

                {/* Payment Methods */}
                {!showPaymentForm ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom fontWeight="medium">
                        Payment Methods:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Button
                          variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                          size="small"
                          startIcon={<CreditCard sx={{ fontSize: 16 }} />}
                          onClick={() => handlePayment('card')}
                        >
                          Card
                        </Button>
                        <Button
                          variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
                          size="small"
                          startIcon={<Payment sx={{ fontSize: 16 }} />}
                          onClick={() => handlePayment('upi')}
                        >
                          UPI
                        </Button>
                        <Button
                          variant={paymentMethod === 'netbanking' ? 'contained' : 'outlined'}
                          size="small"
                          startIcon={<AccountBalance sx={{ fontSize: 16 }} />}
                          onClick={() => handlePayment('netbanking')}
                        >
                          Bank
                        </Button>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => currentUser ? (paymentMethod ? processPayment() : toast.error('Please select a payment method')) : toast.error('Please sign in to book')}
                      disabled={!currentUser}
                      sx={{ mb: 1.5 }}
                    >
                      {hotel.instantBook ? 'Book Instantly' : 'Book Now'}
                    </Button>
                  </>
                ) : (
                  /* Payment Form */
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {paymentMethod === 'card' ? 'Card Payment' : paymentMethod === 'upi' ? 'UPI Payment' : 'Net Banking'}
                      </Typography>
                      <IconButton size="small" onClick={cancelPayment}>
                        <Cancel sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>

                    {paymentMethod === 'card' && (
                      <Box sx={{ space: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Cardholder Name"
                          value={cardDetails.cardholderName}
                          onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            size="small"
                            label="MM/YY"
                            placeholder="12/25"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            label="CVV"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            sx={{ flex: 1 }}
                          />
                        </Box>
                      </Box>
                    )}

                    {paymentMethod === 'upi' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="UPI ID"
                        placeholder="username@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    )}

                    {paymentMethod === 'netbanking' && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          You will be redirected to your bank's secure payment gateway
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      size="medium"
                      onClick={processPayment}
                      sx={{ mt: 2 }}
                    >
                      Pay ₹{hotel.pricePerDay}
                    </Button>
                  </Box>
                )}

                {hotel.instantBook && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <CheckCircle color="success" sx={{ mr: 1, fontSize: 14 }} />
                    <Typography variant="caption" color="success.main">
                      Instant booking available
                    </Typography>
                  </Box>
                )}

                {!currentUser && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Warning color="warning" sx={{ mr: 1, fontSize: 14 }} />
                    <Typography variant="caption" color="text.secondary">
                      Please sign in to book
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>

          {/* Second Row: Comprehensive Details */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              Complete Property Details
            </Typography>

            {/* Basic Information */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <LocationOn color="action" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1">
                  {hotel.address}, {hotel.location}, {hotel.city}
                </Typography>
              </Box>
              <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                {hotel.description}
              </Typography>

              {/* Property Quick Stats */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                gap: 1.5,
                mb: 2
              }}>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{hotel.bedrooms}</Typography>
                  <Typography variant="caption" color="text.secondary">Bedrooms</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{hotel.bathrooms}</Typography>
                  <Typography variant="caption" color="text.secondary">Bathrooms</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{hotel.guestCapacity}</Typography>
                  <Typography variant="caption" color="text.secondary">Guests</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body1" color="primary" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                    {hotel.propertyType}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                </Box>
              </Box>

              {/* Ratings & Reviews */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Rating value={hotel.rating} readOnly precision={0.1} size="small" />
                <Typography variant="body2">
                  {hotel.rating} ({hotel.reviews} reviews) • {hotel.bookings} bookings
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Hotel & Room Facilities */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Hotel Facilities
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 1,
                mb: 2
              }}>
                {hotel.facilities.map((facility, index) => (
                  <Chip 
                    key={index} 
                    icon={getFacilityIcon(facility)}
                    label={facility.replace(/([A-Z])/g, ' $1')}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Room Facilities
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 1,
                mb: 2
              }}>
                {hotel.roomFacilities.map((facility, index) => (
                  <Chip 
                    key={index} 
                    icon={getFacilityIcon(facility)}
                    label={facility.replace(/([A-Z])/g, ' $1')}
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Room Details & Policies */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 2,
              mb: 3
            }}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Room Configuration
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Bed Type:</strong> {hotel.bedPreference}
                </Typography>
                <Typography variant="body2">
                  <strong>Capacity:</strong> {hotel.guestCapacity} people
                </Typography>
              </Paper>

              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Property Policies
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Work Friendly:</strong> {hotel.workFriendly ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Instant Book:</strong> {hotel.instantBook ? 'Yes' : 'No'}
                </Typography>
              </Paper>

              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Location
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Area:</strong> {hotel.location}
                </Typography>
                <Typography variant="body2">
                  <strong>City:</strong> {hotel.city}
                </Typography>
              </Paper>
            </Box>

            {/* Terms & Conditions */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Important Information
              </Typography>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                  {hotel.termsAndConditions}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Cancellation:</strong> {hotel.cancellationPolicy}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Deposit:</strong> ₹{hotel.safetyDeposit} (refundable)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Hours:</strong> {hotel.operatingHours}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  };

  if (view === 'detail' && selectedHotel) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <HotelDetailPage hotel={selectedHotel} />
          
          {/* Booking Modal */}
          {showBookingModal && (
            <BookingModal
              open={showBookingModal}
              onClose={() => setShowBookingModal(false)}
              bike={selectedHotel}
              currentUser={currentUser}
            />
          )}
        </Box>
      </LocalizationProvider>
    )
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
              label="Check-in Date & Time"
              value={filters.fromDateTime}
              onChange={(value) => handleFilterChange('fromDateTime', value)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <DateTimePicker
              label="Check-out Date & Time"
              value={filters.toDateTime}
              onChange={(value) => handleFilterChange('toDateTime', value)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Box>

          {/* Location Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Location</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                size="small"
                placeholder="Search locations..."
                value={searchTerms.location || ''}
                onChange={(e) => handleSearchInFilter('location', e.target.value)}
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
                  {locations
                    .filter(location => 
                      !searchTerms.location || 
                      location.toLowerCase().includes(searchTerms.location.toLowerCase())
                    )
                    .map(location => (
                    <FormControlLabel
                      key={location}
                      control={
                        <Checkbox
                          size="small"
                          checked={filters.location.includes(location)}
                          onChange={() => handleMultiSelectFilter('location', location)}
                        />
                      }
                      label={<Typography variant="body2">{location}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Property Type Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Property Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                size="small"
                placeholder="Search property types..."
                value={searchTerms.propertyType || ''}
                onChange={(e) => handleSearchInFilter('propertyType', e.target.value)}
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
                  {propertyTypes
                    .filter(type => 
                      !searchTerms.propertyType || 
                      type.toLowerCase().includes(searchTerms.propertyType.toLowerCase())
                    )
                    .map(type => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          size="small"
                          checked={filters.propertyType.includes(type)}
                          onChange={() => handleMultiSelectFilter('propertyType', type)}
                        />
                      }
                      label={<Typography variant="body2" className="capitalize">{type}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Bedrooms Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Bedrooms</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {bedroomOptions.map(bedroom => (
                  <FormControlLabel
                    key={bedroom}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.bedrooms.includes(bedroom)}
                        onChange={() => handleMultiSelectFilter('bedrooms', bedroom)}
                      />
                    }
                    label={<Typography variant="body2">{bedroom} bedroom{bedroom > 1 ? 's' : ''}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Bathrooms Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Bathrooms</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {bathroomOptions.map(bathroom => (
                  <FormControlLabel
                    key={bathroom}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.bathrooms.includes(bathroom)}
                        onChange={() => handleMultiSelectFilter('bathrooms', bathroom)}
                      />
                    }
                    label={<Typography variant="body2">{bathroom} bathroom{bathroom > 1 ? 's' : ''}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Bed Preference Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Bed Preference</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {bedPreferences.map(pref => (
                  <FormControlLabel
                    key={pref}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.bedPreference.includes(pref)}
                        onChange={() => handleMultiSelectFilter('bedPreference', pref)}
                      />
                    }
                    label={<Typography variant="body2" className="capitalize">{pref}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Guest Capacity Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Guest Capacity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {guestCapacities.map(capacity => (
                  <FormControlLabel
                    key={capacity}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.guestCapacity.includes(capacity)}
                        onChange={() => handleMultiSelectFilter('guestCapacity', capacity)}
                      />
                    }
                    label={<Typography variant="body2">{capacity} guest{capacity > 1 ? 's' : ''}</Typography>}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Hotel Facilities Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Hotel Facilities</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="max-h-32 overflow-y-auto">
                <FormGroup>
                  {hotelFacilities.map(facility => (
                    <FormControlLabel
                      key={facility}
                      control={
                        <Checkbox
                          size="small"
                          checked={filters.facilities.includes(facility)}
                          onChange={() => handleMultiSelectFilter('facilities', facility)}
                        />
                      }
                      label={<Typography variant="body2">{facility}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Room Facilities Filter */}
          <Accordion defaultExpanded className="mb-4">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Room Facilities</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="max-h-32 overflow-y-auto">
                <FormGroup>
                  {roomFacilities.map(facility => (
                    <FormControlLabel
                      key={facility}
                      control={
                        <Checkbox
                          size="small"
                          checked={filters.roomFacilities.includes(facility)}
                          onChange={() => handleMultiSelectFilter('roomFacilities', facility)}
                        />
                      }
                      label={<Typography variant="body2">{facility}</Typography>}
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
              max={20000}
              step={500}
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
                  {filteredHotels.length} Properties Available
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
                    <MenuItem value="bookings-desc">Bookings (High to Low)</MenuItem>
                    <MenuItem value="bookings-asc">Bookings (Low to High)</MenuItem>
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

          {/* Hotels Grid */}
          {filteredHotels.length === 0 ? (
            <Alert severity="info" className="text-center">
              No properties available for selected criteria. Change filter options and try again.
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map(hotel => (
                <div key={hotel.id}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardMedia
                      component="img"
                      height="200"
                      image={hotel.image}
                      alt={hotel.name}
                      className="h-48 object-cover"
                    />
                    <CardContent className="flex-1 flex flex-col">
                      <Box className="flex items-start justify-between mb-2">
                        <Box className="flex-1">
                          <Typography variant="h6" className="font-semibold text-foreground">
                            {hotel.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                            {getPropertyTypeIcon(hotel.propertyType)}
                            {hotel.propertyType} • {hotel.bedrooms}BR, {hotel.bathrooms}BA
                          </Typography>
                        </Box>
                        {hotel.workFriendly && (
                          <Chip size="small" label="Work Friendly" color="primary" variant="outlined" />
                        )}
                      </Box>

                      <Box className="flex items-center gap-2 mb-3">
                        <Rating value={hotel.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({hotel.reviews} reviews)
                        </Typography>
                        {hotel.instantBook && (
                          <Chip size="small" label="Instant Book" color="success" variant="outlined" />
                        )}
                      </Box>

                      <Box className="mb-3">
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                          <Schedule fontSize="small" />
                          {hotel.operatingHours}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="flex items-center gap-1 mt-1">
                          <LocationOn fontSize="small" />
                          {hotel.location}, {hotel.city}
                        </Typography>
                      </Box>

                      <Box className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed fontSize="small" />
                          {hotel.bedPreference} bed
                        </div>
                        <div className="flex items-center gap-1">
                          <Business fontSize="small" />
                          {hotel.guestCapacity} guests
                        </div>
                        <span>{hotel.bookings} bookings</span>
                      </Box>

                      {/* Hotel Facilities */}
                      <Box className="mb-3">
                        <Typography variant="body2" className="font-medium mb-2">Hotel Facilities:</Typography>
                        <Box className="flex flex-wrap gap-1">
                          {hotel.facilities.slice(0, 4).map(facility => (
                            <Chip
                              key={facility}
                              size="small"
                              label={facility}
                              variant="outlined"
                              icon={getFacilityIcon(facility)}
                            />
                          ))}
                          {hotel.facilities.length > 4 && (
                            <Chip size="small" label={`+${hotel.facilities.length - 4} more`} variant="outlined" />
                          )}
                        </Box>
                      </Box>

                      {/* Room Facilities */}
                      <Box className="mb-3">
                        <Typography variant="body2" className="font-medium mb-2">Room Facilities:</Typography>
                        <Box className="flex flex-wrap gap-1">
                          {hotel.roomFacilities.slice(0, 3).map(facility => (
                            <Chip
                              key={facility}
                              size="small"
                              label={facility}
                              variant="outlined"
                              icon={getFacilityIcon(facility)}
                            />
                          ))}
                          {hotel.roomFacilities.length > 3 && (
                            <Chip size="small" label={`+${hotel.roomFacilities.length - 3} more`} variant="outlined" />
                          )}
                        </Box>
                      </Box>

                      <Box className="mb-3">
                        <Typography variant="body2" className="text-muted-foreground">
                          Min stay: {hotel.minimumDuration} • Max stay: {hotel.maximumDuration}
                        </Typography>
                      </Box>

                      <Divider className="my-2" />

                      <Box className="mb-3">
                        <Typography variant="body1" className="font-semibold text-primary">
                          ₹{hotel.pricePerDay}/night
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{hotel.pricePerWeek}/week • ₹{hotel.pricePerMonth}/month
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Security Deposit: ₹{hotel.safetyDeposit}
                        </Typography>
                      </Box>

                      <Box className="flex gap-2 mt-auto">
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleBookNow(hotel)}
                          disabled={!currentUser}
                        >
                          {hotel.instantBook ? 'Book Instantly' : 'Book Now'}
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
        {selectedHotel && (
          <BookingModal
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            bike={selectedHotel}
            currentUser={currentUser}
          />
        )}
      </Box>
    </LocalizationProvider>
  )
}