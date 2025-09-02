import { useState, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import { 
  Favorite, 
  ChatBubble, 
  Share, 
  Add, 
  Search, 
  Filter, 
  Tune,
  ArrowBack,
  LocationOn,
  CalendarToday,
  Person,
  Visibility
} from '@mui/icons-material'
import { User } from '@/App'

interface TravelStoriesProps {
  currentUser: User | null
  filterSidebarOpen: boolean
}

interface Story {
  id: string
  author: string
  authorAvatar?: string
  title: string
  content: string
  fullContent: string
  location: string
  destination: string
  placeType: 'Hill Station' | 'Trekking' | 'Waterfall' | 'Pilgrim' | 'Beach' | 'Forest' | 'Valley'
  journeyType: 'Friends' | 'Solo' | 'Family' | 'Community'
  tags: string[]
  likes: number
  comments: number
  readTime: number
  createdAt: string
  image: string
  gallery: string[]
}

const mockStories: Story[] = [
  {
    id: '1',
    author: 'Amit Patel',
    title: 'Sunrise at Tiger Hill, Darjeeling',
    content: 'Woke up at 4 AM to catch the sunrise at Tiger Hill. The journey through winding mountain roads was absolutely magical...',
    fullContent: 'Woke up at 4 AM to catch the sunrise at Tiger Hill. The journey through winding mountain roads on my Royal Enfield was absolutely magical. As the first rays hit the Kanchenjunga peaks, I realized why this moment is worth every early morning struggle.\n\nThe ride to Tiger Hill in complete darkness was an adventure in itself. The cold mountain air, the sound of my bike echoing through the valleys, and the anticipation of witnessing one of nature\'s most spectacular shows kept me going.\n\nWhen the sun finally rose, painting the snow-capped peaks in golden hues, I understood why thousands of travelers make this pilgrimage. The silence of the mountains, broken only by the whispers of fellow travelers, created a moment of pure magic that I\'ll cherish forever.\n\nDarjeeling isn\'t just about tea gardens and toy trains - it\'s about these moments that connect you with nature and remind you why travel is so important for the soul.',
    location: 'Tiger Hill, Darjeeling',
    destination: 'Darjeeling',
    placeType: 'Hill Station',
    journeyType: 'Solo',
    tags: ['sunrise', 'mountains', 'royal-enfield', 'solo-travel', 'darjeeling'],
    likes: 234,
    comments: 18,
    readTime: 3,
    createdAt: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop']
  },
  {
    id: '2',
    author: 'Neha Sharma',
    title: 'Kerala Backwaters: A Family Campervan Adventure',
    content: 'Spent 5 days exploring Kerala backwaters in our rented campervan. From Alleppey to Kumrakom, every morning brought new landscapes...',
    fullContent: 'Spent 5 days exploring Kerala backwaters in our rented campervan with my family. From Alleppey to Kumrakom, every morning brought new landscapes and unforgettable moments.\n\nTraveling with kids in a campervan initially seemed challenging, but it turned out to be the best decision we made. The freedom to stop anywhere, cook our own meals, and sleep under the stars made this trip special for everyone.\n\nWatching my children\'s faces light up as we cruised through the narrow canals, seeing traditional Kerala life unfold along the banks, was priceless. The local fishermen would wave at us, and my daughter would wave back excitedly.\n\nCooking breakfast by the lake while watching fishermen start their day became our daily ritual. The kids loved collecting shells and playing on the houseboat decks while my wife and I enjoyed the peaceful mornings.\n\nKerala\'s backwaters taught us that the best family vacations aren\'t about luxury hotels - they\'re about spending quality time together in nature\'s embrace.',
    location: 'Kerala Backwaters',
    destination: 'Kerala',
    placeType: 'Waterfall',
    journeyType: 'Family',
    tags: ['kerala', 'campervan', 'backwaters', 'family-travel', 'nature'],
    likes: 189,
    comments: 24,
    readTime: 4,
    createdAt: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop']
  },
  {
    id: '3',
    author: 'Rajesh Kumar',
    title: 'Digital Nomad Life in Goa Beaches',
    content: 'Working from a beachside cafe in Arambol, Goa. Found the perfect nomad accommodation with high-speed wifi and a community of like-minded travelers...',
    fullContent: 'Working from a beachside cafe in Arambol, Goa has been a dream come true. Found the perfect nomad accommodation with high-speed wifi and a community of like-minded travelers. Who says you can\'t mix work with paradise?\n\nMy typical day starts with a morning swim in the Arabian Sea, followed by coffee at my favorite beachside workspace. The sound of waves provides the perfect background soundtrack for coding sessions.\n\nThe nomad community here is incredible - entrepreneurs, writers, developers, and artists from around the world, all united by the desire to work from paradise. Our evening discussions over fresh seafood and local feni create lasting friendships.\n\nBalancing work deadlines with beach volleyball games and sunset walks requires discipline, but the improved work-life balance and mental health benefits make it worthwhile.\n\nGoa isn\'t just a party destination - it\'s becoming a legitimate workspace for digital professionals who refuse to be tied to a traditional office.',
    location: 'Arambol Beach, Goa',
    destination: 'Goa',
    placeType: 'Beach',
    journeyType: 'Community',
    tags: ['digital-nomad', 'goa', 'work-travel', 'beach', 'community'],
    likes: 156,
    comments: 31,
    readTime: 5,
    createdAt: '2024-01-08',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop']
  },
  {
    id: '4',
    author: 'Priya Mehta',
    title: 'Spiritual Journey to Vaishno Devi',
    content: 'The 13-km trek to Vaishno Devi shrine was more than a pilgrimage - it was a journey of faith, endurance, and self-discovery...',
    fullContent: 'The 13-km trek to Vaishno Devi shrine was more than a pilgrimage - it was a journey of faith, endurance, and self-discovery. Starting at 3 AM with thousands of devotees, the atmosphere was electric with devotion.\n\nThe path winds through beautiful mountains, with every step feeling like a meditation. Fellow pilgrims became instant family, helping each other and sharing stories of their spiritual journeys.\n\nWhat struck me most was the diversity of people - from young children to elderly grandparents, everyone united in their faith and determination to reach the holy cave.\n\nThe final darshan inside the cave was overwhelming. After hours of trekking, standing before the three sacred pindis filled me with an indescribable sense of peace and gratitude.\n\nThe return journey felt lighter, not just physically but spiritually. This pilgrimage taught me that sometimes the journey is more important than the destination.',
    location: 'Vaishno Devi, Jammu',
    destination: 'Jammu',
    placeType: 'Pilgrim',
    journeyType: 'Family',
    tags: ['pilgrimage', 'vaishno-devi', 'spiritual', 'trekking', 'family'],
    likes: 298,
    comments: 42,
    readTime: 4,
    createdAt: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop']
  },
  {
    id: '5',
    author: 'Vikram Singh',
    title: 'Friendship Goals: Rishikesh Adventure',
    content: 'Four college friends reuniting after years for white water rafting and camping in Rishikesh. What started as a simple trip became a soul-searching adventure...',
    fullContent: 'Four college friends reuniting after years for white water rafting and camping in Rishikesh. What started as a simple trip became a soul-searching adventure that strengthened our bonds forever.\n\nAfter years of corporate life, we needed this break desperately. The moment we hit the Ganges rapids, all our stress melted away. The adrenaline rush of Grade III rapids reminded us why we used to be so adventurous in college.\n\nEvening campfires by the river brought back memories and created new ones. We talked about our dreams, failures, and hopes until dawn. The mountains listened to our laughter and witnessed our vulnerability.\n\nRishikesh isn\'t just the yoga capital of the world - it\'s where friendships get recharged and souls find peace. The combination of adventure sports and spiritual atmosphere creates the perfect environment for reconnection.\n\nThis trip proved that no matter how busy life gets, true friends always find their way back to each other.',
    location: 'Rishikesh, Uttarakhand',
    destination: 'Rishikesh',
    placeType: 'Valley',
    journeyType: 'Friends',
    tags: ['friends', 'adventure', 'rafting', 'camping', 'reunion'],
    likes: 167,
    comments: 28,
    readTime: 4,
    createdAt: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop']
  },
  {
    id: '6',
    author: 'Anjali Gupta',
    title: 'Solo Trek to Valley of Flowers',
    content: 'My first solo trek to the Valley of Flowers was terrifying and liberating at the same time. Walking through fields of alpine flowers felt like stepping into paradise...',
    fullContent: 'My first solo trek to the Valley of Flowers was terrifying and liberating at the same time. Walking through fields of alpine flowers felt like stepping into paradise, and doing it alone made it even more special.\n\nThe 17-km trek from Govindghat tested my physical and mental limits. Carrying my own backpack, navigating the trail markers, and trusting my instincts was empowering.\n\nWhen I finally reached the valley, the sight took my breath away. Thousands of flowers carpeting the meadows in every color imaginable - it was like nature\'s own art gallery.\n\nSitting alone among the flowers, with only the sound of wind and distant streams, I felt a profound connection with myself and nature. This solitude taught me things about my strength that I never knew existed.\n\nSolo travel, especially solo trekking, pushes you out of your comfort zone and into a space where you discover your true capabilities.',
    location: 'Valley of Flowers, Uttarakhand',
    destination: 'Uttarakhand',
    placeType: 'Trekking',
    journeyType: 'Solo',
    tags: ['solo-trek', 'flowers', 'hiking', 'nature', 'empowerment'],
    likes: 312,
    comments: 45,
    readTime: 5,
    createdAt: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop']
  },
  {
    id: '7',
    author: 'Rohit Sharma',
    title: 'Coorg Coffee Plantations: A Family Retreat',
    content: 'Escaping Bangalore\'s hustle for a weekend in Coorg\'s coffee estates with family. The misty hills and aromatic coffee gardens provided the perfect backdrop for family bonding...',
    fullContent: 'Escaping Bangalore\'s hustle for a weekend in Coorg\'s coffee estates with family. The misty hills and aromatic coffee gardens provided the perfect backdrop for family bonding and relaxation.\n\nStaying in a plantation homestay gave us authentic insights into coffee farming. My kids were fascinated by the entire process, from bean picking to roasting.\n\nMorning walks through the estate, breathing in the fresh mountain air and coffee aroma, became our favorite family activity. The plantation owner shared stories about generations of coffee cultivation.\n\nEvening bonfires with fresh coffee and local Kodava cuisine created memories we\'ll treasure forever. My parents, who rarely travel, were rejuvenated by the peaceful environment.\n\nCoorg proved that you don\'t need to travel far for a perfect family vacation - sometimes the best experiences are in your backyard.',
    location: 'Coorg, Karnataka',
    destination: 'Coorg',
    placeType: 'Hill Station',
    journeyType: 'Family',
    tags: ['coorg', 'coffee', 'family', 'plantation', 'weekend'],
    likes: 203,
    comments: 33,
    readTime: 4,
    createdAt: '2024-01-18',
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop']
  },
  {
    id: '8',
    author: 'Kavya Nair',
    title: 'Dudhsagar Falls: Nature\'s Power Display',
    content: 'Witnessing the magnificent Dudhsagar Falls during monsoon was a humbling experience. The 320-meter cascade in Goa\'s Western Ghats reminded me of nature\'s incredible power...',
    fullContent: 'Witnessing the magnificent Dudhsagar Falls during monsoon was a humbling experience. The 320-meter cascade in Goa\'s Western Ghats reminded me of nature\'s incredible power and beauty.\n\nThe trek through dense forest to reach the falls was an adventure itself. Slippery rocks, leeches, and muddy trails tested our determination, but every step was worth it.\n\nStanding at the base of the falls, feeling the mist on my face and hearing the thunderous roar of water, I felt incredibly small yet deeply connected to nature.\n\nThe railway track viewpoint offered a different perspective - watching the Konkan Railway train cross the bridge while the waterfall cascaded behind it was a photographer\'s dream.\n\nDudhsagar taught me that some of nature\'s best shows are seasonal, and timing your visit right can create unforgettable experiences.',
    location: 'Dudhsagar Falls, Goa',
    destination: 'Goa',
    placeType: 'Waterfall',
    journeyType: 'Friends',
    tags: ['waterfall', 'monsoon', 'trekking', 'nature', 'photography'],
    likes: 245,
    comments: 37,
    readTime: 3,
    createdAt: '2024-01-22',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop']
  },
  {
    id: '9',
    author: 'Arjun Reddy',
    title: 'Hampi: Walking Through History',
    content: 'Exploring the ruins of Vijayanagara Empire in Hampi felt like time travel. Every stone structure tells stories of a glorious past...',
    fullContent: 'Exploring the ruins of Vijayanagara Empire in Hampi felt like time travel. Every stone structure tells stories of a glorious past, and walking through this UNESCO World Heritage site was both educational and inspiring.\n\nThe Virupaksha Temple, still active after 1400 years, bridges the gap between ancient and modern India. Local priests shared fascinating stories about the temple\'s history and significance.\n\nClimbing Matanga Hill for sunrise revealed the vast expanse of ruins scattered across the landscape. The view of ancient temples and boulder formations against the golden sky was breathtaking.\n\nThe Hampi Bazaar, once a thriving marketplace, now stands as a testament to the city\'s former glory. Imagining merchants from different countries trading here centuries ago was surreal.\n\nHampi isn\'t just a tourist destination - it\'s a journey through India\'s rich heritage and architectural brilliance.',
    location: 'Hampi, Karnataka',
    destination: 'Hampi',
    placeType: 'Hill Station',
    journeyType: 'Solo',
    tags: ['hampi', 'history', 'heritage', 'ruins', 'culture'],
    likes: 189,
    comments: 29,
    readTime: 4,
    createdAt: '2024-01-25',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop']
  },
  {
    id: '10',
    author: 'Meera Joshi',
    title: 'Sundarbans: Mangrove Wilderness Adventure',
    content: 'A three-day boat safari through the Sundarbans mangrove forests was an encounter with one of the world\'s most unique ecosystems...',
    fullContent: 'A three-day boat safari through the Sundarbans mangrove forests was an encounter with one of the world\'s most unique ecosystems. This UNESCO World Heritage site exceeded all my expectations.\n\nNavigating through narrow channels surrounded by dense mangroves felt like exploring a different planet. The silence, broken only by bird calls and water lapping against our boat, was profound.\n\nSpotting a Royal Bengal Tiger from a safe distance on our second day was the highlight of the trip. The magnificent creature, perfectly adapted to this aquatic environment, reminded me why conservation is so crucial.\n\nThe local guides shared incredible knowledge about the delicate balance of this ecosystem. Learning about how communities coexist with nature here was inspiring.\n\nSundarbans taught me that some of Earth\'s most important wilderness areas are also the most fragile, deserving our respect and protection.',
    location: 'Sundarbans, West Bengal',
    destination: 'Sundarbans',
    placeType: 'Forest',
    journeyType: 'Solo',
    tags: ['sundarbans', 'wildlife', 'tiger', 'mangroves', 'conservation'],
    likes: 278,
    comments: 41,
    readTime: 5,
    createdAt: '2024-01-28',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop']
  },
  {
    id: '11',
    author: 'Karan Malhotra',
    title: 'Ranthambore: Tiger Safari with Friends',
    content: 'Our group\'s tiger safari in Ranthambore National Park was a dream come true. The anticipation, excitement, and final tiger sighting created memories for a lifetime...',
    fullContent: 'Our group\'s tiger safari in Ranthambore National Park was a dream come true. The anticipation, excitement, and final tiger sighting created memories that will last a lifetime.\n\nWaking up at 5 AM for the morning safari, all six friends were buzzing with excitement despite the early hour. The crisp morning air and the possibility of seeing the king of the jungle kept our spirits high.\n\nOur naturalist guide shared fascinating insights about tiger behavior and the park\'s conservation efforts. Every rustling bush and alarm call had us on edge, hoping for that magical encounter.\n\nWhen we finally spotted T-42, a majestic tigress, gracefully walking along the lake, the entire jeep fell silent. Watching her drink water and then disappear into the tall grass was surreal.\n\nRanthambore proved that wildlife experiences are best shared with close friends who understand your passion for nature.',
    location: 'Ranthambore, Rajasthan',
    destination: 'Ranthambore',
    placeType: 'Forest',
    journeyType: 'Friends',
    tags: ['tiger', 'safari', 'wildlife', 'friends', 'rajasthan'],
    likes: 198,
    comments: 35,
    readTime: 4,
    createdAt: '2024-02-01',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop']
  },
  {
    id: '12',
    author: 'Deepika Iyer',
    title: 'Munnar Tea Gardens: Family Holiday Bliss',
    content: 'Our family trip to Munnar\'s sprawling tea gardens was a perfect blend of relaxation and adventure. The rolling green hills provided an idyllic backdrop for family bonding...',
    fullContent: 'Our family trip to Munnar\'s sprawling tea gardens was a perfect blend of relaxation and adventure. The rolling green hills provided an idyllic backdrop for family bonding and created lasting memories for all generations.\n\nStaying in a tea estate bungalow allowed us to wake up to misty mornings and endless views of manicured tea bushes. My children were fascinated by the tea-picking process and insisted on trying it themselves.\n\nThe tea museum visit was educational for the kids and nostalgic for my parents, who remembered the British colonial era. Learning about tea processing from leaf to cup was enlightening.\n\nTop Station\'s panoramic views of the Western Ghats left everyone speechless. The cool mountain breeze and the sight of clouds floating below us felt magical.\n\nMunnar showed us that the best family vacations combine natural beauty with cultural learning, creating experiences that educate and inspire.',
    location: 'Munnar, Kerala',
    destination: 'Munnar',
    placeType: 'Hill Station',
    journeyType: 'Family',
    tags: ['munnar', 'tea-gardens', 'family', 'hills', 'kerala'],
    likes: 223,
    comments: 31,
    readTime: 4,
    createdAt: '2024-02-05',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop']
  },
  {
    id: '13',
    author: 'Siddharth Kapoor',
    title: 'Kedarnath: A Spiritual Solo Journey',
    content: 'The 16-km trek to Kedarnath temple was more than a pilgrimage - it was a journey of self-discovery and spiritual awakening...',
    fullContent: 'The 16-km trek to Kedarnath temple was more than a pilgrimage - it was a journey of self-discovery and spiritual awakening that changed my perspective on life forever.\n\nStarting from Gaurikund at dawn, each step upward felt like shedding worldly worries. The Mandakini River\'s constant companionship and the gradually changing landscape kept me motivated.\n\nMeeting fellow pilgrims from diverse backgrounds reminded me that faith transcends all barriers. Sharing food and stories with strangers who became friends made the journey meaningful.\n\nThe final approach to the temple, with its stunning backdrop of snow-capped peaks, was overwhelming. Standing before one of the 12 Jyotirlingas filled me with profound reverence.\n\nKedarnath taught me that pilgrimage isn\'t just about reaching a destination - it\'s about the transformation that happens within you during the journey.',
    location: 'Kedarnath, Uttarakhand',
    destination: 'Kedarnath',
    placeType: 'Pilgrim',
    journeyType: 'Solo',
    tags: ['kedarnath', 'pilgrimage', 'trekking', 'spiritual', 'himalaya'],
    likes: 267,
    comments: 48,
    readTime: 5,
    createdAt: '2024-02-08',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop']
  },
  {
    id: '14',
    author: 'Rashmi Chatterjee',
    title: 'Andaman Islands: Beach Paradise with Friends',
    content: 'Our group trip to the Andaman Islands was pure magic. Crystal clear waters, pristine beaches, and underwater adventures created the perfect tropical escape...',
    fullContent: 'Our group trip to the Andaman Islands was pure magic. Crystal clear waters, pristine beaches, and underwater adventures created the perfect tropical escape we all desperately needed.\n\nHavelock Island\'s Radhanagar Beach lived up to its reputation as one of Asia\'s best beaches. The sunset views with our entire group silhouetted against the golden sky became our profile pictures for months.\n\nScuba diving at Elephant Beach was a first for most of us. Discovering the vibrant coral reefs and colorful marine life underwater was like entering a different world.\n\nThe cellular jail visit at Port Blair was sobering, reminding us of the sacrifices made for our freedom. It added depth to what could have been just a beach vacation.\n\nAndaman proved that the best trips combine relaxation with adventure, education with entertainment, creating memories that satisfy both the body and soul.',
    location: 'Andaman Islands',
    destination: 'Andaman',
    placeType: 'Beach',
    journeyType: 'Friends',
    tags: ['andaman', 'beach', 'scuba-diving', 'friends', 'tropical'],
    likes: 312,
    comments: 52,
    readTime: 4,
    createdAt: '2024-02-12',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop']
  },
  {
    id: '15',
    author: 'Abhishek Gupta',
    title: 'Spiti Valley: High Desert Adventure',
    content: 'Driving through the high altitude desert of Spiti Valley was like visiting another planet. The barren beauty and Buddhist culture created an unforgettable experience...',
    fullContent: 'Driving through the high altitude desert of Spiti Valley was like visiting another planet. The barren beauty and Buddhist culture created an unforgettable experience that challenged both my driving skills and spiritual understanding.\n\nThe route from Manali through Rohtang and Kunzum Pass tested our vehicle and endurance. The landscape changed from lush green valleys to moonlike terrain in just a few hours.\n\nKey Monastery, perched dramatically on a hilltop, offered insights into Buddhist philosophy and local culture. The monks\' peaceful demeanor amid harsh conditions was inspiring.\n\nStaying in Kaza town and interacting with the local Spiti people revealed a lifestyle perfectly adapted to extreme conditions. Their hospitality in such a challenging environment was remarkable.\n\nSpiti Valley taught me that beauty isn\'t always green and lush - sometimes it\'s found in the stark, dramatic landscapes that challenge our perceptions.',
    location: 'Spiti Valley, Himachal Pradesh',
    destination: 'Spiti Valley',
    placeType: 'Valley',
    journeyType: 'Friends',
    tags: ['spiti', 'high-altitude', 'desert', 'buddhist', 'adventure'],
    likes: 289,
    comments: 43,
    readTime: 5,
    createdAt: '2024-02-15',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
  },
  {
    id: '16',
    author: 'Swati Thakur',
    title: 'Corbett National Park: Wildlife Photography Expedition',
    content: 'A solo photography trip to Jim Corbett National Park was every wildlife enthusiast\'s dream. The park\'s diverse ecosystem provided countless opportunities for stunning shots...',
    fullContent: 'A solo photography trip to Jim Corbett National Park was every wildlife enthusiast\'s dream. The park\'s diverse ecosystem provided countless opportunities for stunning wildlife shots and taught me patience like never before.\n\nWaking up before dawn for morning safaris became routine, but each outing brought different surprises. The park\'s rich biodiversity meant every corner could hide a photographic opportunity.\n\nCapturing a leopard in the early morning light was the highlight of my trip. The elusive cat posed for barely thirty seconds before disappearing into the thick undergrowth.\n\nThe elephant safari offered a different perspective, allowing closer access to wildlife. Photographing deer, peacocks, and various bird species from elephant-back created unique compositions.\n\nCorbett taught me that wildlife photography isn\'t just about getting the perfect shot - it\'s about understanding animal behavior and respecting their natural habitat.',
    location: 'Jim Corbett National Park, Uttarakhand',
    destination: 'Corbett',
    placeType: 'Forest',
    journeyType: 'Solo',
    tags: ['corbett', 'wildlife', 'photography', 'leopard', 'safari'],
    likes: 245,
    comments: 38,
    readTime: 4,
    createdAt: '2024-02-18',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop']
  },
  {
    id: '17',
    author: 'Manish Agarwal',
    title: 'Har Ki Pauri: Community Gathering in Haridwar',
    content: 'Joining the evening Ganga Aarti at Har Ki Pauri with a group of fellow travelers was a deeply moving spiritual experience...',
    fullContent: 'Joining the evening Ganga Aarti at Har Ki Pauri with a group of fellow travelers was a deeply moving spiritual experience that connected us not just with the divine, but with thousands of devotees from across India.\n\nOur travel community, bonded by shared love for spiritual destinations, had organized this trip to witness one of India\'s most sacred rituals. The collective energy was palpable.\n\nAs hundreds of diyas floated on the Ganges and sacred chants filled the air, individual identities dissolved into a collective consciousness. We were no longer strangers but part of something much larger.\n\nThe early morning dip in the holy Ganges, despite the cold February weather, felt purifying. The shared experience of facing the chill together strengthened our group bond.\n\nHaridwar showed us that spiritual experiences are often enhanced when shared with like-minded souls who understand the significance of the moment.',
    location: 'Har Ki Pauri, Haridwar',
    destination: 'Haridwar',
    placeType: 'Pilgrim',
    journeyType: 'Community',
    tags: ['haridwar', 'ganga-aarti', 'spiritual', 'community', 'pilgrimage'],
    likes: 201,
    comments: 34,
    readTime: 4,
    createdAt: '2024-02-20',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop']
  },
  {
    id: '18',
    author: 'Nandini Pillai',
    title: 'Athirappilly Falls: Kerala\'s Niagara',
    content: 'Visiting Athirappilly Falls during the monsoon was nature\'s most spectacular show. The 80-foot cascade surrounded by lush forest was breathtaking...',
    fullContent: 'Visiting Athirappilly Falls during the monsoon was nature\'s most spectacular show. The 80-foot cascade surrounded by lush forest was breathtaking and reminded me why Kerala is called God\'s Own Country.\n\nThe approach through dense Western Ghats forest was an adventure itself. The sound of rushing water grew stronger with each step, building anticipation for the main spectacle.\n\nStanding at multiple viewing points, each offered a different perspective of the falls. The mist created beautiful rainbows, while the thunderous sound of water crashing below was both exhilarating and humbling.\n\nThe area\'s rich biodiversity, with exotic birds and butterflies, made it feel like a natural wonderland. Local guides shared stories about the falls\' appearance in numerous Indian films.\n\nAthirappilly taught me that India\'s natural beauty rivals any international destination - sometimes the most stunning sights are right in our backyard.',
    location: 'Athirappilly Falls, Kerala',
    destination: 'Kerala',
    placeType: 'Waterfall',
    journeyType: 'Family',
    tags: ['athirappilly', 'waterfall', 'monsoon', 'kerala', 'nature'],
    likes: 234,
    comments: 29,
    readTime: 3,
    createdAt: '2024-02-22',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop']
  },
  {
    id: '19',
    author: 'Rahul Saxena',
    title: 'Leh-Ladakh: The Ultimate Bike Journey',
    content: 'Riding solo through the highest motorable roads in the world was the most challenging yet rewarding experience of my life...',
    fullContent: 'Riding solo through the highest motorable roads in the world was the most challenging yet rewarding experience of my life. Leh-Ladakh tested every limit I thought I had, and then some.\n\nThe journey from Manali via Rohtang and Tanglang La passes was grueling. Altitude sickness, oxygen depletion, and extreme weather conditions pushed both my bike and body to their limits.\n\nReaching Pangong Tso lake, with its impossible shades of blue against barren mountains, felt like arriving on another planet. The silence was so complete it was almost audible.\n\nInteracting with local Ladakhi people revealed a lifestyle perfectly adapted to one of Earth\'s harshest environments. Their warmth and hospitality in such isolation was remarkable.\n\nLeh-Ladakh isn\'t just a destination - it\'s a test of character, endurance, and appreciation for the raw power of nature.',
    location: 'Leh-Ladakh, Jammu & Kashmir',
    destination: 'Ladakh',
    placeType: 'Valley',
    journeyType: 'Solo',
    tags: ['ladakh', 'bike-trip', 'high-altitude', 'pangong', 'adventure'],
    likes: 345,
    comments: 67,
    readTime: 5,
    createdAt: '2024-02-25',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
  },
  {
    id: '20',
    author: 'Shreya Jain',
    title: 'Agumbe: Sunset Point and Rainforest Trek',
    content: 'The trek through Agumbe rainforest to the famous sunset point was a perfect blend of biodiversity exploration and scenic beauty...',
    fullContent: 'The trek through Agumbe rainforest to the famous sunset point was a perfect blend of biodiversity exploration and scenic beauty that showcased the Western Ghats\' incredible natural wealth.\n\nThe trail through dense rainforest was alive with sounds of exotic birds and rustling leaves. Our naturalist guide identified numerous medicinal plants and explained the ecosystem\'s delicate balance.\n\nReaching the sunset viewpoint after a moderate trek, the panoramic view of the Arabian Sea coastline stretched endlessly. The golden hour light transformed the landscape into a painter\'s canvas.\n\nAgumbe\'s reputation as the "Cherrapunji of Karnataka" became evident during our stay. The frequent rain showers and misty atmosphere created an almost mystical environment.\n\nThis trip reminded me that some of India\'s most beautiful experiences require effort to reach, but the reward is always worth the journey.',
    location: 'Agumbe, Karnataka',
    destination: 'Agumbe',
    placeType: 'Forest',
    journeyType: 'Friends',
    tags: ['agumbe', 'sunset', 'rainforest', 'western-ghats', 'trekking'],
    likes: 198,
    comments: 27,
    readTime: 4,
    createdAt: '2024-02-28',
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop']
  }
]

export function TravelStories({ currentUser, filterSidebarOpen }: TravelStoriesProps) {
  const [stories, setStories] = useLocalStorage<Story[]>('travel-stories', mockStories)
  const [likedStories, setLikedStories] = useLocalStorage<string[]>('liked-stories', [])
  
  // View states - similar to pilgrim tours
  const [view, setView] = useState<'list' | 'details'>('list')
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  
  // Filter states
  const [selectedDestination, setSelectedDestination] = useState('all')
  const [selectedPlaceType, setSelectedPlaceType] = useState('all')
  const [selectedJourneyType, setSelectedJourneyType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('recent')

  // Filter options
  const destinations = [...new Set(stories.map(story => story.destination))].sort()
  const placeTypes: Array<'Hill Station' | 'Trekking' | 'Waterfall' | 'Pilgrim' | 'Beach' | 'Forest' | 'Valley'> = ['Hill Station', 'Trekking', 'Waterfall', 'Pilgrim', 'Beach', 'Forest', 'Valley']
  const journeyTypes: Array<'Friends' | 'Solo' | 'Family' | 'Community'> = ['Friends', 'Solo', 'Family', 'Community']

  // Filter and search logic
  const filteredStories = useMemo(() => {
    let filtered = stories.filter(story => {
      const matchesDestination = selectedDestination === 'all' || story.destination === selectedDestination
      const matchesPlaceType = selectedPlaceType === 'all' || story.placeType === selectedPlaceType
      const matchesJourneyType = selectedJourneyType === 'all' || story.journeyType === selectedJourneyType
      
      const matchesSearch = searchTerm === '' || 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesDestination && matchesPlaceType && matchesJourneyType && matchesSearch
    })

    // Sort stories
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return b.likes - a.likes
        case 'readTime':
          return a.readTime - b.readTime
        default:
          return 0
      }
    })
  }, [stories, selectedDestination, selectedPlaceType, selectedJourneyType, searchTerm, sortBy])

  const clearFilters = () => {
    setSelectedDestination('all')
    setSelectedPlaceType('all')
    setSelectedJourneyType('all')
    setSearchTerm('')
    setSortBy('recent')
  }

  const handleLike = (storyId: string) => {
    if (!currentUser) return
    
    const safeLikedStories = likedStories || []
    const isLiked = safeLikedStories.includes(storyId)
    
    if (isLiked) {
      setLikedStories(prev => (prev || []).filter(id => id !== storyId))
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, likes: story.likes - 1 }
          : story
      ))
    } else {
      setLikedStories(prev => [...(prev || []), storyId])
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, likes: story.likes + 1 }
          : story
      ))
    }
  }

  const openStoryDetails = (story: Story) => {
    setSelectedStory(story)
    setView('details')
  }

  // Story Details Page Component
  const StoryDetailsPage = ({ story }: { story: Story }) => {
    return (
      <div className="min-h-screen bg-background">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setView('list')
                setSelectedStory(null)
              }}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {story.title}
            </Typography>
          </Toolbar>
        </AppBar>

        <div className="container mx-auto p-6 max-w-4xl">
          {/* Story Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={story.authorAvatar} />
                <AvatarFallback className="text-lg">
                  {story.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Person fontSize="small" />
                    <span className="font-medium">{story.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LocationOn fontSize="small" />
                    <span>{story.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarToday fontSize="small" />
                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Visibility fontSize="small" />
                    <span>{story.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                {story.placeType}
              </Badge>
              <Badge variant="secondary">
                {story.journeyType}
              </Badge>
            </div>
          </div>

          {/* Story Image */}
          <div className="h-96 rounded-lg overflow-hidden mb-8">
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Story Content */}
          <div className="prose max-w-none mb-8">
            {story.fullContent.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b">
            {story.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-sm">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleLike(story.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  currentUser && (likedStories || []).includes(story.id)
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-red-500'
                }`}
                disabled={!currentUser}
              >
                <Favorite 
                  className={`${currentUser && (likedStories || []).includes(story.id) ? 'fill-current' : ''}`} 
                />
                <span className="text-lg font-medium">{story.likes}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                <ChatBubble />
                <span className="text-lg font-medium">{story.comments}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors">
                <Share />
                <span className="text-lg font-medium">Share</span>
              </button>
            </div>

            {!currentUser && (
              <p className="text-gray-500">
                Sign in to like and comment
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show story details page if a story is selected
  if (view === 'details' && selectedStory) {
    return <StoryDetailsPage story={selectedStory} />
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
                <label className="text-sm font-medium mb-2 block">Search Stories</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search stories, destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Destination */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Destination</label>
                <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {destinations.map(destination => (
                      <SelectItem key={destination} value={destination}>{destination}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Place Type */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Place Type</label>
                <Select value={selectedPlaceType} onValueChange={setSelectedPlaceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Place Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Places</SelectItem>
                    {placeTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Journey Type */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Journey Type</label>
                <Select value={selectedJourneyType} onValueChange={setSelectedJourneyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Journey Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Journey Types</SelectItem>
                    {journeyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="mb-6" />

              {/* Sort Options */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="readTime">Reading Time</SelectItem>
                  </SelectContent>
                </Select>
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
                <h1 className="text-4xl font-bold mb-2">User Stories</h1>
                <p className="text-xl text-gray-600">
                  Discover amazing travel experiences shared by fellow travelers
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Tune className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                {currentUser && (
                  <Button>
                    <Add className="w-4 h-4 mr-2" />
                    Share Your Story
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
            </p>
          </div>

          {/* Stories Grid - 2 stories per row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStories.map(story => (
              <Card 
                key={story.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => openStoryDetails(story)}
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      {story.placeType}
                    </Badge>
                    <Badge variant="secondary">
                      {story.journeyType}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Favorite className="w-4 h-4 text-red-400 fill-current" />
                        <span className="text-sm font-medium">{story.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Visibility className="w-4 h-4" />
                        <span className="text-sm">{story.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={story.authorAvatar} />
                      <AvatarFallback className="text-xs">
                        {story.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{story.author}</p>
                      <p className="text-xs text-gray-500">
                        {story.location} • {new Date(story.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold mb-2 line-clamp-2">{story.title}</h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{story.content}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {story.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {story.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{story.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(story.id)
                        }}
                        className={`flex items-center space-x-1 transition-colors ${
                          currentUser && (likedStories || []).includes(story.id)
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        disabled={!currentUser}
                      >
                        <Favorite 
                          fontSize="small" 
                          className={currentUser && (likedStories || []).includes(story.id) ? 'fill-current' : ''} 
                        />
                        <span className="text-sm">{story.likes}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                        <ChatBubble fontSize="small" />
                        <span className="text-sm">{story.comments}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500 transition-colors">
                        <Share fontSize="small" />
                      </button>
                    </div>

                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openStoryDetails(story)
                      }}
                    >
                      Read Full Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No stories found</h3>
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