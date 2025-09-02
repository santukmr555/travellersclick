import { useState } from 'react'
import { User } from '@/App'
import { ProviderDashboard } from '@/components/dashboard/ProviderDashboard'
import { UserDashboard } from '@/components/dashboard/UserDashboard'

interface DashboardPageProps {
  currentUser: User | null
}

export function DashboardPage({ currentUser }: DashboardPageProps) {
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          Please sign in to access the dashboard.
        </p>
      </div>
    )
  }

  if (currentUser.role === 'provider') {
    return <ProviderDashboard currentUser={currentUser} />
  }

  return <UserDashboard currentUser={currentUser} />
}