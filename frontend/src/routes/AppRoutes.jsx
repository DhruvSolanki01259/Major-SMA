import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/NotFound";
import ContentStudio from "../pages/ContentStudio";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import Analytics from "../pages/Analytics";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* PROTECTED ROUTES */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/content-studio"
        element={
          <ProtectedRoute>
            <ContentStudio />
          </ProtectedRoute>
        }
      />

      {/* 404 */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
