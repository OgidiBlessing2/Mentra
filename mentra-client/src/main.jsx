
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import {
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "sonner";

import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";

const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log(
  "🔑 Clerk publishable key exists:",
  !!clerkPubKey
);

if (!clerkPubKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY environment variable."
  );
}

const queryClient = new QueryClient();

function ClerkReadyGate({ children }) {
  const { isLoaded } = useAuth();

  /*
   * Clerk is still initializing.
   *
   * DO NOT render Mentra until Clerk has finished
   * restoring the authentication state.
   */
  if (!isLoaded) {
    return <MentraLoadingScreen />;
  }

  /*
   * Clerk is ready.
   *
   * Mentra can now mount.
   *
   * Individual API requests should get their token
   * using getToken() when they actually need it.
   */
  return children;
}

function MentraLoadingScreen() {
  return (
    <div className="min-h-screen bg-[var(--mentra-bg,#0a0a0a)] text-[var(--mentra-text,#ffffff)] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 text-center">
        {/* Logo / spinner */}
        <div className="relative mb-6">
          <div className="h-14 w-14 rounded-full border-4 border-white/10 border-t-emerald-500 animate-spin" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-2xl font-bold tracking-tight">
          Mentra
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Preparing your secure session...
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connecting to Clerk</span>
        </div>
      </div>
    </div>
  );
}

function RootApp() {
  return (
    <ClerkReadyGate>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <App />

            <Toaster
              position="top-right"
              richColors
              closeButton
            />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkReadyGate>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RootApp />
    </ClerkProvider>
  </React.StrictMode>
);
