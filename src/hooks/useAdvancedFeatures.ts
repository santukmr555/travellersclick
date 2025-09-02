import { useState, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { paymentService } from '@/services/paymentService'

/**
 * Hook for payment processing
 */
export function usePaymentProcessing() {
  const [processing, setProcessing] = useState(false)
  const [transactions, setTransactions] = useLocalStorage<any[]>('user-transactions', [])

  const processPayment = useCallback(async (
    amount: number,
    paymentMethod: 'card' | 'upi' | 'netbanking',
    paymentDetails: any,
    metadata: any
  ) => {
    setProcessing(true)
    
    try {
      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(amount, 'inr', metadata)
      
      // Process payment
      const result = await paymentService.processPayment(paymentIntent.id, paymentMethod, paymentDetails)
      
      if (result.success) {
        // Update local transaction history
        setTransactions(prev => [...prev, {
          id: result.transactionId,
          amount,
          method: paymentMethod,
          status: 'completed',
          timestamp: new Date().toISOString(),
          metadata
        }])
      }
      
      return result
    } catch (error) {
      console.error('Payment processing error:', error)
      return { success: false, error: 'Payment processing failed' }
    } finally {
      setProcessing(false)
    }
  }, [setTransactions])

  const getTransactionHistory = useCallback(() => {
    return transactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [transactions])

  return {
    processing,
    processPayment,
    transactions: getTransactionHistory()
  }
}