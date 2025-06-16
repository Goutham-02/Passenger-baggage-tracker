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
import { Luggage, FlightTakeoff, LocationOn, CheckCircle, Schedule, Search, Scale } from "@mui/icons-material"
import { useEffect } from "react";
import Cookie from 'js-cookie';

const PassengerDashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [myBaggage, setMyBaggage] = useState('');

  const accessToken = Cookie.get("accessToken");
  const [id, setId] = useState('');

  useEffect(() => {
    if (accessToken) {
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
      setId(tokenData._id);
    }
  }, [accessToken]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/users/all-baggages/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setMyBaggage(data.baggages))
      .catch(error => console.error('Error:', error));
  }, [user.id]);

  const handleSearch = () => {
    if (searchQuery) {
      fetch(`http://localhost:8000/api/v1/users/search-baggage/${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => setSearchResult(data))
        .catch(error => console.error('Error:', error));
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
                Baggage {searchResult.baggage.tagNumber} - {searchResult.baggage.status}
              </Typography>
              <Typography variant="body2">
                Flight {searchResult.baggage.flightId.name}: {searchResult.baggage.flightId.from} → {searchResult.baggage.flightId.to}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* My Baggage */}
      <Typography variant="h5" gutterBottom>
        My Baggages
      </Typography>

      <Grid container spacing={3} marginTop={2}>
        {Array.isArray(myBaggage) && myBaggage.map((bag) => (
          <Grid item xs={12} md={6} key={bag.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {bag.tagNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Flight {bag.flightId.name}
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
                    <ListItemText primary="Route" secondary={`${bag.flightId.from} → ${bag.flightId.to}`} />
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
                    <ListItemText primary="Last Update" secondary={bag.updatedAt} />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Scale fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Weight" secondary={`${bag.weight} Kgs`} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default PassengerDashboard
