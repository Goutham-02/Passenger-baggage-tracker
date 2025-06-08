"use client"

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
  Card,
  CardContent,
} from "@mui/material"
import { FlightTakeoff } from "@mui/icons-material"
import { Link } from "react-router-dom"

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "passenger",
  })
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    // Demo authentication
    if (credentials.email && credentials.password) {
      const userData = {
        id: 1,
        name: credentials.role === "admin" ? "Admin User" : "John Passenger",
        email: credentials.email,
        role: credentials.role,
      }
      onLogin(userData)
    } else {
      setError("Please enter email and password")
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
    setError("")
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
            Sign in to track your baggage
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={credentials.password}
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
            Sign In
          </Button>
        </Box>

        <Box>
          <Typography variant="subtitle1">
            Not registered yet?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Click here to register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login
