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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Edit,
  Visibility,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  Luggage,
  FlightTakeoff,
} from "@mui/icons-material"

const AdminDashboard = ({ user }) => {
  const [selectedBag, setSelectedBag] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock baggage data for admin view
  const allBaggage = [
    {
      id: "BG001234",
      passenger: "John Doe",
      flight: "AA123",
      from: "JFK",
      to: "LAX",
      status: "In Transit",
      lastUpdate: "2 hours ago",
      location: "Denver Hub",
      priority: "Normal",
    },
    {
      id: "BG001235",
      passenger: "Jane Smith",
      flight: "AA456",
      from: "LAX",
      to: "ORD",
      status: "Delivered",
      lastUpdate: "1 day ago",
      location: "Baggage Claim 3",
      priority: "Normal",
    },
    {
      id: "BG001236",
      passenger: "Bob Johnson",
      flight: "DL789",
      from: "ATL",
      to: "MIA",
      status: "Delayed",
      lastUpdate: "4 hours ago",
      location: "Atlanta Airport",
      priority: "High",
    },
    {
      id: "BG001237",
      passenger: "Alice Brown",
      flight: "UA321",
      from: "SFO",
      to: "SEA",
      status: "Lost",
      lastUpdate: "1 day ago",
      location: "Unknown",
      priority: "Critical",
    },
  ]

  const stats = {
    total: 1247,
    inTransit: 89,
    delivered: 1134,
    delayed: 18,
    lost: 6,
  }

  const handleViewDetails = (bag) => {
    setSelectedBag(bag)
    setDialogOpen(true)
  }

  const handleUpdateStatus = (bagId, newStatus) => {
    // Mock update functionality
    console.log(`Updating bag ${bagId} to status: ${newStatus}`)
    setDialogOpen(false)
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "error"
      case "High":
        return "warning"
      case "Normal":
        return "success"
      default:
        return "default"
    }
  }

  const filteredBaggage =
    statusFilter === "all" ? allBaggage : allBaggage.filter((bag) => bag.status.toLowerCase() === statusFilter)

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor and manage all baggage tracking operations
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Luggage sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Baggage
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <FlightTakeoff sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {stats.inTransit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Transit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <CheckCircle sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {stats.delivered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Delivered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Schedule sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {stats.delayed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Delayed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Warning sx={{ fontSize: 40, color: "error.main", mb: 1 }} />
              <Typography variant="h4" color="error.main">
                {stats.lost}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lost
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="in transit">In Transit</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="delayed">Delayed</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Search Baggage ID" variant="outlined" sx={{ minWidth: 200 }} />
            <Button variant="contained" startIcon={<TrendingUp />}>
              Generate Report
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Baggage Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Baggage Management
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Baggage ID</TableCell>
                  <TableCell>Passenger</TableCell>
                  <TableCell>Flight</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBaggage.map((bag) => (
                  <TableRow key={bag.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {bag.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{bag.passenger}</TableCell>
                    <TableCell>{bag.flight}</TableCell>
                    <TableCell>
                      {bag.from} → {bag.to}
                    </TableCell>
                    <TableCell>
                      <Chip label={bag.status} color={getStatusColor(bag.status)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={bag.priority} color={getPriorityColor(bag.priority)} size="small" />
                    </TableCell>
                    <TableCell>{bag.location}</TableCell>
                    <TableCell>{bag.lastUpdate}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewDetails(bag)} color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Baggage Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Baggage Details - {selectedBag?.id}</DialogTitle>
        <DialogContent>
          {selectedBag && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Passenger</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBag.passenger}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Flight</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBag.flight}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Route</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBag.from} → {selectedBag.to}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Current Status</Typography>
                  <Chip label={selectedBag.status} color={getStatusColor(selectedBag.status)} sx={{ mt: 0.5 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Update Status</Typography>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <Select defaultValue={selectedBag.status.toLowerCase()}>
                      <MenuItem value="checked in">Checked In</MenuItem>
                      <MenuItem value="in transit">In Transit</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="delayed">Delayed</MenuItem>
                      <MenuItem value="lost">Lost</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleUpdateStatus(selectedBag?.id, "updated")}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminDashboard
