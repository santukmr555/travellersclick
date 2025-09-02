import React, { useState, useMemo } from 'react'
import { 
  Card, 
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  FormGroup
} from '@mui/material'
import {
  AccountBalance,
  LocationOn,
  AccessTime,
  Group,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  BookOnline,
  FilterList,
  ExpandMore,
  Close,
  Check,
  ArrowBack,
  CalendarMonth,
  CurrencyRupee,
  Search,
  CreditCard,
  Payment,
  Warning,
  Cancel,
  CheckCircle
} from '@mui/icons-material'
import { BookingModal } from '../booking/BookingModal'
import { User } from '@/App'
import { toast } from 'sonner'

interface PilgrimagePackage {
  id: string
  name: string
  location: string
  state: string
  duration: string
  price: number
  image: string
  rating: number
  reviewCount: number
  difficulty: string
  groupSize: string
  region: string
  packageType: string
  temples: string[]
  highlights: string[]
  features: string[]
  inclusions: string[]
  exclusions: string[]
  requirements: string[]
  itinerary: {
    day: number
    title: string
    description: string
    temples?: string[]
    activities?: string[]
  }[]
}

interface FilterState {
  priceRange: [number, number]
  difficulty: string[]
  region: string[]
  state: string[]
  duration: string[]
  packageType: string[]
  features: string[]
}

interface PilgrimageToursProps {
  currentUser: User | null
  filterSidebarOpen: boolean
}

const pilgrimagePackages: PilgrimagePackage[] = [
  {
    id: '1',
    name: 'Char Dham Yatra',
    location: 'Uttarakhand',
    state: 'Uttarakhand',
    duration: '12 days',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 245,
    difficulty: 'Challenging',
    groupSize: '8-15 people',
    region: 'North India',
    packageType: 'Premium',
    temples: ['Kedarnath', 'Badrinath', 'Gangotri', 'Yamunotri'],
    highlights: [
      'Visit all four sacred dhams',
      'Helicopter service to Kedarnath',
      'Guided spiritual sessions',
      'High altitude mountain temples'
    ],
    features: ['Helicopter service', 'Guide included', 'Luxury accommodation', 'All meals'],
    inclusions: [
      'Accommodation in 3-4 star hotels',
      'All meals (breakfast, lunch, dinner)',
      'Transportation in AC vehicles',
      'All temple entry fees and special darshan',
      'Professional guide',
      'Helicopter service to Kedarnath',
      'Medical kit and oxygen cylinder'
    ],
    exclusions: [
      'Personal expenses',
      'Additional helicopter services',
      'Shopping expenses',
      'Tips and gratuities'
    ],
    requirements: [
      'Medical certificate required',
      'Good physical fitness',
      'Warm clothing essential',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Haridwar',
        description: 'Welcome to the holy city of Haridwar. Check-in and evening Ganga Aarti',
        temples: ['Har Ki Pauri'],
        activities: ['Hotel check-in', 'Ganga Aarti', 'Evening prayers']
      },
      {
        day: 2,
        title: 'Haridwar to Yamunotri',
        description: 'Drive to Janki Chatti, trek to Yamunotri temple',
        temples: ['Yamunotri Temple'],
        activities: ['Temple darshan', 'Hot springs visit']
      }
    ]
  },
  {
    id: '2',
    name: 'Vaishno Devi Darshan',
    location: 'Jammu & Kashmir',
    state: 'Jammu & Kashmir',
    duration: '3 days',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 189,
    difficulty: 'Moderate',
    groupSize: '6-12 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Vaishno Devi Temple'],
    highlights: [
      'Sacred cave temple visit',
      'Helicopter option available',
      'Blessed holy water',
      'Spiritual awakening journey'
    ],
    features: ['Guide included', 'Helicopter option', 'Standard accommodation'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple entry and darshan',
      'Local transportation',
      'Guide services'
    ],
    exclusions: [
      'Helicopter charges (optional)',
      'Personal expenses',
      'Additional services'
    ],
    requirements: [
      'Moderate fitness required',
      'Comfortable walking shoes',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jammu',
        description: 'Arrive and transfer to Katra base camp',
        activities: ['Hotel check-in', 'Preparation for trek']
      }
    ]
  },
  {
    id: '3',
    name: 'Tirupati Balaji Darshan',
    location: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    duration: '3 days',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 512,
    difficulty: 'Easy',
    groupSize: '10-20 people',
    region: 'South India',
    packageType: 'Premium',
    temples: ['Tirumala Temple', 'Kapila Theertham', 'Akasha Ganga'],
    highlights: [
      'VIP darshan arrangements',
      'Richest temple in the world',
      'Divine blessings of Lord Venkateswara',
      'Sacred prasadam'
    ],
    features: ['VIP darshan', 'Luxury accommodation', 'All meals'],
    inclusions: [
      'VIP darshan tickets',
      'Accommodation in luxury hotel',
      'All meals',
      'AC transportation',
      'Temple guide'
    ],
    exclusions: [
      'Personal shopping',
      'Additional temple visits',
      'Travel insurance'
    ],
    requirements: [
      'Valid ID proof',
      'Modest dress code',
      'No specific fitness required'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Tirupati',
        description: 'Arrive and check-in, visit local temples',
        activities: ['Hotel check-in', 'Local temple visits']
      }
    ]
  },
  {
    id: '4',
    name: 'Mathura Vrindavan Krishna Yatra',
    location: 'Uttar Pradesh',
    state: 'Uttar Pradesh',
    duration: '4 days',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 287,
    difficulty: 'Easy',
    groupSize: '12-25 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Krishna Janmabhoomi', 'Banke Bihari', 'ISKCON Temple', 'Radha Raman Temple'],
    highlights: [
      'Krishna\'s birthplace visit',
      'Vrindavan divine experiences',
      'Spiritual discourses',
      'Cultural programs'
    ],
    features: ['Guide included', 'Cultural programs', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Cultural programs',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional activities'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable walking shoes',
      'Devotional mindset'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Mathura',
        description: 'Visit Krishna Janmabhoomi and other temples',
        activities: ['Temple visits', 'Evening aarti']
      }
    ]
  },
  {
    id: '5',
    name: 'Kashi Vishwanath Darshan',
    location: 'Uttar Pradesh',
    state: 'Uttar Pradesh',
    duration: '4 days',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 198,
    difficulty: 'Easy',
    groupSize: '10-18 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Kashi Vishwanath', 'Annapurna Temple', 'Sankat Mochan', 'Durga Temple'],
    highlights: [
      'Ancient Kashi Vishwanath temple',
      'Ganga aarti experience',
      'Boat ride on sacred Ganges',
      'Spiritual city exploration'
    ],
    features: ['Guide included', 'Boat rides', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple darshan',
      'Boat rides',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional boat rides'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable walking',
      'Modest clothing'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Varanasi',
        description: 'Check-in and evening Ganga aarti',
        activities: ['Hotel check-in', 'Ganga aarti']
      }
    ]
  },
  {
    id: '6',
    name: 'Dwarka Somnath Yatra',
    location: 'Gujarat',
    state: 'Gujarat',
    duration: '5 days',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 156,
    difficulty: 'Easy',
    groupSize: '8-16 people',
    region: 'West India',
    packageType: 'Standard',
    temples: ['Dwarkadhish Temple', 'Somnath Temple', 'Nageshwar Jyotirlinga'],
    highlights: [
      'Krishna\'s ancient kingdom',
      'First Jyotirlinga darshan',
      'Coastal temple experience',
      'Historical significance'
    ],
    features: ['Guide included', 'All meals', 'Cultural tours'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'AC transportation',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Additional sightseeing',
      'Travel insurance'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable clothing',
      'Walking shoes'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dwarka',
        description: 'Visit Dwarkadhish temple and coastal areas',
        activities: ['Temple darshan', 'Coastal visit']
      }
    ]
  },
  {
    id: '7',
    name: 'Golden Temple Amritsar',
    location: 'Punjab',
    state: 'Punjab',
    duration: '3 days',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 324,
    difficulty: 'Easy',
    groupSize: '8-20 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Golden Temple', 'Durgiana Temple', 'Mata Lal Devi Temple'],
    highlights: [
      'Sacred Golden Temple visit',
      'Langar experience',
      'Jallianwala Bagh memorial',
      'Border ceremony at Wagah'
    ],
    features: ['Guide included', 'All meals', 'Cultural experiences'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Wagah border ceremony',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional sightseeing'
    ],
    requirements: [
      'Valid ID proof',
      'Head covering required',
      'Respectful attire'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Amritsar',
        description: 'Golden Temple visit and evening prayers',
        activities: ['Temple darshan', 'Langar experience']
      }
    ]
  },
  {
    id: '8',
    name: 'Meenakshi Temple Madurai',
    location: 'Tamil Nadu',
    state: 'Tamil Nadu',
    duration: '4 days',
    price: 19000,
    image: 'https://images.unsplash.com/photo-1582652297765-3b9c0dce7ae1?w=500&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 267,
    difficulty: 'Easy',
    groupSize: '10-18 people',
    region: 'South India',
    packageType: 'Premium',
    temples: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace', 'Alagar Koil'],
    highlights: [
      'Architectural marvel temple',
      'Thousand pillar hall',
      'Evening temple ceremonies',
      'Cultural heritage tour'
    ],
    features: ['Guide included', 'Cultural tours', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Cultural tours',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional activities'
    ],
    requirements: [
      'Valid ID proof',
      'Modest clothing',
      'Comfortable walking'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Madurai',
        description: 'Meenakshi temple visit and evening aarti',
        activities: ['Temple darshan', 'Evening ceremony']
      }
    ]
  },
  {
    id: '9',
    name: 'Shirdi Sai Baba Darshan',
    location: 'Maharashtra',
    state: 'Maharashtra',
    duration: '3 days',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1571048518491-e4e25d05eae8?w=500&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 445,
    difficulty: 'Easy',
    groupSize: '12-25 people',
    region: 'West India',
    packageType: 'Standard',
    temples: ['Shirdi Sai Baba Temple', 'Dwarkamai', 'Chavadi', 'Gurusthan'],
    highlights: [
      'Sai Baba samadhi darshan',
      'Holy places of Shirdi',
      'Spiritual experiences',
      'Divine blessings'
    ],
    features: ['Guide included', 'All meals', 'VIP darshan'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'VIP darshan tickets',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional temple visits'
    ],
    requirements: [
      'Valid ID proof',
      'Modest clothing',
      'Devotional attitude'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Shirdi',
        description: 'Sai Baba temple visit and holy places',
        activities: ['Temple darshan', 'Holy places visit']
      }
    ]
  },
  {
    id: '10',
    name: 'Jagannath Puri Darshan',
    location: 'Odisha',
    state: 'Odisha',
    duration: '4 days',
    price: 21000,
    image: 'https://images.unsplash.com/photo-1578635073855-a89b3dd2c1d1?w=500&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 198,
    difficulty: 'Easy',
    groupSize: '8-16 people',
    region: 'East India',
    packageType: 'Premium',
    temples: ['Jagannath Temple', 'Gundicha Temple', 'Lokanath Temple'],
    highlights: [
      'Lord Jagannath darshan',
      'Beach temple experience',
      'Rath Yatra significance',
      'Coastal spiritual journey'
    ],
    features: ['Guide included', 'Beach visits', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Beach tours',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Additional activities',
      'Water sports'
    ],
    requirements: [
      'Valid ID proof',
      'Modest clothing',
      'Comfortable walking'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Puri',
        description: 'Jagannath temple visit and beach',
        activities: ['Temple darshan', 'Beach visit']
      }
    ]
  },
  {
    id: '11',
    name: 'Kedarnath Dham Yatra',
    location: 'Uttarakhand',
    state: 'Uttarakhand',
    duration: '6 days',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 178,
    difficulty: 'Challenging',
    groupSize: '6-12 people',
    region: 'North India',
    packageType: 'Premium',
    temples: ['Kedarnath Temple', 'Triyuginarayan Temple', 'Rudranath Temple'],
    highlights: [
      'High altitude Shiva temple',
      'Helicopter service available',
      'Himalayan spiritual journey',
      'Sacred mountain experience'
    ],
    features: ['Helicopter service', 'Guide included', 'Medical support'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Helicopter service',
      'Medical kit',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Extra helicopter rides',
      'Shopping'
    ],
    requirements: [
      'Medical certificate',
      'Good fitness',
      'Warm clothing',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Haridwar',
        description: 'Base preparation for Kedarnath journey',
        activities: ['Hotel check-in', 'Journey briefing']
      }
    ]
  },
  {
    id: '12',
    name: 'Badrinath Dham Yatra',
    location: 'Uttarakhand',
    state: 'Uttarakhand',
    duration: '5 days',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1589394810743-e5c2bb2e4cbb?w=500&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 234,
    difficulty: 'Moderate',
    groupSize: '8-15 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Badrinath Temple', 'Mana Village', 'Vasudhara Falls'],
    highlights: [
      'Vishnu temple darshan',
      'Last village of India',
      'Sacred hot springs',
      'Mountain valley experience'
    ],
    features: ['Guide included', 'All meals', 'Sightseeing'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Sightseeing tours',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Additional activities',
      'Shopping'
    ],
    requirements: [
      'Valid ID proof',
      'Warm clothing',
      'Moderate fitness',
      'Medical clearance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Haridwar',
        description: 'Start journey to Badrinath',
        activities: ['Travel preparation', 'Hotel check-in']
      }
    ]
  },
  {
    id: '13',
    name: 'Rameshwaram Temple Tour',
    location: 'Tamil Nadu',
    state: 'Tamil Nadu',
    duration: '4 days',
    price: 17000,
    image: 'https://images.unsplash.com/photo-1580757468219-ffc0fcdcb2aa?w=500&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 289,
    difficulty: 'Easy',
    groupSize: '10-20 people',
    region: 'South India',
    packageType: 'Standard',
    temples: ['Ramanathaswamy Temple', 'Gandamadana Parvatham', 'Five-faced Hanuman Temple'],
    highlights: [
      'Sacred island temple',
      'Longest temple corridor',
      'Holy water ritual',
      'Rama-Sita connection'
    ],
    features: ['Guide included', 'Island tours', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Island tours',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Water activities',
      'Additional sightseeing'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable clothing',
      'Sun protection'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Rameshwaram',
        description: 'Temple visit and island exploration',
        activities: ['Temple darshan', 'Island tour']
      }
    ]
  },
  {
    id: '14',
    name: 'Ajmer Sharif Dargah',
    location: 'Rajasthan',
    state: 'Rajasthan',
    duration: '3 days',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 167,
    difficulty: 'Easy',
    groupSize: '8-18 people',
    region: 'West India',
    packageType: 'Standard',
    temples: ['Ajmer Sharif Dargah', 'Adhai Din Ka Jhonpra', 'Taragarh Fort'],
    highlights: [
      'Sacred Sufi shrine',
      'Spiritual healing experience',
      'Cultural diversity',
      'Historical significance'
    ],
    features: ['Guide included', 'Cultural tours', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Dargah visits',
      'Cultural tours',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Shopping',
      'Additional activities'
    ],
    requirements: [
      'Valid ID proof',
      'Respectful attire',
      'Cultural sensitivity'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Ajmer',
        description: 'Dargah visit and cultural exploration',
        activities: ['Dargah darshan', 'Cultural tour']
      }
    ]
  },
  {
    id: '15',
    name: 'Gangotri Gomukh Yatra',
    location: 'Uttarakhand',
    state: 'Uttarakhand',
    duration: '7 days',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=500&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 145,
    difficulty: 'Challenging',
    groupSize: '6-10 people',
    region: 'North India',
    packageType: 'Premium',
    temples: ['Gangotri Temple', 'Gomukh Glacier', 'Surya Kund'],
    highlights: [
      'Source of river Ganga',
      'Glacier trekking experience',
      'High altitude spirituality',
      'Sacred water collection'
    ],
    features: ['Professional guide', 'Trekking gear', 'Medical support'],
    inclusions: [
      'Accommodation',
      'All meals',
      'Trekking equipment',
      'Medical kit',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Extra equipment',
      'Insurance'
    ],
    requirements: [
      'Excellent fitness',
      'Medical certificate',
      'Trekking experience',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Haridwar',
        description: 'Journey preparation and briefing',
        activities: ['Equipment check', 'Journey briefing']
      }
    ]
  },
  {
    id: '16',
    name: 'Konark Sun Temple',
    location: 'Odisha',
    state: 'Odisha',
    duration: '3 days',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1590664615692-6d754fb85c51?w=500&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 212,
    difficulty: 'Easy',
    groupSize: '10-20 people',
    region: 'East India',
    packageType: 'Standard',
    temples: ['Konark Sun Temple', 'Chandrabhaga Beach Temple', 'Ramchandi Temple'],
    highlights: [
      'UNESCO World Heritage site',
      'Architectural masterpiece',
      'Sun worship traditions',
      'Ancient stone carvings'
    ],
    features: ['Guide included', 'Beach visits', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Beach tours',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Water activities',
      'Shopping'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable walking',
      'Sun protection'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Konark',
        description: 'Sun temple visit and beach exploration',
        activities: ['Temple tour', 'Beach visit']
      }
    ]
  },
  {
    id: '17',
    name: 'Kamakhya Devi Temple',
    location: 'Assam',
    state: 'Assam',
    duration: '4 days',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1578625837956-d59f5d5cda52?w=500&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 189,
    difficulty: 'Easy',
    groupSize: '8-15 people',
    region: 'East India',
    packageType: 'Premium',
    temples: ['Kamakhya Temple', 'Umananda Temple', 'Basistha Temple'],
    highlights: [
      'Shakti Peetha temple',
      'Tantric traditions',
      'River island temple',
      'Cultural heritage'
    ],
    features: ['Guide included', 'Cultural tours', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Cultural tours',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Additional activities',
      'Shopping'
    ],
    requirements: [
      'Valid ID proof',
      'Respectful attire',
      'Cultural sensitivity'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Guwahati',
        description: 'Kamakhya temple visit and city tour',
        activities: ['Temple darshan', 'City exploration']
      }
    ]
  },
  {
    id: '18',
    name: 'Sabarimala Ayyappa Temple',
    location: 'Kerala',
    state: 'Kerala',
    duration: '5 days',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1582802499771-17c1e6d7be25?w=500&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 234,
    difficulty: 'Moderate',
    groupSize: '8-12 people',
    region: 'South India',
    packageType: 'Standard',
    temples: ['Sabarimala Temple', 'Pampa Ganapathi Temple', 'Maalikapurathamma Temple'],
    highlights: [
      'Lord Ayyappa darshan',
      'Forest temple trek',
      'Sacred 18 steps',
      'Spiritual purification'
    ],
    features: ['Guide included', 'Trek support', 'All meals'],
    inclusions: [
      'Accommodation',
      'All meals',
      'Trek support',
      'Temple visits',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Extra trek gear',
      'Shopping'
    ],
    requirements: [
      'Male pilgrims only',
      '41-day vratha',
      'Good fitness',
      'Valid ID proof'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kottayam',
        description: 'Preparation for Sabarimala journey',
        activities: ['Preparation', 'Vratha guidance']
      }
    ]
  },
  {
    id: '19',
    name: 'Rishikesh Haridwar Ganga Yatra',
    location: 'Uttarakhand',
    state: 'Uttarakhand',
    duration: '4 days',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1580745765596-8fc5eebbff45?w=500&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 298,
    difficulty: 'Easy',
    groupSize: '12-25 people',
    region: 'North India',
    packageType: 'Standard',
    temples: ['Har Ki Pauri', 'Laxman Jhula', 'Triveni Ghat', 'Chandi Devi Temple'],
    highlights: [
      'Sacred Ganga aarti',
      'Yoga and meditation',
      'Adventure capital experience',
      'Spiritual cleansing'
    ],
    features: ['Guide included', 'Yoga sessions', 'All meals'],
    inclusions: [
      'Hotel accommodation',
      'All meals',
      'Temple visits',
      'Yoga sessions',
      'Professional guide'
    ],
    exclusions: [
      'Personal expenses',
      'Adventure activities',
      'Shopping'
    ],
    requirements: [
      'Valid ID proof',
      'Comfortable clothing',
      'Open mindset'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Haridwar',
        description: 'Ganga aarti and temple visits',
        activities: ['Ganga aarti', 'Temple darshan']
      }
    ]
  },
  {
    id: '20',
    name: 'Kailash Mansarovar Yatra',
    location: 'Tibet',
    state: 'Tibet',
    duration: '14 days',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1596394658163-46ad21b2ed6b?w=500&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 89,
    difficulty: 'Extreme',
    groupSize: '4-8 people',
    region: 'International',
    packageType: 'Luxury',
    temples: ['Mount Kailash', 'Mansarovar Lake', 'Guge Kingdom Ruins'],
    highlights: [
      'Most sacred mountain pilgrimage',
      'Lake Mansarovar holy bath',
      'Parikrama of Mount Kailash',
      'Ultimate spiritual journey'
    ],
    features: ['International guide', 'Luxury accommodation', 'Medical support'],
    inclusions: [
      'International permits',
      'Luxury accommodation',
      'All meals',
      'Medical support',
      'Professional guide',
      'Oxygen support'
    ],
    exclusions: [
      'International flights',
      'Personal expenses',
      'Travel insurance',
      'Emergency evacuation'
    ],
    requirements: [
      'Excellent fitness',
      'Medical clearance',
      'Valid passport',
      'High altitude experience',
      'Mental preparedness'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Departure from Delhi',
        description: 'International journey begins',
        activities: ['Flight to Kathmandu', 'Preparation']
      }
    ]
  }
]

export function PilgrimageTours({ currentUser, filterSidebarOpen }: PilgrimageToursProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [10000, 100000],
    difficulty: [],
    region: [],
    state: [],
    duration: [],
    packageType: [],
    features: []
  })
  
  const [selectedTour, setSelectedTour] = useState<PilgrimagePackage | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})

  const handleSearchInFilter = (filterType: string, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const filteredPackages = useMemo(() => {
    return pilgrimagePackages.filter(pkg => {
      const matchesPrice = pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1]
      const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(pkg.difficulty)
      const matchesRegion = filters.region.length === 0 || filters.region.includes(pkg.region)
      const matchesState = filters.state.length === 0 || filters.state.includes(pkg.state)
      const matchesDuration = filters.duration.length === 0 || filters.duration.some(d => pkg.duration.includes(d))
      const matchesPackageType = filters.packageType.length === 0 || filters.packageType.includes(pkg.packageType)
      const matchesFeatures = filters.features.length === 0 || filters.features.some(f => pkg.features.includes(f))

      return matchesPrice && matchesDifficulty && matchesRegion && matchesState && 
             matchesDuration && matchesPackageType && matchesFeatures
    })
  }, [filters])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [10000, 100000],
      difficulty: [],
      region: [],
      state: [],
      duration: [],
      packageType: [],
      features: []
    })
    setSearchTerms({})
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

  const handleViewDetails = (pkg: PilgrimagePackage) => {
    setSelectedTour(pkg)
    setViewMode('detail')
  }

  const handleBooking = (pkg: PilgrimagePackage) => {
    setSelectedTour(pkg)
    setShowBookingModal(true)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedTour(null)
  }

  // Tour Detail Page Component
  const TourDetailPage = ({ tour }: { tour: PilgrimagePackage }) => {
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
          handleBooking(tour)
          setShowPaymentForm(false)
        } else {
          toast.error('Please fill all card details')
        }
      } else if (paymentMethod === 'upi') {
        if (upiId) {
          toast.success('UPI payment initiated successfully!')
          handleBooking(tour)
          setShowPaymentForm(false)
        } else {
          toast.error('Please enter valid UPI ID')
        }
      } else if (paymentMethod === 'netbanking') {
        toast.success('Redirecting to netbanking portal...')
        handleBooking(tour)
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
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBackToList}
            variant="outlined"
          >
            Back to Tours
          </Button>
        </Box>

        <Box sx={{ p: 2 }}>
          {/* First Row: Tour Image + Booking Panel */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            mb: 4, 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' }
          }}>
            {/* Tour Image - 50% width */}
            <Box sx={{ flex: '1 1 50%' }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={tour.image}
                  alt={tour.name}
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    const target = e.currentTarget
                    const sibling = target.nextElementSibling as HTMLElement
                    target.style.display = 'none'
                    if (sibling) sibling.style.display = 'flex'
                  }}
                />
                <Box
                  sx={{
                    width: '100%',
                    height: '400px',
                    background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    borderRadius: '8px'
                  }}
                >
                  🏛️
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white',
                    p: 2,
                    borderRadius: '0 0 8px 8px'
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {tour.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" />
                      <Typography variant="body2">{tour.state}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">{tour.duration}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Group fontSize="small" />
                      <Typography variant="body2">{tour.groupSize}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Booking Panel - 50% width */}
            <Box sx={{ flex: '1 1 50%' }}>
              <Paper elevation={3} sx={{ p: 2.5, height: 'fit-content', position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Book This Pilgrimage
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ mb: 0.5 }}>
                    ₹{tour.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">per person</Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Quick Info */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Duration: {tour.duration} • Group: {tour.groupSize}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Rating value={tour.rating} readOnly size="small" />
                    <Typography variant="caption">
                      {tour.rating} ({tour.reviewCount} reviews)
                    </Typography>
                  </Box>
                  <Chip 
                    label={tour.difficulty} 
                    size="small" 
                    color={tour.difficulty === 'Easy' ? 'success' : tour.difficulty === 'Moderate' ? 'warning' : 'error'}
                  />
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
                      startIcon={<CalendarMonth />}
                      onClick={() => paymentMethod ? processPayment() : toast.error('Please select a payment method')}
                      sx={{ mb: 1.5 }}
                    >
                      Book Now
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
                      Pay ₹{tour.price.toLocaleString()}
                    </Button>
                  </Box>
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={favorites.includes(tour.id) ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => toggleFavorite(tour.id)}
                  size="small"
                  sx={{ mb: 1 }}
                >
                  {favorites.includes(tour.id) ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  startIcon={<Share />}
                  size="small"
                >
                  Share Tour
                </Button>
              </Paper>
            </Box>
          </Box>

          {/* Second Row: Comprehensive Details */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              Complete Tour Details
            </Typography>

            {/* Tour Overview */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                About This Pilgrimage
              </Typography>
              <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                {tour.highlights.join('. ')}
              </Typography>

              {/* Quick Stats */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                gap: 1.5,
                mb: 2
              }}>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{tour.duration}</Typography>
                  <Typography variant="caption" color="text.secondary">Duration</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{tour.groupSize}</Typography>
                  <Typography variant="caption" color="text.secondary">Group Size</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{tour.rating}</Typography>
                  <Typography variant="caption" color="text.secondary">Rating</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body1" color="primary" fontWeight="bold">
                    {tour.difficulty}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Sacred Sites */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Temples & Sacred Sites
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {tour.temples.map(temple => (
                  <Chip key={temple} label={temple} variant="outlined" size="small" />
                ))}
              </Box>
            </Box>

            {/* Features */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Tour Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {tour.features.map(feature => (
                  <Chip key={feature} label={feature} color="primary" size="small" />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Itinerary */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Day-wise Itinerary
              </Typography>
              <Box sx={{ space: 1 }}>
                {tour.itinerary.slice(0, 3).map(day => (
                  <Accordion key={day.day} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="body2" fontWeight="medium">
                        Day {day.day}: {day.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>{day.description}</Typography>
                      {day.activities && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            Activities:
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                            {day.activities.map((activity, idx) => (
                              <Typography key={idx} variant="caption" component="li" color="text.secondary">
                                {activity}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
                {tour.itinerary.length > 3 && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    + {tour.itinerary.length - 3} more days...
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Inclusions & Exclusions */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              mb: 3
            }}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium" color="success.main">
                  What's Included
                </Typography>
                <Box>
                  {tour.inclusions.slice(0, 5).map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Check color="success" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                  {tour.inclusions.length > 5 && (
                    <Typography variant="caption" color="text.secondary">
                      + {tour.inclusions.length - 5} more inclusions
                    </Typography>
                  )}
                </Box>
              </Paper>

              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium" color="error.main">
                  What's Not Included
                </Typography>
                <Box>
                  {tour.exclusions.slice(0, 5).map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Close color="error" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                  {tour.exclusions.length > 5 && (
                    <Typography variant="caption" color="text.secondary">
                      + {tour.exclusions.length - 5} more exclusions
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Requirements */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Requirements & Guidelines
              </Typography>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ space: 1 }}>
                  {tour.requirements.map((req, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccountBalance sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="body2">{req}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>
    )
  }

  // Show detail view
  if (viewMode === 'detail' && selectedTour) {
    return (
      <Box className="p-6">
        <TourDetailPage tour={selectedTour} />
        {showBookingModal && selectedTour && (
          <BookingModal
            open={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            bike={{
              id: selectedTour.id,
              name: selectedTour.name,
              model: 'Pilgrimage Package',
              brand: 'Sacred Journeys',
              year: 2024,
              transmission: 'Guided',
              fuelType: 'Spiritual',
              pricePerHour: selectedTour.price / 24,
              pricePerDay: selectedTour.price,
              pricePerWeek: selectedTour.price * 6,
              pricePerMonth: selectedTour.price * 20,
              rating: selectedTour.rating,
              reviews: selectedTour.reviewCount,
              trips: 0,
              safetyDeposit: 5000,
              city: selectedTour.state,
              pickupLocation: selectedTour.location,
              operatingHours: '24/7',
              image: selectedTour.image,
              images: [selectedTour.image],
              available: true,
              coordinates: { latitude: 28.6139, longitude: 77.2090 }
            }}
            currentUser={currentUser}
          />
        )}
      </Box>
    )
  }

  // Main tours list view
  return (
    <Box className="flex min-h-screen bg-background">
      {/* Left Sidebar - 15% width */}
      {filterSidebarOpen && (
        <Paper 
          elevation={2}
          className="w-[15%] min-w-[280px] p-4 overflow-y-auto h-screen sticky top-0"
          sx={{ borderRadius: 0 }}
        >
          <Typography variant="h6" className="mb-4 font-semibold text-foreground">
          <FilterList className="inline mr-2" />
          Filters
        </Typography>

        {/* Price Range Filter */}
        <Box className="mb-4">
          <Typography variant="body2" className="mb-2 font-medium">
            Price Range (₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()})
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={(_, newValue) => updateFilter('priceRange', newValue)}
            min={10000}
            max={100000}
            step={5000}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
            size="small"
          />
        </Box>

        {/* State Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">🏛️ State</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              size="small"
              placeholder="Search states..."
              value={searchTerms.state || ''}
              onChange={(e) => handleSearchInFilter('state', e.target.value)}
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
                {['Uttarakhand', 'Jammu & Kashmir', 'Andhra Pradesh', 'Uttar Pradesh', 'Gujarat']
                  .filter(state => 
                    !searchTerms.state || 
                    state.toLowerCase().includes(searchTerms.state.toLowerCase())
                  )
                  .map(state => (
                  <FormControlLabel
                    key={state}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.state.includes(state)}
                        onChange={(e) => {
                          const newState = e.target.checked
                            ? [...filters.state, state]
                            : filters.state.filter(s => s !== state)
                          updateFilter('state', newState)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{state}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Duration Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">📅 Duration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['3 days', '4 days', '5 days', '6 days', '7 days', '12 days'].map(duration => (
                <FormControlLabel
                  key={duration}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.duration.includes(duration)}
                      onChange={(e) => {
                        const newDuration = e.target.checked
                          ? [...filters.duration, duration]
                          : filters.duration.filter(d => d !== duration)
                        updateFilter('duration', newDuration)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{duration}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Difficulty Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">⛰️ Difficulty Level</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['Easy', 'Moderate', 'Challenging'].map(diff => (
                <FormControlLabel
                  key={diff}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.difficulty.includes(diff)}
                      onChange={(e) => {
                        const newDifficulty = e.target.checked
                          ? [...filters.difficulty, diff]
                          : filters.difficulty.filter(d => d !== diff)
                        updateFilter('difficulty', newDifficulty)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{diff}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Package Type Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">⭐ Package Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['Economy', 'Standard', 'Premium'].map(type => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.packageType.includes(type)}
                      onChange={(e) => {
                        const newType = e.target.checked
                          ? [...filters.packageType, type]
                          : filters.packageType.filter(t => t !== type)
                        updateFilter('packageType', newType)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{type}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Region Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">🗺️ Region</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {['North India', 'South India', 'West India', 'East India'].map(region => (
                <FormControlLabel
                  key={region}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.region.includes(region)}
                      onChange={(e) => {
                        const newRegion = e.target.checked
                          ? [...filters.region, region]
                          : filters.region.filter(r => r !== region)
                        updateFilter('region', newRegion)
                      }}
                    />
                  }
                  label={<Typography variant="body2">{region}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Features Filter */}
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="body2" className="font-medium">🎯 Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              size="small"
              placeholder="Search features..."
              value={searchTerms.features || ''}
              onChange={(e) => handleSearchInFilter('features', e.target.value)}
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
                {['Guide included', 'Helicopter service', 'Luxury accommodation', 'VIP darshan', 'All meals']
                  .filter(feature => 
                    !searchTerms.features || 
                    feature.toLowerCase().includes(searchTerms.features.toLowerCase())
                  )
                  .map(feature => (
                  <FormControlLabel
                    key={feature}
                    control={
                      <Checkbox
                        size="small"
                        checked={filters.features.includes(feature)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...filters.features, feature]
                            : filters.features.filter(f => f !== feature)
                          updateFilter('features', newFeatures)
                        }}
                      />
                    }
                    label={<Typography variant="body2">{feature}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
      )}

      {/* Main Content Area - adjust width based on sidebar visibility */}
      <Box className={filterSidebarOpen ? "flex-1 p-6" : "w-full p-6"}>
        {/* Top Bar with Results Count */}
        <Paper elevation={1} className="p-4 mb-6">
          <Box className="flex items-center justify-between">
            <Typography variant="h6" className="text-foreground">
              {filteredPackages.length} Pilgrimage Tours Available
            </Typography>
            <Button variant="outlined" size="small" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </Box>
        </Paper>

        {/* Tours Grid */}
        {filteredPackages.length === 0 ? (
          <Box className="text-center py-8">
            <AccountBalance sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tours match your filters
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters to see more options
            </Typography>
            <Button variant="outlined" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
            {filteredPackages.map(pkg => (
              <Card key={pkg.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <Box 
                    component="img"
                    src={pkg.image}
                    alt={pkg.name}
                    sx={{ 
                      width: '100%', 
                      height: 200, 
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      const target = e.currentTarget
                      const sibling = target.nextElementSibling as HTMLElement
                      target.style.display = 'none'
                      if (sibling) sibling.style.display = 'flex'
                    }}
                  />
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 200, 
                      background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}
                  >
                    🏛️
                  </Box>
                  <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                    <Chip 
                      label={pkg.packageType} 
                      size="small" 
                      color={pkg.packageType === 'Premium' ? 'primary' : pkg.packageType === 'Standard' ? 'default' : 'secondary'}
                    />
                  </Box>
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                      onClick={() => toggleFavorite(pkg.id)}
                    >
                      {favorites.includes(pkg.id) ? 
                        <Favorite color="error" /> : 
                        <FavoriteBorder />
                      }
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {pkg.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {pkg.state}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {pkg.duration}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={pkg.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {pkg.rating} ({pkg.reviewCount})
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2, flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Sacred Temples:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {pkg.temples.slice(0, 2).map(temple => (
                        <Chip key={temple} label={temple} size="small" variant="outlined" />
                      ))}
                      {pkg.temples.length > 2 && (
                        <Chip label={`+${pkg.temples.length - 2} more`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        ₹{pkg.price.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per person
                      </Typography>
                    </Box>
                    <Chip 
                      label={pkg.difficulty} 
                      size="small" 
                      color={pkg.difficulty === 'Easy' ? 'success' : pkg.difficulty === 'Moderate' ? 'warning' : 'error'}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleViewDetails(pkg)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<BookOnline />}
                      onClick={() => handleBooking(pkg)}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Booking Modal */}
      {showBookingModal && selectedTour && (
        <BookingModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          bike={{
            id: selectedTour.id,
            name: selectedTour.name,
            model: 'Pilgrimage Package',
            brand: 'Sacred Journeys',
            year: 2024,
            transmission: 'Guided',
            fuelType: 'Spiritual',
            pricePerHour: selectedTour.price / 24,
            pricePerDay: selectedTour.price,
            pricePerWeek: selectedTour.price * 6,
            pricePerMonth: selectedTour.price * 20,
            rating: selectedTour.rating,
            reviews: selectedTour.reviewCount,
            trips: 0,
            safetyDeposit: 5000,
            city: selectedTour.state,
            pickupLocation: selectedTour.location,
            operatingHours: '24/7',
            image: selectedTour.image,
            images: [selectedTour.image],
            available: true,
            coordinates: { latitude: 28.6139, longitude: 77.2090 }
          }}
          currentUser={currentUser}
        />
      )}
    </Box>
  )
}
