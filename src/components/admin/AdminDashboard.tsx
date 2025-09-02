import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
  Paper
} from '@mui/material'
import {
  Analytics,
  Payment,
  RateReview,
  Warning,
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  Delete,
  Refresh,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material'
import { reviewService, Review, ReviewReport } from '@/services/reviewService'
import { paymentService, Transaction, RefundRequest } from '@/services/paymentService'
import { toast } from 'sonner'

interface AdminDashboardProps {
  currentUser: any
}

export function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [pendingReviews, setPendingReviews] = useState<Review[]>([])
  const [reviewReports, setReviewReports] = useState<ReviewReport[]>([])
  const [pendingRefunds, setPendingRefunds] = useState<RefundRequest[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  
  // Moderation dialog state
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject'>('approve')
  const [moderationReason, setModerationReason] = useState('')
  const [showModerationDialog, setShowModerationDialog] = useState(false)

  // Refund dialog state
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null)
  const [refundAction, setRefundAction] = useState<'approve' | 'reject'>('approve')
  const [refundComments, setRefundComments] = useState('')
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 0: // Overview
          await Promise.all([
            loadPendingReviews(),
            loadPendingRefunds(),
            loadRecentTransactions()
          ])
          break
        case 1: // Review Moderation
          await Promise.all([
            loadPendingReviews(),
            loadReviewReports()
          ])
          break
        case 2: // Payment Management
          await Promise.all([
            loadPendingRefunds(),
            loadRecentTransactions()
          ])
          break
      }
    } finally {
      setLoading(false)
    }
  }

  const loadPendingReviews = async () => {
    try {
      const reviews = await reviewService.getPendingReviews()
      setPendingReviews(reviews)
    } catch (error) {
      console.error('Error loading pending reviews:', error)
    }
  }

  const loadReviewReports = async () => {
    try {
      const reports = await reviewService.getReviewReports('pending')
      setReviewReports(reports)
    } catch (error) {
      console.error('Error loading review reports:', error)
    }
  }

  const loadPendingRefunds = async () => {
    try {
      const refunds = await paymentService.getPendingRefundRequests()
      setPendingRefunds(refunds)
    } catch (error) {
      console.error('Error loading pending refunds:', error)
    }
  }

  const loadRecentTransactions = async () => {
    try {
      // This would normally get all transactions for admin view
      // For now, we'll simulate some recent transactions
      setTransactions([])
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }

  const handleModerateReview = async () => {
    if (!selectedReview) return

    try {
      const success = await reviewService.moderateReview(
        selectedReview.id,
        moderationAction,
        moderationReason,
        currentUser?.id
      )

      if (success) {
        toast.success(`Review ${moderationAction}d successfully`)
        setShowModerationDialog(false)
        setModerationReason('')
        loadPendingReviews()
      } else {
        toast.error('Failed to moderate review')
      }
    } catch (error) {
      console.error('Error moderating review:', error)
      toast.error('Failed to moderate review')
    }
  }

  const handleProcessRefund = async () => {
    if (!selectedRefund) return

    try {
      const success = await paymentService.processRefund(
        selectedRefund.id,
        refundAction,
        refundComments
      )

      if (success) {
        toast.success(`Refund ${refundAction} successfully`)
        setShowRefundDialog(false)
        setRefundComments('')
        loadPendingRefunds()
      } else {
        toast.error('Failed to process refund')
      }
    } catch (error) {
      console.error('Error processing refund:', error)
      toast.error('Failed to process refund')
    }
  }

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <RateReview sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" color="primary">
              {pendingReviews.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Reviews
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Payment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" color="warning.main">
              {pendingRefunds.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Refunds
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Warning sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" color="error.main">
              {reviewReports.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review Reports
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {(pendingReviews.length === 0 && pendingRefunds.length === 0 && reviewReports.length === 0) ? (
              <Alert severity="success">
                All caught up! No pending admin actions required.
              </Alert>
            ) : (
              <Alert severity="warning">
                You have {pendingReviews.length + pendingRefunds.length + reviewReports.length} items requiring your attention.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderReviewModeration = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Review Moderation</Typography>
        <Button startIcon={<Refresh />} onClick={() => loadData()}>
          Refresh
        </Button>
      </Box>

      {/* Pending Reviews */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pending Reviews ({pendingReviews.length})
          </Typography>
          
          {pendingReviews.length === 0 ? (
            <Alert severity="success">No reviews pending moderation</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Review</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={review.userAvatar} sx={{ width: 32, height: 32 }}>
                            {review.userName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{review.userName}</Typography>
                            {review.isVerified && (
                              <Chip size="small" label="Verified" color="primary" />
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{review.serviceId}</TableCell>
                      <TableCell>
                        <Rating value={review.rating} size="small" readOnly />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          <strong>{review.title}</strong><br />
                          {review.comment.substring(0, 100)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedReview(review)
                            setShowModerationDialog(true)
                          }}
                        >
                          Moderate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Review Reports */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Review Reports ({reviewReports.length})
          </Typography>
          
          {reviewReports.length === 0 ? (
            <Alert severity="success">No reported reviews</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reporter</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.reportedBy}</TableCell>
                      <TableCell>
                        <Chip label={report.reason} size="small" color="warning" />
                      </TableCell>
                      <TableCell>
                        {report.description.substring(0, 100)}...
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button size="small">Review</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )

  const renderPaymentManagement = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Management
      </Typography>

      {/* Pending Refunds */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pending Refunds ({pendingRefunds.length})
          </Typography>
          
          {pendingRefunds.length === 0 ? (
            <Alert severity="success">No pending refunds</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingRefunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell>{refund.id.slice(-8)}</TableCell>
                      <TableCell>₹{refund.amount}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>{refund.requestedBy}</TableCell>
                      <TableCell>
                        {new Date(refund.requestedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedRefund(refund)
                            setShowRefundDialog(true)
                          }}
                        >
                          Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab 
            icon={<Analytics />} 
            label="Overview"
            iconPosition="start"
          />
          <Tab 
            icon={<Badge badgeContent={pendingReviews.length + reviewReports.length} color="error">
              <RateReview />
            </Badge>} 
            label="Review Moderation"
            iconPosition="start"
          />
          <Tab 
            icon={<Badge badgeContent={pendingRefunds.length} color="warning">
              <Payment />
            </Badge>} 
            label="Payment Management"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {activeTab === 0 && renderOverview()}
      {activeTab === 1 && renderReviewModeration()}
      {activeTab === 2 && renderPaymentManagement()}

      {/* Review Moderation Dialog */}
      <Dialog open={showModerationDialog} onClose={() => setShowModerationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Moderate Review</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ pt: 1 }}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar src={selectedReview.userAvatar}>
                      {selectedReview.userName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{selectedReview.userName}</Typography>
                      <Rating value={selectedReview.rating} size="small" readOnly />
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom>{selectedReview.title}</Typography>
                  <Typography variant="body2">{selectedReview.comment}</Typography>
                  
                  {selectedReview.sentiment && (
                    <Chip 
                      label={`Sentiment: ${selectedReview.sentiment}`}
                      size="small"
                      color={selectedReview.sentiment === 'positive' ? 'success' : 
                             selectedReview.sentiment === 'negative' ? 'error' : 'default'}
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </Card>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Action</InputLabel>
                <Select
                  value={moderationAction}
                  label="Action"
                  onChange={(e) => setModerationAction(e.target.value as any)}
                >
                  <MenuItem value="approve">Approve Review</MenuItem>
                  <MenuItem value="reject">Reject Review</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Moderation Reason"
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="Provide a reason for this moderation action..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModerationDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleModerateReview}
            color={moderationAction === 'approve' ? 'success' : 'error'}
          >
            {moderationAction === 'approve' ? 'Approve' : 'Reject'} Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Refund Processing Dialog */}
      <Dialog open={showRefundDialog} onClose={() => setShowRefundDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Refund Request</DialogTitle>
        <DialogContent>
          {selectedRefund && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Refund Request Details</strong><br />
                  Amount: ₹{selectedRefund.amount}<br />
                  Reason: {selectedRefund.reason}<br />
                  Requested: {new Date(selectedRefund.requestedAt).toLocaleDateString()}
                </Typography>
              </Alert>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Decision</InputLabel>
                <Select
                  value={refundAction}
                  label="Decision"
                  onChange={(e) => setRefundAction(e.target.value as any)}
                >
                  <MenuItem value="approve">Approve Refund</MenuItem>
                  <MenuItem value="reject">Reject Refund</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admin Comments"
                value={refundComments}
                onChange={(e) => setRefundComments(e.target.value)}
                placeholder="Provide comments for this refund decision..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRefundDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleProcessRefund}
            color={refundAction === 'approve' ? 'success' : 'error'}
          >
            {refundAction === 'approve' ? 'Approve' : 'Reject'} Refund
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}