import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  Stack,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  ThumbUp,
  ThumbUpOutlined,
  Report,
  Verified,
  Close,
  Star,
  StarBorder,
  MoreVert,
  Reply,
  Flag,
  TrendingUp,
  TrendingDown,
  Remove,
  FilterList,
  Sort,
  PhotoCamera,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentVeryDissatisfied
} from '@mui/icons-material'
import { Review, ReviewStats, ReviewFilters, ReviewReport } from '@/services/reviewService'
import { useReviews } from '@/hooks/useReviews'
import { User } from '@/App'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { toast } from 'sonner'

dayjs.extend(relativeTime)

interface ReviewsModalProps {
  open: boolean
  onClose: () => void
  serviceId: string
  serviceName: string
  currentUser: User | null
}

export function ReviewsModal({ open, onClose, serviceId, serviceName, currentUser }: ReviewsModalProps) {
  const { reviews, reviewStats, loadReviews, addReview, voteHelpful, reportReview, loadInsights, insights } = useReviews(serviceId)
  const [showAddReview, setShowAddReview] = useState(false)
  const [filters, setFilters] = useState<ReviewFilters>({ sortBy: 'newest' })
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState<ReviewReport['reason']>('spam')
  const [reportDescription, setReportDescription] = useState('')
  const [showInsights, setShowInsights] = useState(false)

  // New review form state
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  })

  useEffect(() => {
    if (open) {
      loadReviewsWithFilters()
    }
  }, [open, filters])

  const loadReviewsWithFilters = async () => {
    setLoading(true)
    try {
      await loadReviews(filters)
      if (showInsights) {
        await loadInsights()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddReview = async () => {
    if (!currentUser) {
      toast.error('Please login to write a review')
      return
    }

    try {
      await addReview({
        userId: currentUser.id,
        userName: currentUser.name,
        serviceId,
        serviceType: 'bike',
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        isVerified: currentUser.isVerified
      })

      setNewReview({ rating: 5, title: '', comment: '' })
      setShowAddReview(false)
      toast.success('Review submitted successfully!')
      loadReviewsWithFilters()
    } catch (error) {
      console.error('Failed to add review:', error)
      toast.error('Failed to submit review')
    }
  }

  const handleVoteHelpful = async (reviewId: string) => {
    if (!currentUser) {
      toast.error('Please login to vote')
      return
    }

    const success = await voteHelpful(reviewId, currentUser.id)
    if (success) {
      toast.success('Thank you for your feedback!')
    } else {
      toast.info('You have already voted on this review')
    }
  }

  const handleReportReview = async () => {
    if (!currentUser || !selectedReviewId) return

    const success = await reportReview(selectedReviewId, currentUser.id, reportReason, reportDescription)
    if (success) {
      toast.success('Review reported successfully')
      setShowReportDialog(false)
      setReportDescription('')
    } else {
      toast.error('Failed to report review')
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success'
    if (rating >= 3.5) return 'warning'
    return 'error'
  }

  const formatDate = (date: Date) => {
    return dayjs(date).fromNow()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Reviews for {serviceName}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Enhanced Review Statistics */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color={getRatingColor(reviewStats.averageRating)}>
                  {reviewStats.averageRating.toFixed(1)}
                </Typography>
                <Rating value={reviewStats.averageRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {reviewStats.totalReviews} reviews
                </Typography>
                
                {/* Trend Indicator */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                  {reviewStats.recentTrend === 'improving' && <TrendingUp color="success" fontSize="small" />}
                  {reviewStats.recentTrend === 'declining' && <TrendingDown color="error" fontSize="small" />}
                  {reviewStats.recentTrend === 'stable' && <Remove color="action" fontSize="small" />}
                  <Typography variant="caption" color="text.secondary">
                    {reviewStats.recentTrend}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                {Object.entries(reviewStats.ratingDistribution)
                  .reverse()
                  .map(([rating, count]) => (
                    <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ width: 20 }}>
                        {rating}
                      </Typography>
                      <Star fontSize="small" color="action" />
                      <LinearProgress
                        variant="determinate"
                        value={reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0}
                        sx={{ flex: 1, height: 8 }}
                        color={getRatingColor(parseInt(rating))}
                      />
                      <Typography variant="body2" sx={{ width: 30 }}>
                        {count}
                      </Typography>
                    </Box>
                  ))}
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {Math.round(reviewStats.responseRate)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Response Rate
                </Typography>
              </Box>
            </Box>

            {/* Quick Insights */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                size="small"
                variant={showInsights ? 'contained' : 'outlined'}
                onClick={() => {
                  setShowInsights(!showInsights)
                  if (!showInsights) loadInsights()
                }}
              >
                AI Insights
              </Button>
              
              <Chip 
                size="small" 
                icon={<Verified />} 
                label={`${reviews.filter(r => r.isVerified).length} verified`}
                variant="outlined"
              />
            </Box>

            {showInsights && insights && (
              <Card variant="outlined" sx={{ mt: 2, bgcolor: 'background.default' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    AI-Generated Insights
                  </Typography>
                  
                  {insights.strengths?.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="success.main" fontWeight="bold">
                        Strengths: 
                      </Typography>
                      <Typography variant="caption">
                        {insights.strengths.join(', ')}
                      </Typography>
                    </Box>
                  )}

                  {insights.weaknesses?.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="warning.main" fontWeight="bold">
                        Areas for Improvement: 
                      </Typography>
                      <Typography variant="caption">
                        {insights.weaknesses.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Filter and Sort Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort by"
              onChange={(e) => {
                setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))
              }}
            >
              <MenuItem value="newest">Newest first</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
              <MenuItem value="highest">Highest rating</MenuItem>
              <MenuItem value="lowest">Lowest rating</MenuItem>
              <MenuItem value="helpful">Most helpful</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={filters.rating || ''}
              label="Rating"
              onChange={(e) => {
                setFilters(prev => ({ 
                  ...prev, 
                  rating: e.target.value ? parseInt(e.target.value) : undefined 
                }))
              }}
            >
              <MenuItem value="">All ratings</MenuItem>
              <MenuItem value="5">5 stars</MenuItem>
              <MenuItem value="4">4 stars</MenuItem>
              <MenuItem value="3">3 stars</MenuItem>
              <MenuItem value="2">2 stars</MenuItem>
              <MenuItem value="1">1 star</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sentiment</InputLabel>
            <Select
              value={filters.sentiment || ''}
              label="Sentiment"
              onChange={(e) => {
                setFilters(prev => ({ 
                  ...prev, 
                  sentiment: e.target.value as any || undefined 
                }))
              }}
            >
              <MenuItem value="">All sentiments</MenuItem>
              <MenuItem value="positive">Positive</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
              <MenuItem value="negative">Negative</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={filters.verified || false}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  verified: e.target.checked || undefined 
                }))}
                size="small"
              />
            }
            label="Verified only"
          />

          <FormControlLabel
            control={
              <Switch
                checked={filters.hasImages || false}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  hasImages: e.target.checked || undefined 
                }))}
                size="small"
              />
            }
            label="With photos"
          />

          {currentUser && (
            <Button
              variant="outlined"
              onClick={() => setShowAddReview(true)}
              sx={{ ml: 'auto' }}
            >
              Write a Review
            </Button>
          )}
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Add Review Form */}
        {showAddReview && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Write your review
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Overall rating
                </Typography>
                <Rating
                  value={newReview.rating}
                  onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value || 1 }))}
                  size="large"
                />
              </Box>

              <TextField
                fullWidth
                label="Review title"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your review"
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button onClick={() => setShowAddReview(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddReview}
                  disabled={!newReview.title.trim() || !newReview.comment.trim()}
                >
                  Submit Review
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Reviews List */}
        <Stack spacing={2}>
          {reviews.length === 0 ? (
            <Alert severity="info">
              No reviews yet. Be the first to review this service!
            </Alert>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar src={review.userAvatar} sx={{ width: 40, height: 40 }}>
                      {review.userName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle2">
                              {review.userName}
                            </Typography>
                            {review.isVerified && (
                              <Tooltip title="Verified customer">
                                <Verified fontSize="small" color="primary" />
                              </Tooltip>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              • {formatDate(review.createdAt)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary">
                              {review.rating}/5
                            </Typography>
                            
                            {/* Sentiment Indicator */}
                            {review.sentiment && (
                              <Tooltip title={`Sentiment: ${review.sentiment}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {review.sentiment === 'positive' && <SentimentSatisfied color="success" fontSize="small" />}
                                  {review.sentiment === 'neutral' && <SentimentNeutral color="action" fontSize="small" />}
                                  {review.sentiment === 'negative' && <SentimentVeryDissatisfied color="error" fontSize="small" />}
                                </Box>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>

                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget)
                            setSelectedReviewId(review.id)
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        {review.title}
                      </Typography>

                      <Typography variant="body2" paragraph>
                        {review.comment}
                      </Typography>

                      {/* Tags */}
                      {review.tags && review.tags.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          {review.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}

                      {/* Service Provider Response */}
                      {review.response && (
                        <Card variant="outlined" sx={{ mt: 2, bgcolor: 'action.hover' }}>
                          <CardContent sx={{ py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Reply fontSize="small" color="primary" />
                              <Typography variant="subtitle2" color="primary">
                                Response from {review.response.providerName}
                              </Typography>
                              {review.response.isVerified && (
                                <Verified fontSize="small" color="primary" />
                              )}
                            </Box>
                            <Typography variant="body2">
                              {review.response.response}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(review.response.createdAt)}
                            </Typography>
                          </CardContent>
                        </Card>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={review.helpfulVotes > 0 ? <ThumbUp /> : <ThumbUpOutlined />}
                          onClick={() => handleVoteHelpful(review.id)}
                          disabled={!currentUser}
                        >
                          Helpful ({review.helpfulVotes})
                        </Button>

                        <Button
                          size="small"
                          startIcon={<Report />}
                          onClick={() => {
                            if (!currentUser) {
                              toast.error('Please login to report reviews')
                              return
                            }
                            setSelectedReviewId(review.id)
                            setShowReportDialog(true)
                          }}
                          disabled={!currentUser}
                        >
                          Report
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>

        {/* Review Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            if (!currentUser) {
              toast.error('Please login to report reviews')
            } else {
              setShowReportDialog(true)
            }
            setAnchorEl(null)
          }}>
            <ListItemIcon>
              <Flag />
            </ListItemIcon>
            <ListItemText>Report Review</ListItemText>
          </MenuItem>
        </Menu>

        {/* Report Review Dialog */}
        <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Report Review</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Reason for reporting</InputLabel>
                <Select
                  value={reportReason}
                  label="Reason for reporting"
                  onChange={(e) => setReportReason(e.target.value as any)}
                >
                  <MenuItem value="spam">Spam or fake review</MenuItem>
                  <MenuItem value="inappropriate">Inappropriate content</MenuItem>
                  <MenuItem value="fake">Suspected fake review</MenuItem>
                  <MenuItem value="harassment">Harassment or abuse</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional details (optional)"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please provide more details about why you're reporting this review..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowReportDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleReportReview}>
              Submit Report
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}