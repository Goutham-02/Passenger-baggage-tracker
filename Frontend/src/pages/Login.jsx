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
import { useNavigate } from "react-router-dom";
import { FlightTakeoff } from "@mui/icons-material"
import { Link } from "react-router-dom"
import Cookie from 'js-cookie';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "passenger",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.email && credentials.password && credentials.role) {
      const userData = {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      };

      const response = await fetch(`http://localhost:8000/api/v1/users/login-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        setUser(json.user);
        navigate("/dashboard");
        navigate("/dashboard");
      } else {
        setError(json.message || "Login failed");
      }

    } else {
      setError("Please enter email, password and role");
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} onClick={handleSubmit}>
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
