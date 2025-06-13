import { useState } from "react"
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
} from "@mui/material"
import { FlightTakeoff } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"

const Register = () => {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cnfPassword: "",
        role: ""
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { name, email, password, cnfPassword, role } = credentials

        // Basic validation
        if (!name || !email || !password || !cnfPassword || !role) {
            return setError("All fields are required.")
        }

        if (password !== cnfPassword) {
            return setError("Passwords do not match.")
        }

        try {
            const response = await fetch('http://localhost:8000/api/v1/users/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                    <FlightTakeoff sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                    <Typography component="h1" variant="h4" color="primary">
                        Baggage Tracker
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Register to track your baggage
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={credentials.name}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={credentials.email}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={credentials.password}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="cnfPassword"
                        label="Confirm Password"
                        type="password"
                        id="cnfPassword"
                        value={credentials.cnfPassword}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            name="role"
                            value={credentials.role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value="passenger">Passenger</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
                        Register
                    </Button>
                </Box>
                <Box>
                    <Typography variant="subtitle1">
                        Registered already?{' '}
                        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Click here to login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    )
}

export default Register
