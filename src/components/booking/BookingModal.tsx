import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Chip,
  LinearProgress
} from '@mui/material'
import {
  Close,
  CreditCard,
  AccountBalance,
  Payment,
  CheckCircle,
  Security,
  LocationOn,
  Schedule,
  Warning
} from '@mui/icons-material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { User } from '@/App'
import { toast } from 'sonner'
import { paymentService, PaymentIntent, Transaction } from '@/services/paymentService'
import { availabilityService } from '@/services/availabilityService'

interface BookingModalProps {
  open: boolean
  onClose: () => void
  bike: any
  currentUser: User | null
}

interface BookingDetails {
  startDateTime: Dayjs | null
  endDateTime: Dayjs | null
  rentType: 'hours' | 'days' | 'weeks' | 'months'
  totalAmount: number
  securityDeposit: number
  isAvailable: boolean
  availabilityChecked: boolean
}

interface PaymentState {
  paymentIntent: PaymentIntent | null
  processing: boolean
  completed: boolean
  transactionId: string | null
}

const steps = ['Booking Details', 'Availability Check', 'Payment', 'Confirmation']

export function BookingModal({ open, onClose, bike, currentUser }: BookingModalProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    startDateTime: dayjs().add(1, 'hour'),
    endDateTime: dayjs().add(1, 'day'),
    rentType: 'days',
    totalAmount: 0,
    securityDeposit: bike?.safetyDeposit || 0,
    isAvailable: false,
    availabilityChecked: false
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
  const [paymentState, setPaymentState] = useState<PaymentState>({
    paymentIntent: null,
    processing: false,
    completed: false,
    transactionId: null
  })
  const [availabilityStatus, setAvailabilityStatus] = useState<string>('')

  if (!bike || !currentUser) return null

  // Enhanced amount calculation with dynamic pricing
  const calculateAmount = () => {
    if (!bookingDetails.startDateTime || !bookingDetails.endDateTime) return 0

    const start = bookingDetails.startDateTime
    const end = bookingDetails.endDateTime
    
    return paymentService.calculateBookingCost(
      start.toISOString(),
      end.toISOString(),
      bookingDetails.rentType,
      bike.pricePerDay // Assuming daily rate as base
    )
  }

  // Check real-time availability
  const checkAvailability = async () => {
    if (!bookingDetails.startDateTime || !bookingDetails.endDateTime) {
      setAvailabilityStatus('Please select dates')
      return false
    }

    setLoading(true)
    setAvailabilityStatus('Checking availability...')

    try {
      const isAvailable = await availabilityService.checkAvailability(
        bike.id,
        bookingDetails.startDateTime.toISOString(),
        bookingDetails.endDateTime.toISOString()
      )

      if (isAvailable) {
        setAvailabilityStatus('✓ Available for selected dates')
        setBookingDetails(prev => ({ ...prev, isAvailable: true, availabilityChecked: true }))
        return true
      } else {
        setAvailabilityStatus('✗ Not available for selected dates')
        setBookingDetails(prev => ({ ...prev, isAvailable: false, availabilityChecked: true }))
        return false
      }
    } catch (error) {
      setAvailabilityStatus('Error checking availability')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Create payment intent
  const createPaymentIntent = async () => {
    if (!currentUser) return null

    try {
      const totalAmount = calculateAmount() + bookingDetails.securityDeposit
      
      const paymentIntent = await paymentService.createPaymentIntent(
        totalAmount,
        'inr',
        {
          bookingId: `booking_${Date.now()}`,
          serviceId: bike.id,
          serviceType: 'bike',
          userId: currentUser.id
        }
      )

      setPaymentState(prev => ({ ...prev, paymentIntent }))
      return paymentIntent
    } catch (error) {
      console.error('Failed to create payment intent:', error)
      toast.error('Failed to initialize payment')
      return null
    }
  }

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate booking details
      if (!bookingDetails.startDateTime || !bookingDetails.endDateTime) {
        toast.error('Please select start and end times')
        return
      }
      if (bookingDetails.endDateTime.isBefore(bookingDetails.startDateTime)) {
        toast.error('End time must be after start time')
        return
      }
      const amount = calculateAmount()
      setBookingDetails(prev => ({ ...prev, totalAmount: amount }))
    }

    if (activeStep === 1) {
      // Check availability
      const available = await checkAvailability()
      if (!available) {
        toast.error('Service not available for selected dates')
        return
      }
    }
    
    if (activeStep === 2) {
      // Validate payment details and create payment intent
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
          toast.error('Please select bank account')
          return
        }
      }

      // Create payment intent
      const intent = await createPaymentIntent()
      if (!intent) return
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleConfirmBooking = async () => {
    if (!paymentState.paymentIntent || !currentUser) return

    setPaymentState(prev => ({ ...prev, processing: true }))
    setLoading(true)

    try {
      // Process payment
      const paymentResult = await paymentService.processPayment(
        paymentState.paymentIntent.id,
        paymentMethod,
        paymentDetails
      )

      if (paymentResult.success && paymentResult.transactionId) {
        // Create booking record
        const bookingId = await availabilityService.createBooking({
          serviceId: bike.id,
          userId: currentUser.id,
          status: 'confirmed',
          startDate: bookingDetails.startDateTime!.toISOString(),
          endDate: bookingDetails.endDateTime!.toISOString()
        })

        setPaymentState(prev => ({
          ...prev,
          completed: true,
          transactionId: paymentResult.transactionId!
        }))

        toast.success(`🎉 Booking confirmed! Booking ID: ${bookingId}`)
        
        // Auto-close after success
        setTimeout(() => {
          onClose()
          setActiveStep(0) // Reset for next use
        }, 3000)
      } else {
        toast.error(paymentResult.error || 'Payment failed')
        setActiveStep(2) // Go back to payment step
      }
    } catch (error) {
      console.error('Booking failed:', error)
      toast.error('Booking failed. Please try again.')
      setActiveStep(2) // Go back to payment step
    } finally {
      setPaymentState(prev => ({ ...prev, processing: false }))
      setLoading(false)
    }
  }

  const renderBookingDetails = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            {bike.propertyType ? 'Property Details' : 'Vehicle Details'}
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary={bike.propertyType ? 'Property' : 'Vehicle'} 
                secondary={bike.propertyType 
                  ? `${bike.name} (${bike.propertyType})` 
                  : `${bike.brand} ${bike.model} (${bike.year})`
                } 
              />
            </ListItem>
            {bike.fuelType && (
              <ListItem>
                <ListItemText 
                  primary="Fuel Type" 
                  secondary={bike.fuelType.toUpperCase()} 
                />
              </ListItem>
            )}
            {bike.transmission && (
              <ListItem>
                <ListItemText 
                  primary="Transmission" 
                  secondary={bike.transmission} 
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemText 
                primary={bike.propertyType ? 'Location' : 'Pickup Location'} 
                secondary={bike.location || bike.pickupLocation || bike.address} 
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Rental Period
          </Typography>
          <Box sx={{ mb: 3 }}>
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
                <MenuItem value="hours">Hourly</MenuItem>
                <MenuItem value="days">Daily</MenuItem>
                <MenuItem value="weeks">Weekly</MenuItem>
                <MenuItem value="months">Monthly</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Date & Time"
                value={bookingDetails.startDateTime}
                onChange={(newValue) => setBookingDetails(prev => ({ 
                  ...prev, 
                  startDateTime: newValue 
                }))}
                slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
                minDateTime={dayjs()}
              />
              <DateTimePicker
                label="End Date & Time"
                value={bookingDetails.endDateTime}
                onChange={(newValue) => setBookingDetails(prev => ({ 
                  ...prev, 
                  endDateTime: newValue 
                }))}
                slotProps={{ textField: { fullWidth: true } }}
                minDateTime={bookingDetails.startDateTime || dayjs()}
              />
            </LocalizationProvider>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pricing Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Rental Amount:</Typography>
                <Typography>₹{calculateAmount()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Security Deposit:</Typography>
                <Typography>₹{bike.safetyDeposit}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary">
                  ₹{calculateAmount() + bike.safetyDeposit}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )

  const renderAvailabilityCheck = () => (
    <>
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Schedule />
        Availability Check
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Selected Booking Period
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">From</Typography>
              <Typography variant="body1">
                {bookingDetails.startDateTime?.format('DD MMM YYYY, hh:mm A')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">To</Typography>
              <Typography variant="body1">
                {bookingDetails.endDateTime?.format('DD MMM YYYY, hh:mm A')}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Chip
                icon={bookingDetails.isAvailable ? <CheckCircle /> : <Warning />}
                label={availabilityStatus}
                color={bookingDetails.isAvailable ? 'success' : 'error'}
                variant={bookingDetails.availabilityChecked ? 'filled' : 'outlined'}
              />
            )}
          </Box>

          {!bookingDetails.availabilityChecked && (
            <Button
              variant="contained"
              onClick={checkAvailability}
              disabled={loading}
              sx={{ width: '100%' }}
            >
              {loading ? 'Checking...' : 'Check Availability'}
            </Button>
          )}

          {bookingDetails.availabilityChecked && !bookingDetails.isAvailable && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This vehicle is not available for your selected dates. Please try different dates or choose another vehicle.
            </Alert>
          )}
        </CardContent>
      </Card>

      {bookingDetails.isAvailable && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Security />
              Booking Protection
            </Typography>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              Your booking is protected by our comprehensive insurance policy
            </Alert>
            
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Free Cancellation" 
                  secondary="Cancel up to 2 hours before pickup for full refund" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Vehicle Protection" 
                  secondary="Comprehensive insurance coverage included" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="24/7 Support" 
                  secondary="Round-the-clock customer support available" 
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}
    </Box>

    <Box>
      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
          startIcon={<CreditCard />}
          onClick={() => setPaymentMethod('card')}
        >
          Credit/Debit Card
        </Button>
        <Button
          variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
          startIcon={<Payment />}
          onClick={() => setPaymentMethod('upi')}
        >
          UPI
        </Button>
        <Button
          variant={paymentMethod === 'netbanking' ? 'contained' : 'outlined'}
          startIcon={<AccountBalance />}
          onClick={() => setPaymentMethod('netbanking')}
        >
          Net Banking
        </Button>
      </Box>

      {paymentMethod === 'card' && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails(prev => ({ 
                ...prev, 
                cardNumber: e.target.value 
              }))}
              placeholder="1234 5678 9012 3456"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              value={paymentDetails.expiryDate}
              onChange={(e) => setPaymentDetails(prev => ({ 
                ...prev, 
                expiryDate: e.target.value 
              }))}
              placeholder="MM/YY"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              value={paymentDetails.cvv}
              onChange={(e) => setPaymentDetails(prev => ({ 
                ...prev, 
                cvv: e.target.value 
              }))}
              placeholder="123"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={paymentDetails.cardHolder}
              onChange={(e) => setPaymentDetails(prev => ({ 
                ...prev, 
                cardHolder: e.target.value 
              }))}
            />
          </Grid>
        </Grid>
      )}

      {paymentMethod === 'upi' && (
        <TextField
          fullWidth
          label="UPI ID"
          value={paymentDetails.upiId}
          onChange={(e) => setPaymentDetails(prev => ({ 
            ...prev, 
            upiId: e.target.value 
          }))}
          placeholder="yourname@upi"
        />
      )}

      {paymentMethod === 'netbanking' && (
        <FormControl fullWidth>
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
            <MenuItem value="pnb">Punjab National Bank</MenuItem>
          </Select>
        </FormControl>
      )}

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Rental Amount:</Typography>
            <Typography>₹{bookingDetails.totalAmount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Security Deposit:</Typography>
            <Typography>₹{bookingDetails.securityDeposit}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total to Pay:</Typography>
            <Typography variant="h6" color="primary">
              ₹{bookingDetails.totalAmount + bookingDetails.securityDeposit}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
    </>
  )

  const renderConfirmation = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {paymentState.processing ? (
        <Box>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Processing your payment...
          </Typography>
          <Typography color="text.secondary">
            Please wait while we confirm your booking. Do not close this window.
          </Typography>
          <LinearProgress sx={{ mt: 2, mx: 4 }} />
        </Box>
      ) : paymentState.completed ? (
        <Box>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="success.main">
            Payment Successful! 🎉
          </Typography>
          <Typography color="text.secondary" paragraph>
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </Typography>
          
          {paymentState.transactionId && (
            <Card variant="outlined" sx={{ mt: 3, mx: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Transaction ID:</Typography>
                  <Typography fontWeight="bold">{paymentState.transactionId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Amount Paid:</Typography>
                  <Typography color="primary" fontWeight="bold">
                    ₹{bookingDetails.totalAmount + bookingDetails.securityDeposit}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Payment Method:</Typography>
                  <Typography>{paymentMethod.toUpperCase()}</Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          <Alert severity="info" sx={{ mt: 3, mx: 4 }}>
            <Typography variant="body2">
              <strong>Next Steps:</strong><br />
              1. Save your booking details<br />
              2. Contact the provider 2 hours before pickup<br />
              3. Bring valid ID and driving license<br />
              4. Enjoy your ride! 🏍️
            </Typography>
          </Alert>
        </Box>
      ) : (
        <Box>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Ready to confirm your booking
          </Typography>
          <Typography color="text.secondary" paragraph>
            Once you confirm, your payment will be processed and booking will be finalized.
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 3, mx: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Final Booking Summary
              </Typography>
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Vehicle:</Typography>
                  <Typography>{bike.brand} {bike.model}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Pickup:</Typography>
                  <Typography>{bookingDetails.startDateTime?.format('DD MMM, hh:mm A')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Return:</Typography>
                  <Typography>{bookingDetails.endDateTime?.format('DD MMM, hh:mm A')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Total Amount:</Typography>
                  <Typography color="primary" fontWeight="bold">
                    ₹{bookingDetails.totalAmount + bookingDetails.securityDeposit + Math.round((bookingDetails.totalAmount + bookingDetails.securityDeposit) * 0.02)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Alert severity="warning" sx={{ mb: 3, mx: 4 }}>
            Please ensure all details are correct before confirming the booking. 
            Changes after payment may incur additional charges.
          </Alert>
          
          <Button
            variant="contained"
            size="large"
            onClick={handleConfirmBooking}
            disabled={loading || paymentState.processing}
            sx={{ minWidth: 200 }}
          >
            {loading || paymentState.processing ? 'Processing...' : 
             `Confirm & Pay ₹${bookingDetails.totalAmount + bookingDetails.securityDeposit + Math.round((bookingDetails.totalAmount + bookingDetails.securityDeposit) * 0.02)}`}
          </Button>
        </Box>
      )}
    </Box>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Book {bike.brand} {bike.model}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && renderBookingDetails()}
        {activeStep === 1 && renderAvailabilityCheck()}
        {activeStep === 2 && renderPaymentDetails()}
        {activeStep === 3 && renderConfirmation()}

        {/* Terms and Conditions */}
        {activeStep < 3 && !paymentState.completed && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Terms & Conditions
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" paragraph>
                <strong>Cancellation Policy:</strong><br />
                • Free cancellation up to 2 hours before pickup<br />
                • 50% refund if cancelled 2-24 hours before pickup<br />
                • No refund for no-shows or cancellations within 2 hours
              </Typography>
            </Alert>
            
            <Typography variant="body2" paragraph color="text.secondary">
              • Valid driving license and original ID proof required at pickup
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              • Fuel charges not included in rental cost
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              • Late return penalty: ₹1000 + one day additional rent
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              • Customer liable for service charges in case of damage
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              • GPS tracking enabled during rental period for security
            </Typography>
          </Box>
        )}
      </DialogContent>

      {activeStep < 3 && !paymentState.completed && (
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={loading || paymentState.processing}>
              Back
            </Button>
          )}
          {activeStep < 3 && (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={
                loading || 
                paymentState.processing ||
                (activeStep === 1 && !bookingDetails.isAvailable)
              }
            >
              {activeStep === 0 && 'Check Availability'}
              {activeStep === 1 && 'Proceed to Payment'}
              {activeStep === 2 && 'Review & Confirm'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}