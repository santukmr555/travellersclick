import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { User } from '@/App'
import { 
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material'
import {
  CloudUpload,
  PhotoCamera,
  Delete,
  Add,
  BusinessCenter,
  Person,
  Settings,
  Payment,
  Security,
  Notifications
} from '@mui/icons-material'
import { toast } from 'sonner'

interface ProfileSettingsProps {
  currentUser: User
}

interface ProviderProfile {
  // Business Information
  firmName: string
  businessType: string
  registrationNumber: string
  gstNumber: string
  panNumber: string
  establishedYear: string
  
  // Contact Information
  contactNumber: string
  alternateNumber: string
  whatsappNumber: string
  helpdeskNumber: string
  email: string
  
  // Address Information
  businessAddress: string
  city: string
  state: string
  pincode: string
  country: string
  
  // Online Presence
  website: string
  socialMediaLinks: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
  }
  
  // Business Details
  description: string
  specialties: string[]
  serviceAreas: string[]
  languages: string[]
  operatingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  
  // Service Settings
  minimumBookingDuration: string
  maximumBookingDuration: string
  advanceBookingDays: string
  cancellationPolicy: string
  
  // Payment & Pricing
  acceptedPaymentMethods: string[]
  securityDeposit: string
  lateFeePercentage: string
  
  // Notifications & Preferences
  emailNotifications: boolean
  smsNotifications: boolean
  whatsappNotifications: boolean
  instantBooking: boolean
  autoConfirmBookings: boolean
  
  // Profile Media
  profileImage: string
  businessLicense: string
  certifications: string[]
}

export function ProfileSettings({ currentUser }: ProfileSettingsProps) {
  const [profile, setProfile] = useLocalStorage<ProviderProfile>(`provider-profile-${currentUser.id}`, {
    // Business Information
    firmName: '',
    businessType: '',
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',
    establishedYear: '',
    
    // Contact Information
    contactNumber: '',
    alternateNumber: '',
    whatsappNumber: '',
    helpdeskNumber: '',
    email: currentUser.email,
    
    // Address Information
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // Online Presence
    website: '',
    socialMediaLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    
    // Business Details
    description: '',
    specialties: [],
    serviceAreas: [],
    languages: ['English'],
    operatingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    
    // Service Settings
    minimumBookingDuration: '1 day',
    maximumBookingDuration: '30 days',
    advanceBookingDays: '7',
    cancellationPolicy: 'Flexible',
    
    // Payment & Pricing
    acceptedPaymentMethods: ['Cash', 'UPI'],
    securityDeposit: '1000',
    lateFeePercentage: '10',
    
    // Notifications & Preferences
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    instantBooking: false,
    autoConfirmBookings: true,
    
    // Profile Media
    profileImage: '',
    businessLicense: '',
    certifications: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('business')
  const [newSpecialty, setNewSpecialty] = useState('')
  const [newServiceArea, setNewServiceArea] = useState('')
  const [newLanguage, setNewLanguage] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProviderProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedInputChange = (parentField: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof ProviderProfile] as any),
        [field]: value
      }
    }))
  }

  const handleArrayAdd = (field: keyof ProviderProfile, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setProfile(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }))
      setter('')
    }
  }

  const handleArrayRemove = (field: keyof ProviderProfile, index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }))
  }

  const tabs = [
    { id: 'business', label: 'Business Info', icon: BusinessCenter },
    { id: 'contact', label: 'Contact Details', icon: Person },
    { id: 'services', label: 'Service Settings', icon: Settings },
    { id: 'payment', label: 'Payment & Pricing', icon: Payment },
    { id: 'security', label: 'Security & Privacy', icon: Security },
    { id: 'notifications', label: 'Notifications', icon: Notifications }
  ]

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your service provider profile and business settings
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ p: 1, display: 'flex', gap: 1, overflowX: 'auto' }}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'contained' : 'text'}
                startIcon={<IconComponent />}
                onClick={() => setActiveTab(tab.id)}
                sx={{ 
                  minWidth: 'auto', 
                  whiteSpace: 'nowrap',
                  px: 2,
                  py: 1
                }}
              >
                {tab.label}
              </Button>
            )
          })}
        </Box>
      </Paper>

      <Box component="form" onSubmit={handleSave}>
        <Grid container spacing={3}>
          {/* Business Information Tab */}
          {activeTab === 'business' && (
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessCenter />
                    Business Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Firm/Business Name"
                        value={profile.firmName}
                        onChange={(e) => handleInputChange('firmName', e.target.value)}
                        placeholder="Enter your business name"
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Business Type</InputLabel>
                        <Select
                          value={profile.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          label="Business Type"
                        >
                          <MenuItem value="sole-proprietorship">Sole Proprietorship</MenuItem>
                          <MenuItem value="partnership">Partnership</MenuItem>
                          <MenuItem value="private-limited">Private Limited Company</MenuItem>
                          <MenuItem value="public-limited">Public Limited Company</MenuItem>
                          <MenuItem value="llp">Limited Liability Partnership</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Business Registration Number"
                        value={profile.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        placeholder="Enter registration number"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="GST Number"
                        value={profile.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        placeholder="Enter GST number"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        value={profile.panNumber}
                        onChange={(e) => handleInputChange('panNumber', e.target.value)}
                        placeholder="Enter PAN number"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Established Year"
                        type="number"
                        value={profile.establishedYear}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        placeholder="2020"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://your-website.com"
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Business Description"
                        value={profile.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your business and services..."
                        multiline
                        rows={4}
                        required
                      />
                    </Grid>

                    {/* Business Address */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, mt: 2 }}>Business Address</Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={profile.businessAddress}
                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                        placeholder="Enter complete street address"
                        multiline
                        rows={2}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="City"
                        value={profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="State"
                        value={profile.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="PIN Code"
                        value={profile.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="Enter PIN code"
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Contact Details Tab */}
          {activeTab === 'contact' && (
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    Contact Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Primary Contact Number"
                        value={profile.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        placeholder="Enter primary contact number"
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Alternate Contact Number"
                        value={profile.alternateNumber}
                        onChange={(e) => handleInputChange('alternateNumber', e.target.value)}
                        placeholder="Enter alternate contact number"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="WhatsApp Number"
                        value={profile.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        placeholder="Enter WhatsApp number"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Helpdesk Number"
                        value={profile.helpdeskNumber}
                        onChange={(e) => handleInputChange('helpdeskNumber', e.target.value)}
                        placeholder="Enter helpdesk number"
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={profile.email}
                        disabled
                        helperText="Email cannot be changed. Contact support if needed."
                      />
                    </Grid>

                    {/* Social Media Links */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, mt: 2 }}>Social Media Links</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Facebook Page"
                        value={profile.socialMediaLinks.facebook}
                        onChange={(e) => handleNestedInputChange('socialMediaLinks', 'facebook', e.target.value)}
                        placeholder="https://facebook.com/your-page"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Instagram Profile"
                        value={profile.socialMediaLinks.instagram}
                        onChange={(e) => handleNestedInputChange('socialMediaLinks', 'instagram', e.target.value)}
                        placeholder="https://instagram.com/your-profile"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Twitter Profile"
                        value={profile.socialMediaLinks.twitter}
                        onChange={(e) => handleNestedInputChange('socialMediaLinks', 'twitter', e.target.value)}
                        placeholder="https://twitter.com/your-profile"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="YouTube Channel"
                        value={profile.socialMediaLinks.youtube}
                        onChange={(e) => handleNestedInputChange('socialMediaLinks', 'youtube', e.target.value)}
                        placeholder="https://youtube.com/your-channel"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Service Settings Tab */}
          {activeTab === 'services' && (
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Settings />
                    Service Settings
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* Service Areas */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>Service Areas</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Add service area (e.g., Mumbai, Pune)"
                          value={newServiceArea}
                          onChange={(e) => setNewServiceArea(e.target.value)}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleArrayAdd('serviceAreas', newServiceArea, setNewServiceArea)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile.serviceAreas.map((area, index) => (
                          <Chip
                            key={index}
                            label={area}
                            onDelete={() => handleArrayRemove('serviceAreas', index)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* Specialties */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>Specialties</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Add specialty (e.g., Adventure Tours, Budget Travel)"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleArrayAdd('specialties', newSpecialty, setNewSpecialty)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile.specialties.map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
                            onDelete={() => handleArrayRemove('specialties', index)}
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* Languages */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>Languages Supported</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Add language (e.g., Hindi, English)"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleArrayAdd('languages', newLanguage, setNewLanguage)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile.languages.map((language, index) => (
                          <Chip
                            key={index}
                            label={language}
                            onDelete={() => handleArrayRemove('languages', index)}
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* Booking Settings */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Minimum Booking Duration</InputLabel>
                        <Select
                          value={profile.minimumBookingDuration}
                          onChange={(e) => handleInputChange('minimumBookingDuration', e.target.value)}
                          label="Minimum Booking Duration"
                        >
                          <MenuItem value="1 hour">1 Hour</MenuItem>
                          <MenuItem value="4 hours">4 Hours</MenuItem>
                          <MenuItem value="1 day">1 Day</MenuItem>
                          <MenuItem value="2 days">2 Days</MenuItem>
                          <MenuItem value="1 week">1 Week</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Maximum Booking Duration</InputLabel>
                        <Select
                          value={profile.maximumBookingDuration}
                          onChange={(e) => handleInputChange('maximumBookingDuration', e.target.value)}
                          label="Maximum Booking Duration"
                        >
                          <MenuItem value="7 days">7 Days</MenuItem>
                          <MenuItem value="15 days">15 Days</MenuItem>
                          <MenuItem value="30 days">30 Days</MenuItem>
                          <MenuItem value="90 days">90 Days</MenuItem>
                          <MenuItem value="1 year">1 Year</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Advance Booking Days"
                        type="number"
                        value={profile.advanceBookingDays}
                        onChange={(e) => handleInputChange('advanceBookingDays', e.target.value)}
                        placeholder="7"
                        helperText="How many days in advance can customers book?"
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <InputLabel>Cancellation Policy</InputLabel>
                        <Select
                          value={profile.cancellationPolicy}
                          onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                          label="Cancellation Policy"
                        >
                          <MenuItem value="Flexible">Flexible - Full refund 24 hrs before</MenuItem>
                          <MenuItem value="Moderate">Moderate - 50% refund 48 hrs before</MenuItem>
                          <MenuItem value="Strict">Strict - No refund</MenuItem>
                          <MenuItem value="Super Strict">Super Strict - No refund 30 days before</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Service Preferences */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, mt: 2 }}>Service Preferences</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.instantBooking}
                            onChange={(e) => handleInputChange('instantBooking', e.target.checked)}
                          />
                        }
                        label="Allow Instant Booking"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.autoConfirmBookings}
                            onChange={(e) => handleInputChange('autoConfirmBookings', e.target.checked)}
                          />
                        }
                        label="Auto-Confirm Bookings"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Payment & Pricing Tab */}
          {activeTab === 'payment' && (
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Payment />
                    Payment & Pricing Settings
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>Accepted Payment Methods</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'].map((method) => (
                          <FormControlLabel
                            key={method}
                            control={
                              <Switch
                                checked={profile.acceptedPaymentMethods.includes(method)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleInputChange('acceptedPaymentMethods', [...profile.acceptedPaymentMethods, method])
                                  } else {
                                    handleInputChange('acceptedPaymentMethods', profile.acceptedPaymentMethods.filter(m => m !== method))
                                  }
                                }}
                              />
                            }
                            label={method}
                          />
                        ))}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Security Deposit (₹)"
                        type="number"
                        value={profile.securityDeposit}
                        onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                        placeholder="1000"
                        helperText="Refundable security deposit amount"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Late Return Fee (%)"
                        type="number"
                        value={profile.lateFeePercentage}
                        onChange={(e) => handleInputChange('lateFeePercentage', e.target.value)}
                        placeholder="10"
                        helperText="Percentage of daily rate charged for late returns"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Notifications />
                    Notification Preferences
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.emailNotifications}
                            onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                          />
                        }
                        label="Email Notifications"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Receive booking updates via email
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.smsNotifications}
                            onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                          />
                        }
                        label="SMS Notifications"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Receive booking updates via SMS
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profile.whatsappNotifications}
                            onChange={(e) => handleInputChange('whatsappNotifications', e.target.checked)}
                          />
                        }
                        label="WhatsApp Notifications"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Receive booking updates via WhatsApp
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Save Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            disabled={isLoading} 
            variant="contained"
            size="large"
            sx={{ minWidth: 200 }}
            startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          >
            {isLoading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}