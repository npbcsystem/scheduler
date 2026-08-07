import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Schedules from "./pages/Schedules";
import Branches from "./pages/Branches";
import Lecturers from "./pages/Lecturers";
import Courses from "./pages/Courses";
import Progress from "./pages/Progress";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
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