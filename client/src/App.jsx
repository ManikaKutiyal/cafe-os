import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage/LandingPage";

const OwnerDashboard = () => <h1>Owner Dashboard</h1>;
const AdminDashboard = () => <h1>Super Admin Dashboard</h1>;
const Unauthorized = () => <h1>403 - Unauthorized</h1>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/owner/dashboard"
            element={<ProtectedRoute allowedRoles={["owner"]}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard"
            element={<ProtectedRoute allowedRoles={["superadmin"]}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;