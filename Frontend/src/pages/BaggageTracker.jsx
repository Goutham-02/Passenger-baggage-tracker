import { useState } from "react";
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from "@mui/material";
import { Flight, Work } from "@mui/icons-material";

const AdminPanel = () => {
    const [flight, setFlight] = useState({
        name: "",
        from: "",
        to: "",
        departureTime: "",
        arrivalTime: "",
    });

    const [baggage, setBaggage] = useState({
        passengerId: "",
        flightId: "",
        weight: "",
        status: "",
    });

    const [flights, setFlights] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [loadingFlights, setLoadingFlights] = useState(false);
    const [loadingPassengers, setLoadingPassengers] = useState(false);

    const handleFlightsOpen = async () => {
        if (flights.length === 0) {
            setLoadingFlights(true);
            try {
                const res = await fetch("http://localhost:8000/api/v1/users/all-flights");
                const data = await res.json();
                setFlights(data.flights || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch flights.");
            } finally {
                setLoadingFlights(false);
            }
        }
    };

    // Fetch passengers when dropdown opens
    const handlePassengersOpen = async () => {
        if (passengers.length === 0) {
            setLoadingPassengers(true);
            try {
                const res = await fetch("http://localhost:8000/api/v1/users/all-users");
                const data = await res.json();
                setPassengers(data.users || []);
            } catch (err) {
                setError(`Failed to fetch passengers: ${err.message}`);
            } finally {
                setLoadingPassengers(false);
            }
        }
    };

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFlightChange = (e) => {
        setFlight({ ...flight, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleBaggageChange = (e) => {
        setBaggage({ ...baggage, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const addFlight = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8000/api/v1/users/add-plane", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(flight),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to add flight");

            setSuccess("Flight added successfully!");
            setFlight({ name: "", from: "", to: "", departureTime: "", arrivalTime: "" });
        } catch (err) {
            setError(err.message);
        }
    };

    const addBaggage = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!baggage.passengerId || !baggage.flightId || !baggage.weight || !baggage.status) {
            setError("All fields are required");
            return;
        }

        try {
            const baggageData = {
                ...baggage,
                weight: Number(baggage.weight),
                location: "Check-in Counter"
            };

            const res = await fetch("http://localhost:8000/api/v1/users/add-baggage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(baggageData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to add baggage");

            setSuccess(`Baggage added successfully! Baggage ID: ${data.baggage.baggageID}`);
            setBaggage({ passengerId: "", flightId: "", weight: "", status: "" });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Work sx={{ fontSize: 40, color: "primary.main", mr: 1 }} />
                    <Typography variant="h4" color="primary">Admin Panel</Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Typography variant="h6" gutterBottom>Add Flight</Typography>
                <Box component="form" onSubmit={addFlight} sx={{ mb: 4 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Plane Name"
                        name="name"
                        value={flight.name}
                        onChange={handleFlightChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="From"
                        name="from"
                        value={flight.from}
                        onChange={handleFlightChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="To"
                        name="to"
                        value={flight.to}
                        onChange={handleFlightChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Departure Time (ISO format)"
                        name="departureTime"
                        value={flight.departureTime}
                        onChange={handleFlightChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Arrival Time (ISO format)"
                        name="arrivalTime"
                        value={flight.arrivalTime}
                        onChange={handleFlightChange}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Flight</Button>
                </Box>

                <Typography variant="h6" gutterBottom>Add Baggage</Typography>
                <Box component="form" onSubmit={addBaggage}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="flight-label">Select Flight</InputLabel>
                        <Select
                            labelId="flight-label"
                            id="flightId"
                            name="flightId"
                            value={baggage.flightId}
                            label="Select Flight"
                            onOpen={handleFlightsOpen}
                            onChange={handleBaggageChange}
                        >
                            {loadingFlights ? (
                                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                            ) : (
                                flights.map(flight => (
                                    <MenuItem key={flight._id} value={flight._id}>
                                        {`${flight.name} (${flight.from} → ${flight.to})`}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="passenger-label">Select Passenger</InputLabel>
                        <Select
                            labelId="passenger-label"
                            id="passengerId"
                            name="passengerId"
                            value={baggage.passengerId}
                            label="Select Passenger"
                            onOpen={handlePassengersOpen}
                            onChange={handleBaggageChange}
                        >
                            {loadingPassengers ? (
                                <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                            ) : (
                                passengers.map(user => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Weight (in kg)"
                        name="weight"
                        type="number"
                        value={baggage.weight}
                        onChange={handleBaggageChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Status (e.g., checked-in)"
                        name="status"
                        value={baggage.status}
                        onChange={handleBaggageChange}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Baggage</Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminPanel;
