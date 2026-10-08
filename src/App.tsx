import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import NotFoundPage from "./pages/NotFoundPage";
import OverduePage from "./pages/OverduePage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import EditTicketPage from "./pages/EditTicketPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DepartmentsPage from "./pages/DepartmentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* All authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/tickets"
              element={<TicketsPage />}
            />

            <Route
              path="/tickets/new"
              element={<CreateTicketPage />}
            />

            <Route
              path="/tickets/:id"
              element={<TicketDetailsPage />}
            />

            <Route
              path="/tickets/:id/edit"
              element={<EditTicketPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />

            {/* IT Support only */}
            <Route element={<RoleRoute allowedRoles={["IT Support"]} />}>

              <Route
                path="/overdue"
                element={<OverduePage />}
              />

              <Route
                path="/analytics"
                element={<AnalyticsPage />}
              />
              <Route
                path="/departments"
                element={<DepartmentsPage />}
              />

            </Route>

          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;