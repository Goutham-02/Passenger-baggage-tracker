import { useState, useEffect } from "react"
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
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
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import Edit from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import FlightIcon from '@mui/icons-material/Flight';
import RouteIcon from '@mui/icons-material/Route';
import CircleIcon from '@mui/icons-material/Circle';

const AdminDashboard = () => {
  const [selectedBag, setSelectedBag] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [allBaggage, setAllBaggage] = useState([])
  const [updatedStatus, setUpdatedStatus] = useState(selectedBag?.status.toLowerCase() || '');


  useEffect(() => {
    const fetchBaggage = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/all-baggages')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Response is not JSON")
        }
        const data = await response.json()
        console.log('Fetched baggage data:', data)
        setAllBaggage(data.baggages)
      } catch (error) {
        console.error('Error fetching baggage:', error)
        setAllBaggage([])
      }
    }
    fetchBaggage()
  }, [])

  useEffect(() => {
    if (selectedBag) {
      setUpdatedStatus(selectedBag.status.toLowerCase());
    }
  }, [selectedBag]);

  const handleViewDetails = (bag) => {
    setSelectedBag(bag)
    setDialogOpen(true)
  };

  const handleUpdateStatus = async (bagId, status) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/update-baggage-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bagId,
          status
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Status updated successfully:', data);

      setAllBaggage(prevBaggage =>
        prevBaggage.map(bag =>
          bag._id === bagId ? { ...bag, status: status } : bag
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }

    setDialogOpen(false)
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "success";
      case "in-transit":
        return "primary";
      case "checked-in":
        return "info";
      case "delayed":
        return "warning";
      case "lost":
        return "error";
      default:
        return "default";
    }
  };

  const formatStatusLabel = (status) =>
    status
      .replace("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor and manage all baggage tracking operations
        </Typography>
      </Box>

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
                  <TableCell>Location</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allBaggage.filter(bag =>
                  statusFilter === "all" ||
                  bag.status.toLowerCase() === statusFilter
                ).map((bag) => (
                  <TableRow key={bag._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {bag.tagNumber || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>{bag.passengerId?.name || "N/A"}</TableCell>
                    <TableCell>{bag.flightId?.name || "N/A"}</TableCell>
                    <TableCell>
                      {bag.flightId?.from || "N/A"} → {bag.flightId?.to || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatStatusLabel(bag.status)}
                        color={getStatusColor(bag.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{bag.location || "Unknown"}</TableCell>
                    <TableCell>{new Date(bag.updatedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(bag)}
                        color="primary"
                      >
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          Baggage Details - {selectedBag?.tagNumber}
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedBag && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{
                    backgroundColor: 'grey.50',
                    p: 2,
                    borderRadius: 2,
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Passenger Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        {selectedBag.passengerId.name}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Flight Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FlightIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        {selectedBag.flightId.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RouteIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        {selectedBag.flightId.from} → {selectedBag.flightId.to}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{
                    backgroundColor: 'grey.50',
                    p: 2,
                    borderRadius: 2,
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Current Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Chip
                        label={selectedBag.status}
                        color={getStatusColor(selectedBag.status)}
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          px: 1,
                          py: 1.5
                        }}
                        icon={
                          <CircleIcon sx={{
                            fontSize: '0.75rem',
                            color: 'inherit'
                          }} />
                        }
                      />
                    </Box>

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Update Status
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'grey.300'
                          }
                        }}
                      >
                        <MenuItem value="checked in">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleIcon sx={{ color: 'success.main', fontSize: '0.75rem', mr: 1 }} />
                            Checked In
                          </Box>
                        </MenuItem>
                        <MenuItem value="in transit">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleIcon sx={{ color: 'info.main', fontSize: '0.75rem', mr: 1 }} />
                            In Transit
                          </Box>
                        </MenuItem>
                        <MenuItem value="delivered">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleIcon sx={{ color: 'primary.main', fontSize: '0.75rem', mr: 1 }} />
                            Delivered
                          </Box>
                        </MenuItem>
                        <MenuItem value="delayed">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleIcon sx={{ color: 'warning.main', fontSize: '0.75rem', mr: 1 }} />
                            Delayed
                          </Box>
                        </MenuItem>
                        <MenuItem value="lost">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircleIcon sx={{ color: 'error.main', fontSize: '0.75rem', mr: 1 }} />
                            Lost
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleUpdateStatus(selectedBag?._id, updatedStatus)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: 'none',
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminDashboard
