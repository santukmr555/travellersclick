import { useLocalStorage } from '@/hooks/useLocalStorage'
import { reviewService, Review, ReviewStats, ReviewFilters, ReviewReport } from '@/services/reviewService'

// Enhanced custom hook for reviews
export function useReviews(serviceId: string) {
  const [reviews, setReviews] = useLocalStorage<Review[]>(`reviews_${serviceId}`, [])
  const [reviewStats, setReviewStats] = useLocalStorage<ReviewStats>(`review_stats_${serviceId}`, {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    recentTrend: 'stable',
    responseRate: 0
  })
  const [insights, setInsights] = useLocalStorage<any>(`review_insights_${serviceId}`, null)

  const loadReviews = async (filters: ReviewFilters = { sortBy: 'newest' }) => {
    try {
      const serviceReviews = await reviewService.getServiceReviews(serviceId, filters)
      setReviews(serviceReviews)
      
      const stats = await reviewService.getReviewStats(serviceId)
      setReviewStats(stats)
    } catch (error) {
      console.error('Failed to load reviews:', error)
    }
  }

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'isModerated' | 'moderationStatus' | 'helpfulVotes' | 'reportCount' | 'sentiment' | 'tags'>) => {
    try {
      const newReview = await reviewService.addReview(reviewData)
      await loadReviews() // Reload to get updated stats
      return newReview
    } catch (error) {
      console.error('Failed to add review:', error)
      throw error
    }
  }

  const voteHelpful = async (reviewId: string, userId: string) => {
    try {
      const success = await reviewService.voteHelpful(reviewId, userId)
      if (success) {
        await loadReviews()
      }
      return success
    } catch (error) {
      console.error('Failed to vote helpful:', error)
      return false
    }
  }

  const reportReview = async (reviewId: string, reportedBy: string, reason: ReviewReport['reason'], description: string) => {
    try {
      return await reviewService.reportReview(reviewId, reportedBy, reason, description)
    } catch (error) {
      console.error('Failed to report review:', error)
      return false
    }
  }

  const loadInsights = async () => {
    try {
      const reviewInsights = await reviewService.generateReviewInsights(serviceId)
      setInsights(reviewInsights)
    } catch (error) {
      console.error('Failed to load insights:', error)
    }
  }

  const addProviderResponse = async (reviewId: string, providerId: string, providerName: string, responseText: string) => {
    try {
      const success = await reviewService.addProviderResponse(reviewId, providerId, providerName, responseText)
      if (success) {
        await loadReviews()
      }
      return success
    } catch (error) {
      console.error('Failed to add provider response:', error)
      return false
    }
  }

  return {
    reviews,
    reviewStats,
    insights,
    loadReviews,
    addReview,
    voteHelpful,
    reportReview,
    loadInsights,
    addProviderResponse
  }
}