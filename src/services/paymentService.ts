import dayjs from 'dayjs'
import { mockStorage } from './mockStorage'

/**
 * Enhanced Payment Service with Stripe Integration
 * Handles payment processing, transaction history, and refunds
 */

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'cancelled'
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet'
  metadata: {
    bookingId: string
    serviceId: string
    serviceType: 'bike' | 'car' | 'campervan' | 'hotel'
    userId: string
  }
  createdAt: string
  clientSecret?: string
}

export interface Transaction {
  id: string
  userId: string
  serviceId: string
  bookingId: string
  type: 'payment' | 'refund' | 'security_deposit' | 'security_refund'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  paymentMethod: string
  gateway: 'stripe' | 'razorpay' | 'paytm' | 'phonepe'
  gatewayTransactionId?: string
  createdAt: string
  updatedAt: string
  refundableAmount?: number
  refundDeadline?: string
}

export interface RefundRequest {
  id: string
  transactionId: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  requestedBy: string
  requestedAt: string
  processedAt?: string
  adminComments?: string
}

class PaymentService {
  private static instance: PaymentService
  private transactionsKey = 'transactions'
  private paymentIntentsKey = 'payment-intents'
  private refundRequestsKey = 'refund-requests'

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  /**
   * Create payment intent for Stripe
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'inr',
    metadata: PaymentIntent['metadata']
  ): Promise<PaymentIntent> {
    try {
      // In a real app, this would call your backend API which then calls Stripe
      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount,
        currency,
        status: 'pending',
        paymentMethod: 'card', // Default to card
        metadata,
        createdAt: new Date().toISOString(),
        clientSecret: `${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`
      }

      // Store payment intent
      const allIntents = await spark.kv.get<PaymentIntent[]>(this.paymentIntentsKey) || []
      allIntents.push(paymentIntent)
      await spark.kv.set(this.paymentIntentsKey, allIntents)

      return paymentIntent
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  /**
   * Process payment (simulated)
   */
  async processPayment(
    paymentIntentId: string,
    paymentMethod: PaymentIntent['paymentMethod'],
    paymentDetails: any
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Validate payment details based on method
      const validationResult = this.validatePaymentDetails(paymentMethod, paymentDetails)
      if (!validationResult.isValid) {
        return { success: false, error: validationResult.error }
      }

      // Get payment intent
      const allIntents = await spark.kv.get<PaymentIntent[]>(this.paymentIntentsKey) || []
      const intentIndex = allIntents.findIndex(intent => intent.id === paymentIntentId)
      
      if (intentIndex === -1) {
        return { success: false, error: 'Payment intent not found' }
      }

      // Simulate payment processing (90% success rate for demo)
      const paymentSucceeded = Math.random() > 0.1

      if (paymentSucceeded) {
        // Update payment intent status
        allIntents[intentIndex].status = 'succeeded'
        allIntents[intentIndex].paymentMethod = paymentMethod
        await spark.kv.set(this.paymentIntentsKey, allIntents)

        // Create transaction record
        const transaction: Transaction = {
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: allIntents[intentIndex].metadata.userId,
          serviceId: allIntents[intentIndex].metadata.serviceId,
          bookingId: allIntents[intentIndex].metadata.bookingId,
          type: 'payment',
          amount: allIntents[intentIndex].amount,
          currency: allIntents[intentIndex].currency,
          status: 'completed',
          paymentMethod,
          gateway: this.getGatewayForMethod(paymentMethod),
          gatewayTransactionId: `${paymentMethod}_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          refundableAmount: allIntents[intentIndex].amount,
          refundDeadline: dayjs().add(24, 'hour').toISOString() // 24 hours for free cancellation
        }

        const allTransactions = await spark.kv.get<Transaction[]>(this.transactionsKey) || []
        allTransactions.push(transaction)
        await spark.kv.set(this.transactionsKey, allTransactions)

        return { success: true, transactionId: transaction.id }
      } else {
        // Payment failed
        allIntents[intentIndex].status = 'failed'
        await spark.kv.set(this.paymentIntentsKey, allIntents)
        return { success: false, error: 'Payment was declined by your bank. Please try a different payment method.' }
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      return { success: false, error: 'Payment processing failed. Please try again.' }
    }
  }

  /**
   * Get transaction history for a user
   */
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const allTransactions = await spark.kv.get<Transaction[]>(this.transactionsKey) || []
      return allTransactions.filter(txn => txn.userId === userId)
    } catch (error) {
      console.error('Error getting user transactions:', error)
      return []
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      const allTransactions = await spark.kv.get<Transaction[]>(this.transactionsKey) || []
      return allTransactions.find(txn => txn.id === transactionId) || null
    } catch (error) {
      console.error('Error getting transaction:', error)
      return null
    }
  }

  /**
   * Request refund
   */
  async requestRefund(
    transactionId: string,
    amount: number,
    reason: string,
    requestedBy: string
  ): Promise<{ success: boolean; refundRequestId?: string; error?: string }> {
    try {
      const transaction = await this.getTransaction(transactionId)
      if (!transaction) {
        return { success: false, error: 'Transaction not found' }
      }

      if (transaction.status !== 'completed') {
        return { success: false, error: 'Cannot refund incomplete transaction' }
      }

      if (amount > (transaction.refundableAmount || 0)) {
        return { success: false, error: 'Refund amount exceeds refundable amount' }
      }

      // Check if within refund deadline
      if (transaction.refundDeadline && dayjs().isAfter(dayjs(transaction.refundDeadline))) {
        return { success: false, error: 'Refund deadline has passed' }
      }

      const refundRequest: RefundRequest = {
        id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId,
        amount,
        reason,
        status: 'pending',
        requestedBy,
        requestedAt: new Date().toISOString()
      }

      const allRefundRequests = await spark.kv.get<RefundRequest[]>(this.refundRequestsKey) || []
      allRefundRequests.push(refundRequest)
      await spark.kv.set(this.refundRequestsKey, allRefundRequests)

      return { success: true, refundRequestId: refundRequest.id }
    } catch (error) {
      console.error('Error requesting refund:', error)
      return { success: false, error: 'Failed to request refund' }
    }
  }

  /**
   * Process refund (admin function)
   */
  async processRefund(
    refundRequestId: string,
    status: 'approved' | 'rejected',
    adminComments?: string
  ): Promise<boolean> {
    try {
      const allRefundRequests = await spark.kv.get<RefundRequest[]>(this.refundRequestsKey) || []
      const requestIndex = allRefundRequests.findIndex(req => req.id === refundRequestId)
      
      if (requestIndex === -1) return false

      allRefundRequests[requestIndex] = {
        ...allRefundRequests[requestIndex],
        status: status === 'approved' ? 'processed' : 'rejected',
        processedAt: new Date().toISOString(),
        adminComments
      }

      await spark.kv.set(this.refundRequestsKey, allRefundRequests)

      if (status === 'approved') {
        // Create refund transaction
        const originalRequest = allRefundRequests[requestIndex]
        const originalTransaction = await this.getTransaction(originalRequest.transactionId)
        
        if (originalTransaction) {
          const refundTransaction: Transaction = {
            id: `txn_refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: originalTransaction.userId,
            serviceId: originalTransaction.serviceId,
            bookingId: originalTransaction.bookingId,
            type: 'refund',
            amount: -originalRequest.amount, // Negative amount for refund
            currency: originalTransaction.currency,
            status: 'completed',
            paymentMethod: originalTransaction.paymentMethod,
            gateway: originalTransaction.gateway,
            gatewayTransactionId: `refund_${originalTransaction.gatewayTransactionId}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const allTransactions = await spark.kv.get<Transaction[]>(this.transactionsKey) || []
          allTransactions.push(refundTransaction)
          await spark.kv.set(this.transactionsKey, allTransactions)

          // Update original transaction's refundable amount
          const originalTxnIndex = allTransactions.findIndex(txn => txn.id === originalTransaction.id)
          if (originalTxnIndex !== -1) {
            allTransactions[originalTxnIndex].refundableAmount = 
              (allTransactions[originalTxnIndex].refundableAmount || 0) - originalRequest.amount
            await spark.kv.set(this.transactionsKey, allTransactions)
          }
        }
      }

      return true
    } catch (error) {
      console.error('Error processing refund:', error)
      return false
    }
  }

  /**
   * Get pending refund requests (for admin)
   */
  async getPendingRefundRequests(): Promise<RefundRequest[]> {
    try {
      const allRequests = await spark.kv.get<RefundRequest[]>(this.refundRequestsKey) || []
      return allRequests.filter(req => req.status === 'pending')
    } catch (error) {
      console.error('Error getting pending refund requests:', error)
      return []
    }
  }

  /**
   * Calculate booking cost
   */
  calculateBookingCost(
    startDate: string,
    endDate: string,
    rentType: 'hours' | 'days' | 'weeks' | 'months',
    pricePerUnit: number
  ): number {
    const start = dayjs(startDate)
    const end = dayjs(endDate)
    
    let duration: number
    switch (rentType) {
      case 'hours':
        duration = Math.ceil(end.diff(start, 'hour', true))
        break
      case 'days':
        duration = Math.ceil(end.diff(start, 'day', true))
        break
      case 'weeks':
        duration = Math.ceil(end.diff(start, 'week', true))
        break
      case 'months':
        duration = Math.ceil(end.diff(start, 'month', true))
        break
      default:
        duration = 1
    }

    return Math.max(duration * pricePerUnit, pricePerUnit) // Minimum 1 unit
  }

  /**
   * Validate payment details
   */
  private validatePaymentDetails(
    method: PaymentIntent['paymentMethod'],
    details: any
  ): { isValid: boolean; error?: string } {
    switch (method) {
      case 'card':
        if (!details.cardNumber || !details.expiryDate || !details.cvv || !details.cardHolder) {
          return { isValid: false, error: 'Please fill all card details' }
        }
        if (!/^\d{16}$/.test(details.cardNumber.replace(/\s/g, ''))) {
          return { isValid: false, error: 'Invalid card number' }
        }
        if (!/^\d{2}\/\d{2}$/.test(details.expiryDate)) {
          return { isValid: false, error: 'Invalid expiry date format (MM/YY)' }
        }
        if (!/^\d{3,4}$/.test(details.cvv)) {
          return { isValid: false, error: 'Invalid CVV' }
        }
        return { isValid: true }
      
      case 'upi':
        if (!details.upiId) {
          return { isValid: false, error: 'Please enter UPI ID' }
        }
        if (!/^[\w.-]+@[\w.-]+$/.test(details.upiId)) {
          return { isValid: false, error: 'Invalid UPI ID format' }
        }
        return { isValid: true }
      
      case 'netbanking':
        if (!details.bankAccount) {
          return { isValid: false, error: 'Please select a bank' }
        }
        return { isValid: true }
      
      default:
        return { isValid: false, error: 'Invalid payment method' }
    }
  }

  /**
   * Get gateway for payment method
   */
  private getGatewayForMethod(method: PaymentIntent['paymentMethod']): Transaction['gateway'] {
    switch (method) {
      case 'card':
        return 'stripe'
      case 'upi':
        return 'razorpay'
      case 'netbanking':
        return 'razorpay'
      case 'wallet':
        return 'paytm'
      default:
        return 'stripe'
    }
  }

  /**
   * Simulate payment gateway responses
   */
  async simulatePaymentGateway(
    amount: number,
    method: PaymentIntent['paymentMethod']
  ): Promise<{ success: boolean; gatewayResponse: any }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Simulate different success rates for different methods
    const successRates = {
      card: 0.95,
      upi: 0.92,
      netbanking: 0.88,
      wallet: 0.90
    }

    const success = Math.random() < successRates[method]

    if (success) {
      return {
        success: true,
        gatewayResponse: {
          transactionId: `${method.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          status: 'SUCCESS',
          amount,
          timestamp: new Date().toISOString()
        }
      }
    } else {
      const errorMessages = {
        card: 'Card declined by issuing bank',
        upi: 'UPI transaction failed. Please try again',
        netbanking: 'Net banking session expired',
        wallet: 'Insufficient wallet balance'
      }

      return {
        success: false,
        gatewayResponse: {
          status: 'FAILED',
          error: errorMessages[method],
          timestamp: new Date().toISOString()
        }
      }
    }
  }

  /**
   * Get transaction history for service provider
   */
  async getProviderTransactions(serviceIds: string[]): Promise<Transaction[]> {
    try {
      const allTransactions = await spark.kv.get<Transaction[]>(this.transactionsKey) || []
      return allTransactions.filter(txn => serviceIds.includes(txn.serviceId))
    } catch (error) {
      console.error('Error getting provider transactions:', error)
      return []
    }
  }

  /**
   * Calculate provider earnings
   */
  async calculateProviderEarnings(
    serviceIds: string[], 
    startDate?: string, 
    endDate?: string
  ): Promise<{
    totalEarnings: number
    totalBookings: number
    averageBookingValue: number
    refundedAmount: number
  }> {
    try {
      const transactions = await this.getProviderTransactions(serviceIds)
      
      let filteredTransactions = transactions
      if (startDate && endDate) {
        filteredTransactions = transactions.filter(txn => {
          const txnDate = dayjs(txn.createdAt)
          return txnDate.isAfter(dayjs(startDate)) && txnDate.isBefore(dayjs(endDate))
        })
      }

      const payments = filteredTransactions.filter(txn => txn.type === 'payment' && txn.status === 'completed')
      const refunds = filteredTransactions.filter(txn => txn.type === 'refund' && txn.status === 'completed')

      const totalEarnings = payments.reduce((sum, txn) => sum + txn.amount, 0)
      const refundedAmount = Math.abs(refunds.reduce((sum, txn) => sum + txn.amount, 0))
      const totalBookings = payments.length
      const averageBookingValue = totalBookings > 0 ? totalEarnings / totalBookings : 0

      return {
        totalEarnings: totalEarnings - refundedAmount,
        totalBookings,
        averageBookingValue,
        refundedAmount
      }
    } catch (error) {
      console.error('Error calculating provider earnings:', error)
      return {
        totalEarnings: 0,
        totalBookings: 0,
        averageBookingValue: 0,
        refundedAmount: 0
      }
    }
  }

  /**
   * Check if booking is refundable
   */
  isBookingRefundable(transaction: Transaction): boolean {
    if (transaction.status !== 'completed') return false
    if ((transaction.refundableAmount || 0) <= 0) return false
    if (transaction.refundDeadline && dayjs().isAfter(dayjs(transaction.refundDeadline))) return false
    return true
  }

  /**
   * Format currency amount
   */
  formatAmount(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }
}

export const paymentService = PaymentService.getInstance()