import { mockStorage } from './mockStorage'

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  serviceId: string
  rating: number
  comment: string
  createdAt: string
  isVerified: boolean
  helpfulVotes: number
  totalVotes: number
  response?: {
    message: string
    respondedAt: string
    responderName: string
  }
  images?: string[]
  tags: string[]
  isHighlighted: boolean
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  recentTrend: 'improving' | 'stable' | 'declining'
  responseRate: number
}

export interface ReviewFilters {
  rating?: number
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'
  hasImages?: boolean
  isVerified?: boolean
  withResponse?: boolean
  tags?: string[]
}

export interface ReviewReport {
  reviewId: string
  reportedBy: string
  reason: string
  description: string
  reportedAt: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
}

// Simplified review service without spark dependencies
class ReviewService {
  private reviewsKey = 'reviews'
  private reportsKey = 'review-reports'
  private moderationKey = 'review-moderation'

  async getServiceReviews(serviceId: string, filters: ReviewFilters = {}): Promise<Review[]> {
    try {
      const allReviews = await mockStorage.get<Review[]>(this.reviewsKey) || []
      let filteredReviews = allReviews.filter(review => review.serviceId === serviceId)

      // Apply filters
      if (filters.rating) {
        filteredReviews = filteredReviews.filter(review => review.rating === filters.rating)
      }

      if (filters.hasImages) {
        filteredReviews = filteredReviews.filter(review => review.images && review.images.length > 0)
      }

      if (filters.isVerified !== undefined) {
        filteredReviews = filteredReviews.filter(review => review.isVerified === filters.isVerified)
      }

      if (filters.withResponse !== undefined) {
        filteredReviews = filteredReviews.filter(review => filters.withResponse ? !!review.response : !review.response)
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredReviews = filteredReviews.filter(review => 
          filters.tags!.some(tag => review.tags.includes(tag))
        )
      }

      // Sort reviews
      switch (filters.sortBy) {
        case 'oldest':
          filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'rating_high':
          filteredReviews.sort((a, b) => b.rating - a.rating)
          break
        case 'rating_low':
          filteredReviews.sort((a, b) => a.rating - b.rating)
          break
        case 'helpful':
          filteredReviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes)
          break
        case 'newest':
        default:
          filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
      }

      return filteredReviews
    } catch (error) {
      console.error('Error fetching service reviews:', error)
      return []
    }
  }

  async addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulVotes' | 'totalVotes' | 'isHighlighted'>): Promise<Review> {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      helpfulVotes: 0,
      totalVotes: 0,
      isHighlighted: false
    }

    // Save review
    const allReviews = await mockStorage.get<Review[]>(this.reviewsKey) || []
    allReviews.push(newReview)
    await mockStorage.set(this.reviewsKey, allReviews)

    return newReview
  }

  async getReviewStats(serviceId: string): Promise<ReviewStats> {
    try {
      const reviews = await this.getServiceReviews(serviceId)
      
      if (reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          recentTrend: 'stable',
          responseRate: 0
        }
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1
        return dist
      }, {} as { [key: number]: number })

      // Ensure all rating levels are represented
      for (let i = 1; i <= 5; i++) {
        if (!ratingDistribution[i]) ratingDistribution[i] = 0
      }

      const reviewsWithResponse = reviews.filter(review => !!review.response).length
      const responseRate = reviewsWithResponse / reviews.length

      return {
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        recentTrend: 'stable', // Simplified - could be enhanced with trend analysis
        responseRate: Math.round(responseRate * 100) / 100
      }
    } catch (error) {
      console.error('Error calculating review stats:', error)
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recentTrend: 'stable',
        responseRate: 0
      }
    }
  }

  async voteHelpful(reviewId: string, userId: string, isHelpful: boolean): Promise<boolean> {
    try {
      const allReviews = await mockStorage.get<Review[]>(this.reviewsKey) || []
      const reviewIndex = allReviews.findIndex(r => r.id === reviewId)
      
      if (reviewIndex === -1) return false

      // Simple implementation without tracking individual votes
      if (isHelpful) {
        allReviews[reviewIndex].helpfulVotes += 1
      }
      allReviews[reviewIndex].totalVotes += 1

      await mockStorage.set(this.reviewsKey, allReviews)
      return true
    } catch (error) {
      console.error('Error voting on review:', error)
      return false
    }
  }

  // Mock implementations for other methods
  async reportReview(reviewId: string, reportData: Omit<ReviewReport, 'reportedAt' | 'status'>): Promise<boolean> {
    try {
      const allReports = await mockStorage.get<ReviewReport[]>(this.reportsKey) || []
      const newReport: ReviewReport = {
        ...reportData,
        reviewId,
        reportedAt: new Date().toISOString(),
        status: 'pending'
      }
      allReports.push(newReport)
      await mockStorage.set(this.reportsKey, allReports)
      return true
    } catch (error) {
      console.error('Error reporting review:', error)
      return false
    }
  }

  async respondToReview(reviewId: string, response: string, responderName: string): Promise<boolean> {
    try {
      const allReviews = await mockStorage.get<Review[]>(this.reviewsKey) || []
      const reviewIndex = allReviews.findIndex(r => r.id === reviewId)
      
      if (reviewIndex === -1) return false

      allReviews[reviewIndex].response = {
        message: response,
        respondedAt: new Date().toISOString(),
        responderName
      }

      await mockStorage.set(this.reviewsKey, allReviews)
      return true
    } catch (error) {
      console.error('Error responding to review:', error)
      return false
    }
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      const allReviews = await mockStorage.get<Review[]>(this.reviewsKey) || []
      const filteredReviews = allReviews.filter(r => r.id !== reviewId)
      await mockStorage.set(this.reviewsKey, filteredReviews)
      return true
    } catch (error) {
      console.error('Error deleting review:', error)
      return false
    }
  }

  async getReviewInsights(serviceId: string): Promise<any> {
    // Mock implementation
    return {
      commonKeywords: ['service', 'quality', 'experience'],
      sentimentBreakdown: { positive: 70, neutral: 20, negative: 10 },
      improvementSuggestions: ['Improve response time', 'Better communication']
    }
  }
}

export const reviewService = new ReviewService()