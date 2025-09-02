import { useState } from 'react'
import { 
  Button, 
  CircularProgress
} from '@mui/material'
import { 
  GpsFixed,
  GpsNotFixed
} from '@mui/icons-material'

interface NearMeButtonProps {
  onClick: () => void
  isActive: boolean
  disabled?: boolean
  className?: string
}

export function NearMeButton({ onClick, isActive, disabled, className }: NearMeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await onClick()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isActive ? "contained" : "outlined"}
      startIcon={loading ? <CircularProgress size={16} /> : isActive ? <GpsFixed /> : <GpsNotFixed />}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      fullWidth
      sx={{ 
        transition: 'all 0.2s',
        ...(isActive && {
          bgcolor: 'success.main',
          color: 'success.contrastText',
          '&:hover': {
            bgcolor: 'success.dark'
          }
        })
      }}
    >
      {loading ? 'Finding...' : isActive ? 'Near Me ✓' : 'Near Me'}
    </Button>
  )
}