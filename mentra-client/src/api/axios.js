import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

let clerkGetToken = null;

export function configureApiAuth(getToken) {
  clerkGetToken = getToken;

  console.log(
    "🔐 Axios: Clerk token provider configured"
  );
}

api.interceptors.request.use(
  async (config) => {
    try {
      if (!clerkGetToken) {
        console.warn(
          "⚠️ Axios: Clerk token provider is not configured"
        );

        return config;
      }

      const token = await clerkGetToken();

      if (!token) {
        console.warn(
          "⚠️ Axios: Clerk returned no session token"
        );

        return config;
      }

      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

      console.log(
        "🔐 Axios: Authorization header attached"
      );
    } catch (error) {
      console.error(
        "❌ Axios: Failed to get Clerk token:",
        error
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;