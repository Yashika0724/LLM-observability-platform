import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Traces from "./pages/Traces.jsx";
import TraceDetail from "./pages/TraceDetail.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Applications from "./pages/Applications.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  if (!localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex gap-6 p-4">
      <Sidebar />
      <div className="flex-1 min-w-0 py-2 pr-2">
        <Topbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/traces" element={<Traces />} />
          <Route path="/traces/:traceId" element={<TraceDetail />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
}
