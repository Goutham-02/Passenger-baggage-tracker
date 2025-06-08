import { useState } from "react"
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
} from "@mui/material"
import { FlightTakeoff } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"

const Register = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cnfPassword: "",
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

    const handleSubmit = (e) => {
        e.preventDefault()

        const { name, email, password, cnfPassword } = credentials

        // Basic validation
        if (!name || !email || !password || !cnfPassword) {
            return setError("All fields are required.")
        }

        if (password !== cnfPassword) {
            return setError("Passwords do not match.")
        }

        // Simulate registration logic
        const userData = { name, email }

        // Optionally auto-login or redirect to login page
        // onLogin(userData) // <-- if you want to auto-login
        navigate("/login", { replace: true })
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
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

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
