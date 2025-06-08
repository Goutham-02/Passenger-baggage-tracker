"use client"

import { useState } from "react"
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Button,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Luggage, FlightTakeoff, LocationOn, CheckCircle, Schedule, Search } from "@mui/icons-material"

const PassengerDashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState(null)

  // Mock baggage data
  const myBaggage = [
    {
      id: "BG001234",
      flight: "AA123",
      from: "JFK",
      to: "LAX",
      status: "In Transit",
      progress: 60,
      lastUpdate: "2 hours ago",
      location: "Denver Hub",
    },
    {
      id: "BG001235",
      flight: "AA456",
      from: "LAX",
      to: "ORD",
      status: "Delivered",
      progress: 100,
      lastUpdate: "1 day ago",
      location: "Baggage Claim 3",
    },
  ]

  const handleSearch = () => {
    if (searchQuery) {
      // Mock search result
      setSearchResult({
        id: searchQuery,
        flight: "DL789",
        from: "ATL",
        to: "MIA",
        status: "Checked In",
        progress: 25,
        lastUpdate: "30 minutes ago",
        location: "Atlanta Airport",
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success"
      case "In Transit":
        return "primary"
      case "Checked In":
        return "info"
      case "Delayed":
        return "warning"
      case "Lost":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle />
      case "In Transit":
        return <FlightTakeoff />
      case "Checked In":
        return <Luggage />
      default:
        return <Schedule />
    }
  }

  return (
    <Container maxWidth="lg"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '-ms-overflow-style': 'none',
        'scrollbarWidth': 'none'
      }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your baggage and view your travel history
        </Typography>
      </Box>

      {/* Quick Search */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Baggage Search
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Baggage Tag Number"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <Button variant="contained" startIcon={<Search />} onClick={handleSearch} sx={{ minWidth: 120 }}>
              Search
            </Button>
          </Box>

          {searchResult && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                Baggage {searchResult.id} - {searchResult.status}
              </Typography>
              <Typography variant="body2">
                Flight {searchResult.flight}: {searchResult.from} → {searchResult.to}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* My Baggage */}
      <Typography variant="h5" gutterBottom>
        My Baggage
      </Typography>

      <Grid container spacing={3}>
        {myBaggage.map((bag) => (
          <Grid item xs={12} md={6} key={bag.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {bag.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Flight {bag.flight}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(bag.status)}
                    label={bag.status}
                    color={getStatusColor(bag.status)}
                    variant="outlined"
                  />
                </Box>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <FlightTakeoff fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Route" secondary={`${bag.from} → ${bag.to}`} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <LocationOn fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Current Location" secondary={bag.location} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Schedule fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Last Update" secondary={bag.lastUpdate} />
                  </ListItem>
                </List>

                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{bag.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={bag.progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Travel Stats */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Travel Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary">
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Flights
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary">
                  24
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bags Tracked
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="success.main">
                  98%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On-Time Delivery
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default PassengerDashboard
