import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { User } from '@/App'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onToggleMode: () => void
  onLogin: (user: User) => void
}

export function AuthModal({ isOpen, onClose, mode, onToggleMode, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptPolicy, setAcceptPolicy] = useState(false)
  const [userType, setUserType] = useState<'traveller' | 'provider'>('traveller')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          return
        }
        if (!acceptPolicy) {
          toast.error('Please accept the terms and conditions')
          return
        }

        // Simulate registration with email verification
        toast.success('Registration successful! Please check your email to verify your account.')
        onClose()
        return
      }

      // Handle test login credentials
      if (email === 'traveller@gmail.com' && password === 'Test@123') {
        const user: User = {
          id: '1',
          email: 'traveller@gmail.com',
          name: 'Test Traveller',
          role: 'traveller',
          isVerified: true
        }
        onLogin(user)
        toast.success('Welcome back!')
        return
      }

      if (email === 'serviceprovider@gmail.com' && password === 'Test@123') {
        const user: User = {
          id: '2',
          email: 'serviceprovider@gmail.com',
          name: 'Test Provider',
          role: 'provider',
          isVerified: true
        }
        onLogin(user)
        toast.success('Welcome back!')
        return
      }

      toast.error('Invalid credentials')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setAcceptPolicy(false)
    setUserType('traveller')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleModeToggle = () => {
    resetForm()
    onToggleMode()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Welcome back! Please sign in to your account.' 
              : 'Join TravellerClicks and start your adventure.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="traveller"
                    checked={userType === 'traveller'}
                    onChange={(e) => setUserType(e.target.value as 'traveller')}
                    className="text-primary"
                  />
                  <span>Traveller</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="provider"
                    checked={userType === 'provider'}
                    onChange={(e) => setUserType(e.target.value as 'provider')}
                    className="text-primary"
                  />
                  <span>Service Provider</span>
                </label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptPolicy"
                checked={acceptPolicy}
                onCheckedChange={(checked) => setAcceptPolicy(checked as boolean)}
              />
              <Label htmlFor="acceptPolicy" className="text-sm">
                I accept the Terms and Conditions
              </Label>
            </div>
          )}

          {mode === 'login' && (
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">Test Credentials:</p>
              <p><strong>Traveller:</strong> traveller@gmail.com / Test@123</p>
              <p><strong>Provider:</strong> serviceprovider@gmail.com / Test@123</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleModeToggle}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={handleModeToggle}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}