import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Campgrounds from "./pages/Campgrounds";
import CampgroundDetail from "./pages/CampgroundDetail";

import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// App Routes
function AppContent() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Campgrounds */}
        <Route path="/campgrounds" element={<Campgrounds />} />
        <Route path="/campgrounds/:id" element={<CampgroundDetail />} />

        {/* Protected Routes */}
        <Route
          path="/campgrounds/new"
          element={
            <ProtectedRoute>
              <div>New Campground Form Coming Soon</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campgrounds/:id/edit"
          element={
            <ProtectedRoute>
              <div>Edit Campground Form Coming Soon</div>
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Root App with Auth Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
