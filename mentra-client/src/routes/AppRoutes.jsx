import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "../pages/Onboarding/Onboarding";
import {
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import Lesson from "../pages/Lesson/Lesson";
import Dashboard from "../pages/Dashboard/Dashboard";
import Quiz from "../pages/Dashboard/Quiz";

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

<Route
  path="/lessons/:id"
  element={
    <>
      <SignedIn>
        <Lesson />
      </SignedIn>

      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  }
/>

<Route
  path="/quiz/:lessonId"
  element={
    <>
      <SignedIn>
        <Quiz />
      </SignedIn>

      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
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