
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./features/auth/Login";
import Dashboard from "./features/dashboard/Dashboard";

function ModulePlaceholder({ title }: { title: string }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#05080e",
        color: "#ffffff",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "#0878ff",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "3px",
          }}
        >
          OPSPILOT WORKSPACE
        </p>

        <h1>{title}</h1>

        <p style={{ color: "#8795a8", fontSize: "13px" }}>
          This module is being developed.
        </p>
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Organization */}
      <Route
        path="/departments"
        element={<ModulePlaceholder title="Departments" />}
      />
      <Route
        path="/employees"
        element={<ModulePlaceholder title="Employees" />}
      />

      {/* Project Management */}
      <Route
        path="/projects"
        element={<ModulePlaceholder title="Projects" />}
      />
      <Route
        path="/tasks"
        element={<ModulePlaceholder title="Tasks" />}
      />

      {/* Business Management */}
      <Route path="/crm" element={<ModulePlaceholder title="CRM" />} />
      <Route
        path="/finance"
        element={<ModulePlaceholder title="Finance & Expenses" />}
      />
      <Route
        path="/inventory"
        element={<ModulePlaceholder title="Inventory" />}
      />

      {/* Intelligence */}
      <Route
        path="/automation"
        element={<ModulePlaceholder title="Automation" />}
      />
      <Route
        path="/analytics"
        element={<ModulePlaceholder title="Analytics & Reports" />}
      />
      <Route
        path="/documents"
        element={<ModulePlaceholder title="Documents" />}
      />
      <Route
        path="/ai-assistant"
        element={<ModulePlaceholder title="AI Assistant" />}
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={<ModulePlaceholder title="Settings" />}
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
