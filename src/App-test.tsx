import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Container, Typography } from '@mui/material'
import { muiTheme } from '@/theme/mui-theme'

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Container>
        <Typography variant="h1" component="h1" sx={{ mt: 4, mb: 2 }}>
          TravellerClicks - Test
        </Typography>
        <Typography variant="body1">
          This is a test version to check if the basic setup is working.
        </Typography>
      </Container>
    </ThemeProvider>
  )
}

export default App