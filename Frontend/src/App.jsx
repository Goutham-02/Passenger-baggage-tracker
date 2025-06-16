import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PassengerDashboard from "./pages/PassengerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BaggageTracker from "./pages/BaggageTracker";
import Register from "./pages/Register";
import Cookie from "js-cookie";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookie.get("accessToken");
      
      if (token) {
        try {
          // Replace this URL with your actual API endpoint
          const response = await fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid, remove it
            Cookie.remove("accessToken");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          Cookie.remove("accessToken");
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    setUser(null);
    Cookie.remove("accessToken");
  };

  const navbarHeight = 64;

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </Box>
    );
  }

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
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : user.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/dashboard" element={user ? <PassengerDashboard user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard user={user} /> : <Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="/track" element={user ? <BaggageTracker /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />} />
          <Route path="*" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"} replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;