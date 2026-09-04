import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Schedules from "./pages/Schedules";
import Branches from "./pages/Branches";
import Lecturers from "./pages/Lecturers";
import Courses from "./pages/Courses";
import Progress from "./pages/Progress";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected application */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Schedules />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="generate" element={<Generate />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="branches" element={<Branches />} />
          <Route path="lecturers" element={<Lecturers />} />
          <Route path="courses" element={<Courses />} />
          <Route path="progress" element={<Progress />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
