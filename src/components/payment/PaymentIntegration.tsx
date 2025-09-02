import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Grid,
  Divider
} from '@mui/material'
import {
  CreditCard,
  Payment,
  AccountBalance,
  Security,
  CheckCircle,
  Warning,
  Schedule
} from '@mui/icons-material'
import { paymentService, PaymentIntent, Transaction } from '@/services/paymentService'
import { toast } from 'sonner'

interface PaymentIntegrationProps {
  amount: number
  currency?: string
  metadata: {
    bookingId: string
    serviceId: string
    serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
    userId: string
  }
  onPaymentSuccess: (transactionId: string) => void
  onPaymentError: (error: string) => void
  disabled?: boolean
}

export function PaymentIntegration({
  amount,
  currency = 'inr',
  metadata,
  onPaymentSuccess,
  onPaymentError,
  disabled = false
}: PaymentIntegrationProps) {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0) // 0: setup, 1: processing, 2: success/error

  useEffect(() => {
    if (amount > 0) {
      initializePayment()
    }
  }, [amount, metadata])

  const initializePayment = async () => {
    try {
      setError(null)
      const intent = await paymentService.createPaymentIntent(amount, currency, metadata)
      setPaymentIntent(intent)
      setStep(0)
    } catch (error) {
      console.error('Failed to initialize payment:', error)
      setError('Failed to initialize payment')
    }
  }

  const processPayment = async (paymentMethod: 'card' | 'upi' | 'netbanking', paymentDetails: any) => {
    if (!paymentIntent) return

    setProcessing(true)
    setStep(1)
    setError(null)

    try {
      const result = await paymentService.processPayment(
        paymentIntent.id,
        paymentMethod,
        paymentDetails
      )

      if (result.success && result.transactionId) {
        setStep(2)
        onPaymentSuccess(result.transactionId)
        toast.success('Payment processed successfully!')
      } else {
        setError(result.error || 'Payment failed')
        onPaymentError(result.error || 'Payment failed')
        setStep(0) // Go back to setup
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed'
      setError(errorMessage)
      onPaymentError(errorMessage)
      setStep(0)
    } finally {
      setProcessing(false)
    }
  }

  const formatAmount = (amount: number) => {
    return paymentService.formatAmount(amount, currency.toUpperCase())
  }

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard />
              Payment Setup
            </Typography>
            <Typography color="text.secondary" paragraph>
              Ready to process payment for your booking
            </Typography>
            
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="h6" color="primary">
                      {formatAmount(amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {metadata.bookingId.slice(-8)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )

      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <LinearProgress sx={{ mb: 3 }} />
            <Payment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Processing Payment
            </Typography>
            <Typography color="text.secondary">
              Please wait while we process your payment of {formatAmount(amount)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              This may take a few moments...
            </Typography>
          </Box>
        )

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="success.main">
              Payment Successful! 🎉
            </Typography>
            <Typography color="text.secondary" paragraph>
              Your payment of {formatAmount(amount)} has been processed successfully.
            </Typography>
            
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>What's next?</strong><br />
                • You'll receive a booking confirmation via email<br />
                • Contact details will be shared for pickup coordination<br />
                • Present valid ID and license at pickup time
              </Typography>
            </Alert>
          </Box>
        )

      default:
        return null
    }
  }

  if (!paymentIntent && !error) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Initializing payment...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        {/* Payment Stepper */}
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={step} alternativeLabel>
            <Step>
              <StepLabel>Setup</StepLabel>
            </Step>
            <Step>
              <StepLabel>Processing</StepLabel>
            </Step>
            <Step>
              <StepLabel>Complete</StepLabel>
            </Step>
          </Stepper>
        </Box>

        {getStepContent()}

        {/* Security Notice */}
        {step < 2 && (
          <Card variant="outlined" sx={{ mt: 3, bgcolor: 'grey.50' }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Security fontSize="small" color="primary" />
                <Typography variant="subtitle2" color="primary">
                  Secure Payment Processing
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Your payment is protected by 256-bit SSL encryption and processed through 
                PCI DSS compliant payment gateways. We never store your payment information.
              </Typography>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}