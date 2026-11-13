import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Providers } from "./app/Providers";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAuth } from "./features/auth/auth-context";
import { Login } from "./features/auth/Login";
import { AppLayout } from "./layouts/AppLayout";
import { ModulePage } from "./features/modules/ModulePage";
import { Settings } from "./features/settings/Settings";
const Dashboard = lazy(() =>
  import("./features/dashboard/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location.pathname + location.search }}
      replace
    />
  );
}
function workspaceRoutes() {
  return (
    <>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="settings" element={<Settings />} />
      <Route path=":module" element={<ModulePage />} />
      <Route path="*" element={<ModulePage />} />
    </>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="loading-state" role="status">
                <span className="loading-dot" />
                Loading workspace…
              </div>
            }
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/preview" element={<AppLayout preview />}>
                {workspaceRoutes()}
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<AppLayout />}>
                  {workspaceRoutes()}
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  );
}
