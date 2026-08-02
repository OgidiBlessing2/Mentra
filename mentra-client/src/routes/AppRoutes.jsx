import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />
    </Routes>
  );
}