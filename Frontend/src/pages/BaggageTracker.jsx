"use client"

import { useState } from "react"
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Search, Luggage, FlightTakeoff, LocationOn, Schedule, CheckCircle, LocalShipping } from "@mui/icons-material"

const BaggageTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingResult, setTrackingResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        id: trackingNumber,
        flight: "AA123",
        from: "JFK - John F. Kennedy International",
        to: "LAX - Los Angeles International",
        passenger: "John Doe",
        status: "In Transit",
        currentLocation: "Denver International Airport",
        estimatedDelivery: "2024-01-15 14:30",
        weight: "23 kg",
        timeline: [
          {
            label: "Checked In",
            description: "Baggage checked in at JFK Airport",
            time: "2024-01-14 08:00",
            completed: true,
            location: "JFK Terminal 4",
          },
          {
            label: "Security Screening",
            description: "Baggage cleared security screening",
            time: "2024-01-14 08:30",
            completed: true,
            location: "JFK Security",
          },
          {
            label: "Loaded on Aircraft",
            description: "Baggage loaded on Flight AA123",
            time: "2024-01-14 10:15",
            completed: true,
            location: "JFK Gate A12",
          },
          {
            label: "In Transit",
            description: "Currently at connecting hub",
            time: "2024-01-14 16:45",
            completed: true,
            location: "Denver International Airport",
          },
          {
            label: "Loading Next Flight",
            description: "Being loaded on connecting flight",
            time: "Expected: 2024-01-15 12:00",
            completed: false,
            location: "Denver Gate B15",
          },
          {
            label: "Arrival at Destination",
            description: "Arrival at LAX Airport",
            time: "Expected: 2024-01-15 14:30",
            completed: false,
            location: "LAX Terminal 1",
          },
        ],
      }
      setTrackingResult(mockResult)
      setLoading(false)
    }, 1500)
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

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Track Your Baggage
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          Enter your baggage tag number to track your luggage in real-time
        </Typography>
      </Box>

      {/* Search Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              label="Baggage Tag Number"
              placeholder="e.g., BG001234"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleTrack()}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<Search />}
              onClick={handleTrack}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Tracking..." : "Track"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingResult && (
        <>
          {/* Baggage Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Baggage {trackingResult.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Passenger: {trackingResult.passenger}
                  </Typography>
                </Box>
                <Chip label={trackingResult.status} color={getStatusColor(trackingResult.status)} icon={<Luggage />} />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <FlightTakeoff fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Flight" secondary={trackingResult.flight} />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <LocationOn fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Route" secondary={`${trackingResult.from} → ${trackingResult.to}`} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <LocalShipping fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Current Location" secondary={trackingResult.currentLocation} />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <Schedule fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Est. Delivery" secondary={trackingResult.estimatedDelivery} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tracking Timeline
              </Typography>
              <Stepper orientation="vertical">
                {trackingResult.timeline.map((step, index) => (
                  <Step key={index} active={true} completed={step.completed}>
                    <StepLabel
                      StepIconComponent={() =>
                        step.completed ? <CheckCircle color="success" /> : <Schedule color="action" />
                      }
                    >
                      <Typography variant="subtitle2">{step.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.time}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        📍 {step.location}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </>
      )}

      {/* Help Section */}
      {!trackingResult && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Need Help?
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Your baggage tag number can be found on your boarding pass or baggage receipt.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              If you're having trouble finding your baggage or if it shows as lost, please contact our customer service
              team immediately.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default BaggageTracker
