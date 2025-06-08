import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PassengerDashboard from "./pages/PassengerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BaggageTracker from "./pages/BaggageTracker";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Height of your navbar (adjust if you style it differently)
  const navbarHeight = 64;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {user && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1000,
          }}
        >
          <Navbar user={user} onLogout={handleLogout} />
        </Box>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: user ? `${navbarHeight}px` : 0,
          px: 3,
          overflowY: "auto",
        }}
      >
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  user.role === "admin" ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
              <Route path="/dashboard" element={<PassengerDashboard user={user} />} />
              <Route path="/admin" element={<AdminDashboard user={user} />} />
              <Route path="/track" element={<BaggageTracker />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
