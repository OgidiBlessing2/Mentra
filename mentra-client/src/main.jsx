import React, { useEffect, useState } from "react";
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

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { configureApiAuth } from "./api/axios";

const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY"
  );
}

const queryClient = new QueryClient();

function ClerkReadyGate({ children }) {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    console.log("🔐 Clerk loaded:", {
      isLoaded,
      isSignedIn,
    });

    configureApiAuth(getToken);

    console.log(
      "🔐 Axios auth provider configured"
    );

    setApiReady(true);
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || !apiReady) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        Loading Mentra...
      </div>
    );
  }

  return children;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <ClerkReadyGate>
              <App />
            </ClerkReadyGate>

            <Toaster
              position="top-right"
              richColors
            />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);