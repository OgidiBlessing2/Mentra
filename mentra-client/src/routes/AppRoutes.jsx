
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

// Pages
import Onboarding from "../pages/Onboarding/Onboarding";
import Lesson from "../pages/Lesson/Lesson.jsx";
import Dashboard from "../pages/Dashboard/Dashboard";
import Quiz from "../pages/Dashboard/Quiz";
import Achievements from "../pages/Achievements/Achievements";
import Notes from "../pages/Notes/Notes";
import Bookmarks from "../pages/Bookmarks/Bookmarks";
import Flashcards from "../pages/FlashCards/Flashcard";
import Roadmap from "../pages/Roadmap/Roadmap";
import Settings from "../pages/Settings/Settings";
import Mentor from "../pages/Mentor/Mentor";
// Auth
import SignInPage from "../pages/Auth/SignInPage";
import SignUpPage from "../pages/Auth/SignUpPage";

// Projects
import Projects from "../pages/Project/Project";
import ProjectDetail from "../pages/Project/ProjectDetail.jsx";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/sign-in/*"
        element={<SignInPage />}
      />

      <Route
        path="/sign-up/*"
        element={<SignUpPage />}
      />


      {/* ================= PROTECTED ================= */}

      <Route
  path="/settings"
  element={
    <>
      <SignedIn>
        <Settings />
      </SignedIn>

      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  }
/>

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
          <>
            <SignedIn>
              <Onboarding />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/notes"
        element={
          <>
            <SignedIn>
              <Notes />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/bookmarks"
        element={
          <>
            <SignedIn>
              <Bookmarks />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/flashcards"
        element={
          <>
            <SignedIn>
              <Flashcards />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/roadmaps/:id"
        element={
          <>
            <SignedIn>
              <Roadmap />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
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

      <Route
        path="/achievements"
        element={
          <>
            <SignedIn>
              <Achievements />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
  path="/mentor"
  element={<Mentor />}
/>


      {/* ================= PROJECTS ================= */}

      <Route
        path="/projects"
        element={
          <>
            <SignedIn>
              <Projects />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <>
            <SignedIn>
              <ProjectDetail />
            </SignedIn>

            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />


      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}
