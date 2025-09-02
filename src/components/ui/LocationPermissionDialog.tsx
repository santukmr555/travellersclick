import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material'
import {
  MyLocation,
  Close,
  Security,
  Speed,
  Explore,
  GpsFixed,
  Warning
} from '@mui/icons-material'
import { locationService } from '@/services/locationService'
import { toast } from 'sonner'

interface LocationPermissionDialogProps {
  open: boolean
  onClose: () => void
  onLocationGranted: (location: { latitude: number; longitude: number }) => void
  purpose?: 'filtering' | 'tracking' | 'navigation'
}

export function LocationPermissionDialog({
  open,
  onClose,
  onLocationGranted,
  purpose = 'filtering'
}: LocationPermissionDialogProps) {
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequestPermission = async () => {
    setRequesting(true)
    setError(null)

    try {
      const locationResult = await locationService.getCurrentLocation()
      onLocationGranted(locationResult.location)
      toast.success('Location access granted!')
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location'
      setError(errorMessage)
      
      if (errorMessage.includes('denied')) {
        toast.error('Location access denied. Please enable location in your browser settings.')
      } else {
        toast.error('Could not get your location. Please try again.')
      }
    } finally {
      setRequesting(false)
    }
  }

  const getBenefitsForPurpose = () => {
    switch (purpose) {
      case 'filtering':
        return [
          { icon: <Explore />, text: 'Find nearby rental services' },
          { icon: <Speed />, text: 'Sort results by distance' },
          { icon: <GpsFixed />, text: 'Get accurate travel time estimates' }
        ]
      case 'tracking':
        return [
          { icon: <Security />, text: 'Enable real-time vehicle tracking' },
          { icon: <GpsFixed />, text: 'Monitor trip progress' },
          { icon: <Speed />, text: 'Get location-based assistance' }
        ]
      case 'navigation':
        return [
          { icon: <Explore />, text: 'Turn-by-turn navigation' },
          { icon: <GpsFixed />, text: 'Real-time location updates' },
          { icon: <Speed />, text: 'Traffic-aware routing' }
        ]
      default:
        return [
          { icon: <Explore />, text: 'Enhanced location services' },
          { icon: <GpsFixed />, text: 'Better user experience' }
        ]
    }
  }

  const getTitle = () => {
    switch (purpose) {
      case 'filtering':
        return 'Find Services Near You'
      case 'tracking':
        return 'Enable Location Tracking'
      case 'navigation':
        return 'Enable Navigation'
      default:
        return 'Enable Location Access'
    }
  }

  const getDescription = () => {
    switch (purpose) {
      case 'filtering':
        return 'To show you the closest available vehicles and calculate accurate distances, we need access to your current location.'
      case 'tracking':
        return 'Location tracking helps ensure your safety during the rental and enables real-time assistance if needed.'
      case 'navigation':
        return 'We need location access to provide turn-by-turn navigation and real-time traffic updates.'
      default:
        return 'Location access helps us provide better and more relevant services.'
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{getTitle()}</Typography>
        <IconButton onClick={onClose} disabled={requesting}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <MyLocation sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          
          <Typography color="text.secondary" paragraph>
            {getDescription()}
          </Typography>

          <List sx={{ mb: 2 }}>
            {getBenefitsForPurpose().map((benefit, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {benefit.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={benefit.text}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>

          <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Privacy Protection:</strong><br />
              • Location data is only used for the requested service<br />
              • We don't store your location permanently<br />
              • You can disable location sharing anytime<br />
              • All data is encrypted and secure
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {error}
                {error.includes('denied') && (
                  <>
                    <br /><br />
                    <strong>To enable location access:</strong><br />
                    1. Click the location icon in your browser's address bar<br />
                    2. Select "Allow" for location access<br />
                    3. Refresh the page and try again
                  </>
                )}
              </Typography>
            </Alert>
          )}

          {requesting && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Requesting location access...
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={requesting}
        >
          Not Now
        </Button>
        <Button 
          variant="contained" 
          onClick={handleRequestPermission}
          startIcon={requesting ? <MyLocation /> : <MyLocation />}
          disabled={requesting}
          sx={{ minWidth: 180 }}
        >
          {requesting ? 'Requesting...' : 'Allow Location Access'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Transaction History Component for user dashboard
interface TransactionHistoryProps {
  userId: string
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [userId])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const userTransactions = await paymentService.getUserTransactions(userId)
      setTransactions(userTransactions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    } catch (error) {
      console.error('Error loading transactions:', error)
      toast.error('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  const getTransactionTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'payment':
        return <Payment color="primary" />
      case 'refund':
        return <Payment color="success" />
      case 'security_deposit':
        return <Security color="warning" />
      case 'security_refund':
        return <Security color="success" />
      default:
        return <Payment />
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'error'
      case 'cancelled':
        return 'default'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading transaction history...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>

        {transactions.length === 0 ? (
          <Alert severity="info">
            No transactions found. Your payment history will appear here once you make bookings.
          </Alert>
        ) : (
          <Box>
            {transactions.map((transaction) => (
              <Card key={transaction.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getTransactionTypeIcon(transaction.type)}
                      <Box>
                        <Typography variant="subtitle1">
                          {transaction.type === 'payment' ? 'Payment' : 'Refund'} - {transaction.gateway.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.paymentMethod.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color={transaction.type === 'refund' ? 'success.main' : 'primary'}>
                        {transaction.type === 'refund' ? '+' : ''}₹{Math.abs(transaction.amount)}
                      </Typography>
                      <Chip 
                        label={transaction.status}
                        size="small"
                        color={getStatusColor(transaction.status) as any}
                      />
                    </Box>
                  </Box>

                  {transaction.gatewayTransactionId && (
                    <Typography variant="caption" color="text.secondary">
                      Transaction ID: {transaction.gatewayTransactionId}
                    </Typography>
                  )}

                  {paymentService.isBookingRefundable(transaction) && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        This booking is eligible for refund until {new Date(transaction.refundDeadline!).toLocaleDateString()}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}