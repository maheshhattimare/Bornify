import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import BirthdayList from "./pages/BirthdayList";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./Layout/AppLayout";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
          {/* Parent Route with Layout */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/birthdays"
              element={
                <PrivateRoute>
                  <BirthdayList />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route path="*" element={<Navigate to="/signup" />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </GoogleOAuthProvider>
  );
};

export default App;
