import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  Button
} from '@mui/material'
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  DirectionsCar,
  TwoWheeler,
  RvHookup,
  Hotel,
  AccountBalance,
  Group,
  Book,
  TrendingUp,
  TempleHindu
} from '@mui/icons-material'

interface FooterProps {
  onPageChange?: (page: string) => void
}

export function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const services = [
    { name: 'Bike Rentals', icon: TwoWheeler, page: 'bikes' },
    { name: 'Car Rentals', icon: DirectionsCar, page: 'cars' },
    { name: 'Campervans', icon: RvHookup, page: 'campervans' },
    { name: 'Nomad Hotels', icon: Hotel, page: 'nomad' },
    { name: 'Pilgrimage Tours', icon: AccountBalance, page: 'pilgrimage' },
    { name: 'Pilgrim Hotels', icon: TempleHindu, page: 'pilgrim-hotels' },
    { name: 'Guided Bike Trips', icon: Group, page: 'trips' }
  ]

  const company = [
    { name: 'About Us', page: 'about' },
    { name: 'Our Story', page: 'story' },
    { name: 'Careers', page: 'careers' },
    { name: 'Press & Media', page: 'press' },
    { name: 'Partner With Us', page: 'partners' },
    { name: 'Sustainability', page: 'sustainability' }
  ]

  const support = [
    { name: 'Contact Us', page: 'contact' },
    { name: 'Help Center', page: 'help' },
    { name: 'Safety Guidelines', page: 'safety' },
    { name: 'Booking Support', page: 'booking-support' },
    { name: 'Travel Insurance', page: 'insurance' },
    { name: 'Emergency Support', page: 'emergency' }
  ]

  const legal = [
    { name: 'Privacy Policy', page: 'privacy' },
    { name: 'Terms of Service', page: 'terms' },
    { name: 'Disclaimer', page: 'disclaimer' },
    { name: 'Cookie Policy', page: 'cookies' },
    { name: 'Refund Policy', page: 'refunds' },
    { name: 'Accessibility', page: 'accessibility' }
  ]

  const handleLinkClick = (page: string) => {
    if (onPageChange) {
      onPageChange(page)
    } else {
      // For now, just scroll to top or handle as needed
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 8,
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              gap: 3
            }
          }}
        >
          {/* Company Info */}
          <Box sx={{ flex: '1 1 300px', minWidth: '280px' }}>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2
              }}
            >
              TravellerClicks
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, lineHeight: 1.6 }}
            >
              Your ultimate travel companion for unforgettable adventures. 
              From bike rentals to guided tours, we make every journey memorable.
            </Typography>
            
            {/* Contact Info */}
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="primary" />
                <Typography variant="body2">
                  <Link href="mailto:support@travellerclicks.com" color="inherit" underline="hover">
                    support@travellerclicks.com
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" color="primary" />
                <Typography variant="body2">
                  <Link href="tel:+919876543210" color="inherit" underline="hover">
                    +91 98765 43210
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="primary" />
                <Typography variant="body2">
                  Mumbai, Maharashtra, India
                </Typography>
              </Box>
            </Stack>

            {/* Social Media Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://facebook.com/travellerclicks"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: '#1877F2' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com/travellerclicks"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: '#1DA1F2' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com/travellerclicks"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: '#E4405F' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com/company/travellerclicks"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: '#0A66C2' } }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                component="a"
                href="https://youtube.com/travellerclicks"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: '#FF0000' } }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Box>

          {/* Services */}
          <Box sx={{ flex: '1 1 160px', minWidth: '150px' }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Our Services
            </Typography>
            <Stack spacing={1}>
              {services.map((service) => (
                <Link
                  key={service.page}
                  component="button"
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                  onClick={() => handleLinkClick(service.page)}
                  sx={{
                    textAlign: 'left',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <service.icon fontSize="small" />
                  {service.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Company */}
          <Box sx={{ flex: '1 1 160px', minWidth: '150px' }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Company
            </Typography>
            <Stack spacing={1}>
              {company.map((item) => (
                <Link
                  key={item.page}
                  component="button"
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                  onClick={() => handleLinkClick(item.page)}
                  sx={{
                    textAlign: 'left',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Support */}
          <Box sx={{ flex: '1 1 160px', minWidth: '150px' }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Support
            </Typography>
            <Stack spacing={1}>
              {support.map((item) => (
                <Link
                  key={item.page}
                  component="button"
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                  onClick={() => handleLinkClick(item.page)}
                  sx={{
                    textAlign: 'left',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Legal */}
          <Box sx={{ flex: '1 1 160px', minWidth: '150px' }}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Legal
            </Typography>
            <Stack spacing={1}>
              {legal.map((item) => (
                <Link
                  key={item.page}
                  component="button"
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                  onClick={() => handleLinkClick(item.page)}
                  sx={{
                    textAlign: 'left',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Newsletter Signup */}
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Box
              sx={{
                backgroundColor: 'grey.50',
                borderRadius: 2,
                p: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get travel tips, deals, and updates delivered to your inbox.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => handleLinkClick('newsletter')}
              >
                Subscribe
              </Button>
              <Typography variant="caption" color="text.secondary">
                No spam, unsubscribe anytime
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} TravellerClicks. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Link
              component="button"
              variant="body2"
              color="text.secondary"
              underline="hover"
              onClick={() => handleLinkClick('privacy')}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Privacy
            </Link>
            <Link
              component="button"
              variant="body2"
              color="text.secondary"
              underline="hover"
              onClick={() => handleLinkClick('terms')}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Terms
            </Link>
            <Link
              component="button"
              variant="body2"
              color="text.secondary"
              underline="hover"
              onClick={() => handleLinkClick('disclaimer')}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Disclaimer
            </Link>
            <Link
              component="button"
              variant="body2"
              color="text.secondary"
              underline="hover"
              onClick={() => handleLinkClick('sitemap')}
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Sitemap
            </Link>
          </Box>
        </Box>

        {/* Trust Indicators */}
        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            ✓ Secure Payments | ✓ 24/7 Support | ✓ Verified Partners | ✓ Best Price Guarantee
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Made with ❤️ for travelers by travelers | Serving adventure seekers across India since 2024
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
