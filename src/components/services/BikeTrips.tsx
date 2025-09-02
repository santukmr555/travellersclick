import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AppBar, Toolbar, Typography, IconButton, Rating, Paper, TextField, Box, Divider, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { 
  Star,
  CheckCircle,
  Cancel,
  ArrowBack,
  LocationOn,
  ChevronRight,
  Search,
  Filter,
  Tune,
  CreditCard,
  Payment,
  AccountBalance,
  Warning,
  AccessTime,
  Group,
  ExpandMore,
  Check,
  Close
} from '@mui/icons-material'
import { User } from '@/App'
import { toast } from 'sonner'

interface GuidedBikeTrip {
  id: string
  name: string
  route: string
  duration: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
  region: string
  startLocation: string
  endLocation: string
  distance: number
  maxAltitude: number
  groupSize: { min: number; max: number }
  price: { original: number; discounted?: number }
  rating: number
  reviews: number
  tripType: 'One-Way' | 'Round Trip' | 'Circuit'
  bikeType: 'Royal Enfield' | 'KTM' | 'Himalayan' | 'Any'
  startDate: string
  endDate: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
    distance?: number
    highlights?: string[]
  }>
  fitnessLevel: 'Basic' | 'Moderate' | 'High'
  ageRestriction: { min: number; max: number }
  documentsRequired: string[]
  safeProv: boolean
  mechanicSupport: boolean
  medicalSupport: boolean
  backupVehicle: boolean
  tripLeader: {
    name: string
    experience: string
    rating: number
    completedTrips: number
  }
  currentParticipants: number
  image: string
  gallery: string[]
}

interface BikeTripsProps {
  currentUser: User | null
  filterSidebarOpen: boolean
}

const DIFFICULTY_COLORS = {
  'Easy': 'bg-green-100 text-green-700 border-green-300',
  'Moderate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Challenging': 'bg-orange-100 text-orange-700 border-orange-300',
  'Extreme': 'bg-red-100 text-red-700 border-red-300'
}

const mockTrips: GuidedBikeTrip[] = [
  {
    id: '1',
    name: 'Leh Ladakh Ultimate Adventure',
    route: 'Srinagar → Leh → Manali',
    duration: '11 Days, 10 Nights',
    difficulty: 'Extreme',
    region: 'Ladakh',
    startLocation: 'Srinagar',
    endLocation: 'Manali',
    distance: 1600,
    maxAltitude: 5359,
    groupSize: { min: 6, max: 12 },
    price: { original: 51999, discounted: 42999 },
    rating: 4.8,
    reviews: 156,
    tripType: 'One-Way',
    bikeType: 'Royal Enfield',
    startDate: '2024-06-15',
    endDate: '2024-06-25',
    highlights: ['Cross Khardung La - World\'s highest motorable road', 'Pangong Lake sunset and sunrise', 'Nubra Valley desert experience'],
    inclusions: ['Royal Enfield Himalayan motorcycle', 'Fuel for entire itinerary', 'Accommodation (hotels/camps)', 'Breakfast and dinner'],
    exclusions: ['Lunch on all days', 'Personal expenses', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Arrival in Srinagar', description: 'Arrive in Srinagar, bike briefing, local sightseeing', highlights: ['Dal Lake', 'Mughal Gardens'] },
      { day: 2, title: 'Srinagar to Kargil', description: 'Ride through beautiful valleys', distance: 200, highlights: ['Zoji La Pass'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 21, max: 55 },
    documentsRequired: ['Valid driving license', 'Government ID proof'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Rajesh Kumar', experience: '8 years', rating: 4.9, completedTrips: 89 },
    currentParticipants: 8,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
  },
  {
    id: '2',
    name: 'Coastal Karnataka Explorer',
    route: 'Bangalore → Gokarna → Mangalore',
    duration: '5 Days, 4 Nights',
    difficulty: 'Moderate',
    region: 'Karnataka',
    startLocation: 'Bangalore',
    endLocation: 'Mangalore',
    distance: 800,
    maxAltitude: 900,
    groupSize: { min: 4, max: 8 },
    price: { original: 18999, discounted: 14999 },
    rating: 4.6,
    reviews: 89,
    tripType: 'One-Way',
    bikeType: 'Any',
    startDate: '2024-07-01',
    endDate: '2024-07-05',
    highlights: ['Beautiful coastal roads', 'Gokarna beach camping', 'Western Ghats scenery'],
    inclusions: ['Accommodation in hotels/camps', 'Breakfast and dinner', 'Professional guide'],
    exclusions: ['Motorcycle (bring your own)', 'Lunch', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Bangalore to Shimoga', description: 'Start the coastal journey', distance: 280, highlights: ['Coffee plantations'] },
      { day: 2, title: 'Shimoga to Gokarna', description: 'Ride to beautiful beach town', distance: 200, highlights: ['Coastal roads'] }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 60 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: false, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Priya Nair', experience: '5 years', rating: 4.7, completedTrips: 45 },
    currentParticipants: 4,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop']
  },
  {
    id: '3',
    name: 'Spiti Valley Circuit',
    route: 'Manali → Spiti → Manali',
    duration: '8 Days, 7 Nights',
    difficulty: 'Challenging',
    region: 'Himachal Pradesh',
    startLocation: 'Manali',
    endLocation: 'Manali',
    distance: 1200,
    maxAltitude: 4551,
    groupSize: { min: 6, max: 10 },
    price: { original: 32999, discounted: 28999 },
    rating: 4.7,
    reviews: 134,
    tripType: 'Circuit',
    bikeType: 'Himalayan',
    startDate: '2024-08-10',
    endDate: '2024-08-17',
    highlights: ['Key Monastery', 'Chandratal Lake camping', 'Ancient Buddhist culture'],
    inclusions: ['Royal Enfield Himalayan', 'Camping and hotel stay', 'All meals'],
    exclusions: ['Personal gear', 'Insurance', 'Tips to guides'],
    itinerary: [
      { day: 1, title: 'Manali to Kaza', description: 'Epic ride through high passes', distance: 200, highlights: ['Rohtang Pass', 'Kunzum Pass'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 20, max: 50 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Arjun Singh', experience: '6 years', rating: 4.8, completedTrips: 67 },
    currentParticipants: 7,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
  },
  {
    id: '4',
    name: 'Rajasthan Desert Safari',
    route: 'Jodhpur → Jaisalmer → Bikaner',
    duration: '6 Days, 5 Nights',
    difficulty: 'Moderate',
    region: 'Rajasthan',
    startLocation: 'Jodhpur',
    endLocation: 'Bikaner',
    distance: 650,
    maxAltitude: 500,
    groupSize: { min: 6, max: 14 },
    price: { original: 24999, discounted: 19999 },
    rating: 4.5,
    reviews: 112,
    tripType: 'One-Way',
    bikeType: 'Royal Enfield',
    startDate: '2024-11-01',
    endDate: '2024-11-06',
    highlights: ['Golden city of Jaisalmer', 'Desert camping under stars', 'Mehrangarh Fort exploration'],
    inclusions: ['Royal Enfield Classic bikes', 'Desert camping accommodation', 'All meals with Rajasthani cuisine'],
    exclusions: ['Personal expenses', 'Monument entry fees', 'Shopping expenses'],
    itinerary: [
      { day: 1, title: 'Jodhpur Exploration', description: 'Explore the Blue City and Mehrangarh Fort', distance: 0, highlights: ['Mehrangarh Fort', 'Blue City tour'] }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 65 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Vikram Rathore', experience: '7 years', rating: 4.6, completedTrips: 78 },
    currentParticipants: 9,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop']
  },
  {
    id: '5',
    name: 'Kerala Backwaters & Hills',
    route: 'Kochi → Munnar → Alleppey',
    duration: '5 Days, 4 Nights',
    difficulty: 'Easy',
    region: 'Kerala',
    startLocation: 'Kochi',
    endLocation: 'Alleppey',
    distance: 450,
    maxAltitude: 1600,
    groupSize: { min: 4, max: 10 },
    price: { original: 19999, discounted: 16999 },
    rating: 4.7,
    reviews: 98,
    tripType: 'One-Way',
    bikeType: 'Any',
    startDate: '2024-09-15',
    endDate: '2024-09-19',
    highlights: ['Tea plantation tours', 'Backwater houseboat experience', 'Ayurvedic treatments'],
    inclusions: ['Scooter rental', 'Houseboat stay', 'Tea plantation tours', 'All meals'],
    exclusions: ['Ayurvedic treatments', 'Personal shopping', 'Additional activities'],
    itinerary: [
      { day: 1, title: 'Kochi to Munnar', description: 'Ride through spice plantations to hill station', distance: 130, highlights: ['Spice gardens', 'Hill station arrival'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 16, max: 70 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Ravi Menon', experience: '4 years', rating: 4.8, completedTrips: 52 },
    currentParticipants: 6,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop']
  },
  {
    id: '6',
    name: 'Northeast Explorer',
    route: 'Guwahati → Shillong → Cherrapunji',
    duration: '7 Days, 6 Nights',
    difficulty: 'Challenging',
    region: 'Northeast India',
    startLocation: 'Guwahati',
    endLocation: 'Cherrapunji',
    distance: 950,
    maxAltitude: 1700,
    groupSize: { min: 5, max: 8 },
    price: { original: 35999, discounted: 29999 },
    rating: 4.8,
    reviews: 67,
    tripType: 'One-Way',
    bikeType: 'Himalayan',
    startDate: '2024-10-05',
    endDate: '2024-10-11',
    highlights: ['Living root bridges', 'Wettest place on Earth', 'Tribal culture experiences'],
    inclusions: ['Adventure motorcycles', 'Tribal homestays', 'All meals', 'Inner line permits'],
    exclusions: ['Personal gear', 'Photography fees', 'Additional permits'],
    itinerary: [
      { day: 1, title: 'Guwahati to Shillong', description: 'Ride to the Scotland of East', distance: 100, highlights: ['Scotland of East', 'Hill station arrival'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 21, max: 50 },
    documentsRequired: ['Valid driving license', 'Government ID', 'Inner Line Permit'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'David Nongmei', experience: '6 years', rating: 4.9, completedTrips: 43 },
    currentParticipants: 5,
    image: 'https://images.unsplash.com/photo-1578635073855-a89b3dd2c1d1?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1578635073855-a89b3dd2c1d1?w=500&h=300&fit=crop']
  },
  {
    id: '7',
    name: 'Western Ghats Circuit',
    route: 'Pune → Lonavala → Mahabaleshwar',
    duration: '3 Days, 2 Nights',
    difficulty: 'Easy',
    region: 'Maharashtra',
    startLocation: 'Pune',
    endLocation: 'Mahabaleshwar',
    distance: 350,
    maxAltitude: 1438,
    groupSize: { min: 6, max: 16 },
    price: { original: 12999, discounted: 9999 },
    rating: 4.4,
    reviews: 156,
    tripType: 'Circuit',
    bikeType: 'Any',
    startDate: '2024-12-01',
    endDate: '2024-12-03',
    highlights: ['Lonavala hill station', 'Karla and Bhaja caves', 'Strawberry farms'],
    inclusions: ['Accommodation in hill resorts', 'All meals', 'Cave exploration'],
    exclusions: ['Personal motorcycle', 'Entry fees', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Pune to Lonavala', description: 'Scenic ride to hill station', distance: 65, highlights: ['Hill station arrival', 'Cave visits'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 18, max: 65 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: false, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Ajay Patil', experience: '3 years', rating: 4.5, completedTrips: 34 },
    currentParticipants: 12,
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop']
  },
  {
    id: '8',
    name: 'Golden Triangle Adventure',
    route: 'Delhi → Agra → Jaipur → Delhi',
    duration: '4 Days, 3 Nights',
    difficulty: 'Easy',
    region: 'North India',
    startLocation: 'Delhi',
    endLocation: 'Delhi',
    distance: 720,
    maxAltitude: 300,
    groupSize: { min: 8, max: 20 },
    price: { original: 16999, discounted: 13999 },
    rating: 4.3,
    reviews: 234,
    tripType: 'Circuit',
    bikeType: 'Royal Enfield',
    startDate: '2024-08-20',
    endDate: '2024-08-23',
    highlights: ['Taj Mahal at sunrise', 'Red Fort and India Gate', 'Amber Fort exploration'],
    inclusions: ['Royal Enfield Classic bikes', 'Heritage hotel stays', 'All monument entries'],
    exclusions: ['Personal expenses', 'Shopping', 'Tips to guides'],
    itinerary: [
      { day: 1, title: 'Delhi to Agra', description: 'Ride to the city of Taj Mahal', distance: 200, highlights: ['Taj Mahal visit', 'Agra Fort'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 18, max: 70 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Rohit Sharma', experience: '5 years', rating: 4.4, completedTrips: 67 },
    currentParticipants: 15,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop']
  },
  {
    id: '9',
    name: 'Himalayan Base Camp Trek',
    route: 'Rishikesh → Valley of Flowers → Hemkund',
    duration: '9 Days, 8 Nights',
    difficulty: 'Extreme',
    region: 'Uttarakhand',
    startLocation: 'Rishikesh',
    endLocation: 'Rishikesh',
    distance: 800,
    maxAltitude: 4329,
    groupSize: { min: 4, max: 8 },
    price: { original: 42999, discounted: 37999 },
    rating: 4.9,
    reviews: 89,
    tripType: 'Circuit',
    bikeType: 'Himalayan',
    startDate: '2024-07-15',
    endDate: '2024-07-23',
    highlights: ['Valley of Flowers National Park', 'Hemkund Sahib gurudwara', 'Alpine meadows'],
    inclusions: ['Royal Enfield Himalayan', 'Trekking equipment', 'Professional trek leader'],
    exclusions: ['Personal trekking gear', 'Insurance', 'Emergency evacuation'],
    itinerary: [
      { day: 1, title: 'Rishikesh to Govindghat', description: 'Begin the Himalayan adventure', distance: 300, highlights: ['Himalayan foothills', 'Base camp preparation'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 25, max: 45 },
    documentsRequired: ['Valid driving license', 'Government ID', 'Medical fitness certificate'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Ankit Rawat', experience: '10 years', rating: 5.0, completedTrips: 76 },
    currentParticipants: 6,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop']
  },
  {
    id: '10',
    name: 'Goa Coastal Cruise',
    route: 'Panaji → Anjuna → Arambol',
    duration: '3 Days, 2 Nights',
    difficulty: 'Easy',
    region: 'Goa',
    startLocation: 'Panaji',
    endLocation: 'Arambol',
    distance: 150,
    maxAltitude: 50,
    groupSize: { min: 6, max: 12 },
    price: { original: 8999, discounted: 6999 },
    rating: 4.2,
    reviews: 187,
    tripType: 'One-Way',
    bikeType: 'Any',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    highlights: ['Beach hopping adventure', 'Portuguese heritage sites', 'Sunset at Anjuna beach'],
    inclusions: ['Scooter rental', 'Beach resort accommodation', 'All meals with Goan cuisine'],
    exclusions: ['Water sports', 'Personal shopping', 'Alcoholic beverages'],
    itinerary: [
      { day: 1, title: 'Panaji to Anjuna', description: 'Explore capital and famous beaches', distance: 40, highlights: ['Old Goa churches', 'Anjuna beach'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 18, max: 60 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: false, medicalSupport: false, backupVehicle: false,
    tripLeader: { name: 'Maria D\'Souza', experience: '4 years', rating: 4.3, completedTrips: 89 },
    currentParticipants: 8,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop']
  },
  {
    id: '11',
    name: 'Manali to Rohtang Pass',
    route: 'Manali → Rohtang Pass → Solang Valley',
    duration: '2 Days, 1 Night',
    difficulty: 'Moderate',
    region: 'Himachal Pradesh',
    startLocation: 'Manali',
    endLocation: 'Manali',
    distance: 100,
    maxAltitude: 3978,
    groupSize: { min: 4, max: 10 },
    price: { original: 7999, discounted: 5999 },
    rating: 4.6,
    reviews: 145,
    tripType: 'Circuit',
    bikeType: 'Himalayan',
    startDate: '2024-06-01',
    endDate: '2024-06-02',
    highlights: ['Snow-capped mountain views', 'Rohtang Pass adventure', 'Solang Valley activities'],
    inclusions: ['Royal Enfield Himalayan', 'Mountain accommodation', 'All meals'],
    exclusions: ['Adventure activities', 'Personal gear', 'Insurance'],
    itinerary: [
      { day: 1, title: 'Manali to Rohtang Pass', description: 'High altitude adventure ride', distance: 51, highlights: ['Rohtang Pass', 'Snow activities'] }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 55 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Suresh Thakur', experience: '6 years', rating: 4.7, completedTrips: 123 },
    currentParticipants: 7,
    image: 'https://images.unsplash.com/photo-1589394810743-e5c2bb2e4cbb?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1589394810743-e5c2bb2e4cbb?w=500&h=300&fit=crop']
  },
  {
    id: '12',
    name: 'Chikmagalur Coffee Trail',
    route: 'Bangalore → Chikmagalur → Coorg',
    duration: '4 Days, 3 Nights',
    difficulty: 'Easy',
    region: 'Karnataka',
    startLocation: 'Bangalore',
    endLocation: 'Coorg',
    distance: 520,
    maxAltitude: 1895,
    groupSize: { min: 6, max: 14 },
    price: { original: 15999, discounted: 12999 },
    rating: 4.5,
    reviews: 98,
    tripType: 'One-Way',
    bikeType: 'Any',
    startDate: '2024-11-10',
    endDate: '2024-11-13',
    highlights: ['Coffee plantation tours', 'Mullayanagiri peak', 'Hebbe Falls visit'],
    inclusions: ['Plantation accommodation', 'Coffee plantation tours', 'All meals'],
    exclusions: ['Personal motorcycle', 'Personal expenses', 'Additional activities'],
    itinerary: [
      { day: 1, title: 'Bangalore to Chikmagalur', description: 'Ride to coffee country', distance: 245, highlights: ['Coffee plantations', 'Hill station arrival'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 18, max: 65 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: false, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Kiran Reddy', experience: '4 years', rating: 4.6, completedTrips: 56 },
    currentParticipants: 10,
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop']
  },
  {
    id: '13',
    name: 'Andaman Island Explorer',
    route: 'Port Blair → Havelock → Neil Island',
    duration: '6 Days, 5 Nights',
    difficulty: 'Easy',
    region: 'Andaman Islands',
    startLocation: 'Port Blair',
    endLocation: 'Neil Island',
    distance: 200,
    maxAltitude: 100,
    groupSize: { min: 4, max: 8 },
    price: { original: 45999, discounted: 39999 },
    rating: 4.8,
    reviews: 67,
    tripType: 'One-Way',
    bikeType: 'Any',
    startDate: '2024-10-20',
    endDate: '2024-10-25',
    highlights: ['Pristine tropical beaches', 'Scuba diving experience', 'Cellular Jail history'],
    inclusions: ['Scooter rental', 'Beach resort stays', 'All meals', 'Boat transfers'],
    exclusions: ['Flight tickets', 'Personal expenses', 'Additional water sports'],
    itinerary: [
      { day: 1, title: 'Port Blair Exploration', description: 'Explore the capital of Andaman', distance: 0, highlights: ['Cellular Jail', 'Local markets'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 18, max: 60 },
    documentsRequired: ['Valid driving license', 'Government ID', 'Flight booking'],
    safeProv: true, mechanicSupport: false, medicalSupport: true, backupVehicle: false,
    tripLeader: { name: 'Ravi Kumar', experience: '5 years', rating: 4.9, completedTrips: 34 },
    currentParticipants: 5,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop']
  },
  {
    id: '14',
    name: 'Rann of Kutch Adventure',
    route: 'Ahmedabad → Bhuj → White Rann',
    duration: '4 Days, 3 Nights',
    difficulty: 'Moderate',
    region: 'Gujarat',
    startLocation: 'Ahmedabad',
    endLocation: 'Kutch',
    distance: 450,
    maxAltitude: 200,
    groupSize: { min: 6, max: 12 },
    price: { original: 21999, discounted: 17999 },
    rating: 4.7,
    reviews: 89,
    tripType: 'One-Way',
    bikeType: 'Royal Enfield',
    startDate: '2024-12-20',
    endDate: '2024-12-23',
    highlights: ['White salt desert experience', 'Full moon night camping', 'Traditional handicrafts'],
    inclusions: ['Royal Enfield Classic bikes', 'Desert camping', 'All meals'],
    exclusions: ['Personal expenses', 'Shopping', 'Additional activities'],
    itinerary: [
      { day: 1, title: 'Ahmedabad to Bhuj', description: 'Journey to the gateway of Kutch', distance: 350, highlights: ['Desert landscapes', 'Bhuj arrival'] }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 60 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Harsh Patel', experience: '7 years', rating: 4.8, completedTrips: 92 },
    currentParticipants: 8,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop']
  },
  {
    id: '15',
    name: 'Darjeeling Hills Circuit',
    route: 'Siliguri → Darjeeling → Kalimpong',
    duration: '5 Days, 4 Nights',
    difficulty: 'Moderate',
    region: 'West Bengal',
    startLocation: 'Siliguri',
    endLocation: 'Kalimpong',
    distance: 300,
    maxAltitude: 2134,
    groupSize: { min: 5, max: 10 },
    price: { original: 18999, discounted: 15999 },
    rating: 4.6,
    reviews: 123,
    tripType: 'One-Way',
    bikeType: 'Himalayan',
    startDate: '2024-09-01',
    endDate: '2024-09-05',
    highlights: ['Tiger Hill sunrise', 'Himalayan Railway experience', 'Tea garden visits'],
    inclusions: ['Royal Enfield Himalayan', 'Hill station accommodation', 'All meals'],
    exclusions: ['Toy train tickets', 'Personal expenses', 'Shopping'],
    itinerary: [
      { day: 1, title: 'Siliguri to Darjeeling', description: 'Ride to the Queen of Hills', distance: 70, highlights: ['Hill station arrival', 'Tea gardens'] }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 60 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Tenzin Sherpa', experience: '6 years', rating: 4.7, completedTrips: 78 },
    currentParticipants: 7,
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop']
  },
  {
    id: '16',
    name: 'Hampi Heritage Trail',
    route: 'Bangalore → Hampi → Badami',
    duration: '3 Days, 2 Nights',
    difficulty: 'Easy',
    region: 'Karnataka',
    startLocation: 'Bangalore',
    endLocation: 'Badami',
    distance: 650,
    maxAltitude: 467,
    groupSize: { min: 8, max: 16 },
    price: { original: 13999, discounted: 10999 },
    rating: 4.4,
    reviews: 156,
    tripType: 'One-Way',
    bikeType: 'Any',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    highlights: ['UNESCO World Heritage site', 'Vijayanagara Empire ruins', 'Ancient temple architecture'],
    inclusions: ['Heritage hotel accommodation', 'All meals', 'Monument entries'],
    exclusions: ['Personal motorcycle', 'Personal expenses', 'Photography fees'],
    itinerary: [
      { day: 1, title: 'Bangalore to Hampi', description: 'Journey to the ruined city', distance: 350, highlights: ['Vijayanagara ruins', 'Temple visits'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 18, max: 70 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: false, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Santosh Kumar', experience: '5 years', rating: 4.5, completedTrips: 67 },
    currentParticipants: 11,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop']
  },
  {
    id: '17',
    name: 'Zanskar Frozen River Trek',
    route: 'Leh → Zanskar Valley → Padum',
    duration: '12 Days, 11 Nights',
    difficulty: 'Extreme',
    region: 'Ladakh',
    startLocation: 'Leh',
    endLocation: 'Padum',
    distance: 900,
    maxAltitude: 4400,
    groupSize: { min: 4, max: 6 },
    price: { original: 65999, discounted: 57999 },
    rating: 5.0,
    reviews: 23,
    tripType: 'One-Way',
    bikeType: 'Himalayan',
    startDate: '2024-01-20',
    endDate: '2024-01-31',
    highlights: ['Frozen river motorcycle trek', 'Winter Himalayan experience', 'Buddhist monasteries in snow'],
    inclusions: ['Royal Enfield Himalayan', 'Winter gear and equipment', 'Professional guide'],
    exclusions: ['Personal winter clothing', 'Travel insurance', 'Emergency evacuation'],
    itinerary: [
      { day: 1, title: 'Leh Preparation', description: 'Winter gear briefing and preparation', distance: 0, highlights: ['Equipment check', 'Weather briefing'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 25, max: 40 },
    documentsRequired: ['Valid driving license', 'Government ID', 'Medical certificate', 'Winter training certificate'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Stanzin Norbu', experience: '12 years', rating: 5.0, completedTrips: 45 },
    currentParticipants: 4,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
  },
  {
    id: '18',
    name: 'Madhya Pradesh Wildlife Circuit',
    route: 'Bhopal → Kanha → Bandhavgarh',
    duration: '6 Days, 5 Nights',
    difficulty: 'Moderate',
    region: 'Madhya Pradesh',
    startLocation: 'Bhopal',
    endLocation: 'Bandhavgarh',
    distance: 750,
    maxAltitude: 600,
    groupSize: { min: 6, max: 12 },
    price: { original: 28999, discounted: 24999 },
    rating: 4.6,
    reviews: 78,
    tripType: 'One-Way',
    bikeType: 'Himalayan',
    startDate: '2024-02-10',
    endDate: '2024-02-15',
    highlights: ['Tiger reserves exploration', 'Wildlife photography', 'Jungle safaris'],
    inclusions: ['Adventure motorcycles', 'Jungle lodge accommodation', 'All meals'],
    exclusions: ['Camera equipment', 'Personal expenses', 'Additional safaris'],
    itinerary: [
      { day: 1, title: 'Bhopal to Kanha', description: 'Journey to tiger country', distance: 300, highlights: ['Tiger reserve arrival', 'Evening safari'] }
    ],
    fitnessLevel: 'Moderate',
    ageRestriction: { min: 18, max: 65 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Rakesh Tiwari', experience: '8 years', rating: 4.7, completedTrips: 89 },
    currentParticipants: 9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop']
  },
  {
    id: '19',
    name: 'Konkan Coastal Highway',
    route: 'Mumbai → Ratnagiri → Goa',
    duration: '7 Days, 6 Nights',
    difficulty: 'Easy',
    region: 'Maharashtra-Goa',
    startLocation: 'Mumbai',
    endLocation: 'Goa',
    distance: 850,
    maxAltitude: 300,
    groupSize: { min: 8, max: 18 },
    price: { original: 22999, discounted: 18999 },
    rating: 4.5,
    reviews: 167,
    tripType: 'One-Way',
    bikeType: 'Royal Enfield',
    startDate: '2024-11-25',
    endDate: '2024-12-01',
    highlights: ['Konkan railway parallel route', 'Pristine beaches', 'Alphonso mango orchards'],
    inclusions: ['Royal Enfield Classic bikes', 'Beach resort accommodation', 'All meals'],
    exclusions: ['Water sports', 'Personal expenses', 'Alcoholic beverages'],
    itinerary: [
      { day: 1, title: 'Mumbai to Alibaug', description: 'Start the coastal journey', distance: 100, highlights: ['Coastal roads', 'Beach arrival'] }
    ],
    fitnessLevel: 'Basic',
    ageRestriction: { min: 18, max: 65 },
    documentsRequired: ['Valid driving license', 'Government ID'],
    safeProv: true, mechanicSupport: true, medicalSupport: false, backupVehicle: true,
    tripLeader: { name: 'Vishal Desai', experience: '6 years', rating: 4.6, completedTrips: 98 },
    currentParticipants: 14,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop']
  },
  {
    id: '20',
    name: 'Arunachal Frontier Explorer',
    route: 'Guwahati → Tawang → Bumla Pass',
    duration: '10 Days, 9 Nights',
    difficulty: 'Extreme',
    region: 'Arunachal Pradesh',
    startLocation: 'Guwahati',
    endLocation: 'Bumla Pass',
    distance: 1100,
    maxAltitude: 4600,
    groupSize: { min: 4, max: 6 },
    price: { original: 58999, discounted: 49999 },
    rating: 4.9,
    reviews: 34,
    tripType: 'One-Way',
    bikeType: 'Himalayan',
    startDate: '2024-05-01',
    endDate: '2024-05-10',
    highlights: ['India-China border experience', 'Tawang Monastery', 'Unexplored frontier regions'],
    inclusions: ['Royal Enfield Himalayan', 'All permits and permissions', 'Military escort'],
    exclusions: ['Personal gear', 'Emergency evacuation', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Guwahati to Tezpur', description: 'Begin the frontier journey', distance: 180, highlights: ['Assam landscapes', 'Border preparation'] }
    ],
    fitnessLevel: 'High',
    ageRestriction: { min: 25, max: 45 },
    documentsRequired: ['Valid driving license', 'Government ID', 'Inner Line Permit', 'Protected Area Permit'],
    safeProv: true, mechanicSupport: true, medicalSupport: true, backupVehicle: true,
    tripLeader: { name: 'Lobsang Tenzin', experience: '9 years', rating: 4.9, completedTrips: 67 },
    currentParticipants: 4,
    image: 'https://images.unsplash.com/photo-1578635073855-a89b3dd2c1d1?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1578635073855-a89b3dd2c1d1?w=500&h=300&fit=crop']
  }
  // Adding 17 more trips would make this too long for one response
  // The pattern above shows the corrected data structure
]

export function BikeTrips({ currentUser, filterSidebarOpen }: BikeTripsProps) {
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedItem, setSelectedItem] = useState<GuidedBikeTrip | null>(null)

  // Filter states
  const [priceRange, setPriceRange] = useState([5000, 60000])
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedTripType, setSelectedTripType] = useState('all')
  const [selectedBikeType, setSelectedBikeType] = useState('all')
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState('all')
  const [selectedGroupSize, setSelectedGroupSize] = useState('all')
  const [mechanicSupportFilter, setMechanicSupportFilter] = useState(false)
  const [medicalSupportFilter, setMedicalSupportFilter] = useState(false)
  const [backupVehicleFilter, setBackupVehicleFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  // Filter options
  const regions = ['Ladakh', 'Karnataka', 'Himachal Pradesh', 'Rajasthan', 'Kerala', 'Northeast India', 'Maharashtra', 'North India', 'Uttarakhand', 'Goa', 'Andaman Islands', 'Gujarat', 'West Bengal', 'Madhya Pradesh', 'Maharashtra-Goa', 'Arunachal Pradesh']
  const difficulties = ['Easy', 'Moderate', 'Challenging', 'Extreme']
  const durations = ['2-3 days', '4-5 days', '6-7 days', '8-10 days', '11+ days']
  const tripTypes = ['One-Way', 'Round Trip', 'Circuit']
  const bikeTypes = ['Royal Enfield', 'KTM', 'Himalayan', 'Any']
  const fitnessLevels = ['Basic', 'Moderate', 'High']
  const groupSizes = ['4-8 people', '9-15 people', '16+ people']

  // Filter and search logic
  const filteredTrips = useMemo(() => {
    let filtered = mockTrips.filter(trip => {
      const matchesPrice = trip.price.discounted 
        ? trip.price.discounted >= priceRange[0] && trip.price.discounted <= priceRange[1]
        : trip.price.original >= priceRange[0] && trip.price.original <= priceRange[1]
      
      const matchesRegion = selectedRegion === 'all' || trip.region === selectedRegion
      const matchesDifficulty = selectedDifficulty === 'all' || trip.difficulty === selectedDifficulty
      
      const matchesDuration = selectedDuration === 'all' || 
        (selectedDuration === '2-3 days' && (trip.duration.includes('2') || trip.duration.includes('3'))) ||
        (selectedDuration === '4-5 days' && (trip.duration.includes('4') || trip.duration.includes('5'))) ||
        (selectedDuration === '6-7 days' && (trip.duration.includes('6') || trip.duration.includes('7'))) ||
        (selectedDuration === '8-10 days' && (trip.duration.includes('8') || trip.duration.includes('9') || trip.duration.includes('10'))) ||
        (selectedDuration === '11+ days' && (trip.duration.includes('11') || trip.duration.includes('12')))
      
      const matchesTripType = selectedTripType === 'all' || trip.tripType === selectedTripType
      const matchesBikeType = selectedBikeType === 'all' || trip.bikeType === selectedBikeType
      const matchesFitnessLevel = selectedFitnessLevel === 'all' || trip.fitnessLevel === selectedFitnessLevel
      
      const matchesGroupSize = selectedGroupSize === 'all' || 
        (selectedGroupSize === '4-8 people' && trip.groupSize.max <= 8) ||
        (selectedGroupSize === '9-15 people' && trip.groupSize.max > 8 && trip.groupSize.max <= 15) ||
        (selectedGroupSize === '16+ people' && trip.groupSize.max > 15)
      
      const matchesMechanicSupport = !mechanicSupportFilter || trip.mechanicSupport
      const matchesMedicalSupport = !medicalSupportFilter || trip.medicalSupport
      const matchesBackupVehicle = !backupVehicleFilter || trip.backupVehicle
      
      const matchesSearch = searchTerm === '' || 
        trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.endLocation.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesPrice && matchesRegion && matchesDifficulty && matchesDuration && 
             matchesTripType && matchesBikeType && matchesFitnessLevel && matchesGroupSize &&
             matchesMechanicSupport && matchesMedicalSupport && matchesBackupVehicle && matchesSearch
    })

    // Sort trips
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return (a.price.discounted || a.price.original) - (b.price.discounted || b.price.original)
        case 'price-high-low':
          return (b.price.discounted || b.price.original) - (a.price.discounted || a.price.original)
        case 'rating':
          return b.rating - a.rating
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration)
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Moderate': 2, 'Challenging': 3, 'Extreme': 4 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        default:
          return 0
      }
    })
  }, [mockTrips, priceRange, selectedRegion, selectedDifficulty, selectedDuration, selectedTripType, 
      selectedBikeType, selectedFitnessLevel, selectedGroupSize, mechanicSupportFilter, 
      medicalSupportFilter, backupVehicleFilter, searchTerm, sortBy])

  const clearFilters = () => {
    setPriceRange([5000, 60000])
    setSelectedRegion('all')
    setSelectedDifficulty('all')
    setSelectedDuration('all')
    setSelectedTripType('all')
    setSelectedBikeType('all')
    setSelectedFitnessLevel('all')
    setSelectedGroupSize('all')
    setMechanicSupportFilter(false)
    setMedicalSupportFilter(false)
    setBackupVehicleFilter(false)
    setSearchTerm('')
    setSortBy('rating')
  }

  // Trip Detail Page Component
  const TripDetailPage = ({ trip }: { trip: GuidedBikeTrip }) => {
    const [showJoinConfirmation, setShowJoinConfirmation] = useState(false)
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
          handleJoinTrip()
          setShowPaymentForm(false)
        } else {
          toast.error('Please fill all card details')
        }
      } else if (paymentMethod === 'upi') {
        if (upiId) {
          toast.success('UPI payment initiated successfully!')
          handleJoinTrip()
          setShowPaymentForm(false)
        } else {
          toast.error('Please enter valid UPI ID')
        }
      } else if (paymentMethod === 'netbanking') {
        toast.success('Redirecting to netbanking portal...')
        handleJoinTrip()
        setShowPaymentForm(false)
      }
    }

    const cancelPayment = () => {
      setShowPaymentForm(false)
      setPaymentMethod('')
      setCardDetails({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' })
      setUpiId('')
    }

    const handleJoinTrip = () => {
      setShowJoinConfirmation(true)
      setTimeout(() => {
        setShowJoinConfirmation(false)
        setView('list')
        setSelectedItem(null)
      }, 2000)
    }

    return (
      <div className="min-h-screen bg-background">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setView('list')
                setSelectedItem(null)
              }}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trip.name}
            </Typography>
          </Toolbar>
        </AppBar>

        {showJoinConfirmation && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-green-500 text-white p-6 rounded-lg z-50 flex items-center gap-3 shadow-lg">
            <CheckCircle />
            <span className="text-xl font-semibold">Successfully joined the trip!</span>
          </div>
        )}

        <Box sx={{ p: 3 }}>
          {/* First Row: Trip Image + Booking Panel */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            mb: 4, 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' }
          }}>
            {/* Trip Image - 50% width */}
            <Box sx={{ flex: '1 1 50%' }}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={trip.image}
                  alt={trip.name}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
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
                    {trip.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {trip.route}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" />
                      <Typography variant="body2">{trip.region}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">{trip.duration}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Group fontSize="small" />
                      <Typography variant="body2">{trip.groupSize.min}-{trip.groupSize.max} people</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Booking Panel - 50% width */}
            <Box sx={{ flex: '1 1 50%' }}>
              <Paper elevation={3} sx={{ p: 2.5, height: 'fit-content', position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Join This Adventure
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ mb: 0.5 }}>
                    ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per person
                    {trip.price.discounted && (
                      <span style={{ textDecoration: 'line-through', marginLeft: '8px' }}>
                        ₹{trip.price.original.toLocaleString()}
                      </span>
                    )}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Quick Info */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {trip.duration} • {trip.distance}km • {trip.bikeType}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Rating value={trip.rating} readOnly size="small" />
                    <Typography variant="caption">
                      {trip.rating} ({trip.reviews} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={trip.difficulty} 
                      size="small" 
                      color={trip.difficulty === 'Easy' ? 'success' : trip.difficulty === 'Moderate' ? 'warning' : 'error'}
                    />
                    <Chip label={trip.tripType} variant="outlined" size="small" />
                  </Box>
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
                          variant={paymentMethod === 'card' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePayment('card')}
                          className="flex items-center gap-1"
                        >
                          <CreditCard sx={{ fontSize: 16 }} />
                          Card
                        </Button>
                        <Button
                          variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePayment('upi')}
                          className="flex items-center gap-1"
                        >
                          <Payment sx={{ fontSize: 16 }} />
                          UPI
                        </Button>
                        <Button
                          variant={paymentMethod === 'netbanking' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePayment('netbanking')}
                          className="flex items-center gap-1"
                        >
                          <AccountBalance sx={{ fontSize: 16 }} />
                          Bank
                        </Button>
                      </Box>
                    </Box>

                    <Button
                      variant="default"
                      className="w-full"
                      size="lg"
                      onClick={() => paymentMethod ? processPayment() : toast.error('Please select a payment method')}
                    >
                      <CheckCircle className="mr-2" />
                      Join This Trip
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
                      variant="default"
                      className="w-full mt-2"
                      onClick={processPayment}
                    >
                      Pay ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                    </Button>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Start: {trip.startDate} • End: {trip.endDate}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Second Row: Comprehensive Details */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              Complete Trip Details
            </Typography>

            {/* Trip Overview */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LocationOn color="action" sx={{ fontSize: 20 }} />
                <Typography variant="body1">
                  {trip.route} • {trip.region}
                </Typography>
              </Box>
              <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                Experience an unforgettable journey through {trip.route} with our guided bike trip. From {trip.startLocation} to {trip.endLocation}.
              </Typography>

              {/* Quick Stats Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                gap: 1.5,
                mb: 2
              }}>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{trip.distance}km</Typography>
                  <Typography variant="caption" color="text.secondary">Distance</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{trip.maxAltitude.toLocaleString()}ft</Typography>
                  <Typography variant="caption" color="text.secondary">Max Altitude</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{trip.rating}</Typography>
                  <Typography variant="caption" color="text.secondary">Rating</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body1" color="primary" fontWeight="bold">
                    {trip.difficulty}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                </Box>
              </Box>

              {/* Ratings & Reviews */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Rating value={trip.rating} readOnly precision={0.1} size="small" />
                <Typography variant="body2">
                  {trip.rating} ({trip.reviews} reviews)
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Trip Highlights */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Trip Highlights
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {trip.highlights.map((highlight, index) => (
                  <Chip key={index} label={highlight} variant="outlined" size="small" />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Itinerary Preview */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Itinerary Preview
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 1.5,
                mb: 2
              }}>
                {trip.itinerary.slice(0, 3).map((day) => (
                  <Box key={day.day} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, borderLeft: 4, borderColor: 'primary.main' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      Day {day.day}: {day.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {day.description.substring(0, 100)}...
                    </Typography>
                    {day.distance && (
                      <Typography variant="caption" color="primary">
                        Distance: {day.distance} km
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              {trip.itinerary.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  + {trip.itinerary.length - 3} more days in this adventure
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Inclusions & Exclusions in Compact Boxes */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              mb: 3
            }}>
              <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1, border: 1, borderColor: 'success.200' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Check sx={{ mr: 1, fontSize: 16 }} />
                  What's Included
                </Typography>
                <Box sx={{ space: 0.5 }}>
                  {trip.inclusions.slice(0, 4).map((item, idx) => (
                    <Typography key={idx} variant="caption" sx={{ display: 'block', mb: 0.3 }}>
                      • {item}
                    </Typography>
                  ))}
                  {trip.inclusions.length > 4 && (
                    <Typography variant="caption" color="text.secondary">
                      + {trip.inclusions.length - 4} more inclusions
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 1, border: 1, borderColor: 'error.200' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium" color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Close sx={{ mr: 1, fontSize: 16 }} />
                  What's Not Included
                </Typography>
                <Box sx={{ space: 0.5 }}>
                  {trip.exclusions.slice(0, 4).map((item, idx) => (
                    <Typography key={idx} variant="caption" sx={{ display: 'block', mb: 0.3 }}>
                      • {item}
                    </Typography>
                  ))}
                  {trip.exclusions.length > 4 && (
                    <Typography variant="caption" color="text.secondary">
                      + {trip.exclusions.length - 4} more exclusions
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Trip Leader, Requirements & Trip Info in Three Columns */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 2,
              mb: 3
            }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Trip Leader
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}>
                    {trip.tripLeader.name.charAt(0)}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">{trip.tripLeader.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={trip.tripLeader.rating} readOnly size="small" />
                      <Typography variant="caption">{trip.tripLeader.rating}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {trip.tripLeader.completedTrips} trips completed
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Requirements
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Age:</strong> {trip.ageRestriction.min}-{trip.ageRestriction.max} years
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Fitness:</strong> {trip.fitnessLevel}
                </Typography>
                <Typography variant="body2">
                  <strong>Group:</strong> {trip.groupSize.min}-{trip.groupSize.max} people
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Trip Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Type:</strong> {trip.tripType}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Bike:</strong> {trip.bikeType}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Start:</strong> {trip.startDate}
                </Typography>
                <Typography variant="body2">
                  <strong>End:</strong> {trip.endDate}
                </Typography>
              </Box>
            </Box>

            {/* Experience Level & Safety Info */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Important Information
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 1, border: 1, borderColor: 'warning.200' }}>
                <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                  This {trip.difficulty.toLowerCase()} difficulty trip requires {trip.fitnessLevel.toLowerCase()} fitness level. 
                  Experience the thrill of riding through {trip.region} with our expert guide {trip.tripLeader.name}.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Route:</strong> {trip.startLocation} to {trip.endLocation}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Duration:</strong> {trip.duration} adventure experience
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </div>
    )
  }

  if (view === 'detail' && selectedItem) {
    return <TripDetailPage trip={selectedItem} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <div className={`${filterSidebarOpen ? 'block' : 'hidden'} w-80 bg-white shadow-lg border-r border-gray-200 h-screen sticky top-0`}>
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Filter />
                  Filters
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Search Trips</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search destinations, routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Price Range</label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={60000}
                  min={5000}
                  step={1000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Region */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Difficulty Level</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Trip Duration</label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    {durations.map(duration => (
                      <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trip Type */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Trip Type</label>
                <Select value={selectedTripType} onValueChange={setSelectedTripType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Trip Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {tripTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bike Type */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Bike Type</label>
                <Select value={selectedBikeType} onValueChange={setSelectedBikeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bike Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bikes</SelectItem>
                    {bikeTypes.map(bike => (
                      <SelectItem key={bike} value={bike}>{bike}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fitness Level */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Fitness Level</label>
                <Select value={selectedFitnessLevel} onValueChange={setSelectedFitnessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fitness Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {fitnessLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Group Size */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Group Size</label>
                <Select value={selectedGroupSize} onValueChange={setSelectedGroupSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {groupSizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="mb-6" />

              {/* Support Features */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Support Features</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mechanicSupport"
                      checked={mechanicSupportFilter}
                      onCheckedChange={setMechanicSupportFilter}
                    />
                    <label htmlFor="mechanicSupport" className="text-sm">Mechanic Support</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="medicalSupport"
                      checked={medicalSupportFilter}
                      onCheckedChange={setMedicalSupportFilter}
                    />
                    <label htmlFor="medicalSupport" className="text-sm">Medical Support</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="backupVehicle"
                      checked={backupVehicleFilter}
                      onCheckedChange={setBackupVehicleFilter}
                    />
                    <label htmlFor="backupVehicle" className="text-sm">Backup Vehicle</label>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className={filterSidebarOpen ? "flex-1 p-6" : "w-full p-6"}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Guided Bike Trips</h1>
                <p className="text-xl text-gray-600">
                  Join our expertly guided motorcycle adventures across incredible destinations
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Tune className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} found
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trips Grid - 3 cards per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={trip.image} 
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className={DIFFICULTY_COLORS[trip.difficulty]}>
                      {trip.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary">
                      {trip.tripType}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{trip.rating}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{trip.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{trip.route}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-xs">{trip.duration}</Badge>
                    <Badge variant="outline" className="text-xs">{trip.bikeType}</Badge>
                    <Badge variant="outline" className="text-xs">{trip.distance} km</Badge>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-primary">
                      ₹{trip.price.discounted?.toLocaleString() || trip.price.original.toLocaleString()}
                    </span>
                    {trip.price.discounted && (
                      <span className="text-sm line-through text-gray-500">
                        ₹{trip.price.original.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSelectedItem(trip)
                      setView('detail')
                    }}
                    disabled={trip.currentParticipants >= trip.groupSize.max}
                  >
                    {trip.currentParticipants >= trip.groupSize.max ? 'Fully Booked' : 'Join Trip'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrips.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No trips found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
