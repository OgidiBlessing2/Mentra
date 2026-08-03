import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "../pages/Onboarding/Onboarding";
import {
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

import Dashboard from "../pages/Dashboard/Dashboard";

// Auth Pages
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ---------- PUBLIC ---------- */}

      <Route
        path="/sign-in/*"
        element={<SignInPage />}
      />

      <Route
        path="/sign-up/*"
        element={<SignUpPage />}
      />

      {/* ---------- PROTECTED ---------- */}

      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
    path="/onboarding"
    element={
        <SignedIn>
            <Onboarding />
        </SignedIn>
    }
/>

      {/* Temporary */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* 404 */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}