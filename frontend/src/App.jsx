import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import BackgroundGlow from "./components/BackgroundGlow.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Traces from "./pages/Traces.jsx";
import TraceDetail from "./pages/TraceDetail.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Applications from "./pages/Applications.jsx";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-950">
        <BackgroundGlow />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  if (!localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <BackgroundGlow />
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div key={location.pathname} className="opacity-0 animate-fadeInUp">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/traces" element={<Traces />} />
            <Route path="/traces/:traceId" element={<TraceDetail />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
