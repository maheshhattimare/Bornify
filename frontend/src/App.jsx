import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import BirthdayList from "./pages/BirthdayList";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
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
          {/* <Route
            path="/prifile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          /> */}
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
