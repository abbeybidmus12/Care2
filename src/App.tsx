import React, { Suspense } from "react";
import WelcomePage from "./components/WelcomePage";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import WorkerProtectedRoute from "./components/auth/WorkerProtectedRoute";
import Registration from "./components/auth/Registration";
import CareHomeRegistration from "./components/auth/CareHomeRegistration";
import WorkerSignIn from "./components/auth/WorkerSignIn";
import CareHomeSignIn from "./components/auth/CareHomeSignIn";

// Dashboard Components
import DashboardLayout from "./components/layouts/DashboardLayout";
import WorkerDashboardLayout from "./components/layouts/WorkerDashboardLayout";

// Care Home Dashboard Components
import Overview from "./components/dashboard/Overview";
import PostShift from "./components/dashboard/PostShift";
import ManageShifts from "./components/dashboard/ManageShifts";
import Workers from "./components/dashboard/Workers";
import Timesheets from "./components/dashboard/Timesheets";
import IncidentReports from "./components/dashboard/IncidentReports";
import Reports from "./components/dashboard/Reports";
import Settings from "./components/dashboard/Settings";

// Worker Dashboard Components
import WorkerOverview from "./components/worker-dashboard/Overview";
import AvailableShifts from "./components/worker-dashboard/AvailableShifts";
import MyShifts from "./components/worker-dashboard/MyShifts";
import WorkerTimesheets from "./components/worker-dashboard/Timesheets";
import Payslips from "./components/worker-dashboard/Payslips";
import WorkerSettings from "./components/worker-dashboard/Settings";
import ChangePassword from "./components/auth/ChangePassword";

function App() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          {import.meta.env.VITE_TEMPO === "true" && (
            <>
              <Route path="/tempobook/*" element={useRoutes(routes)} />
              <Route path="/tempobook/*" />
            </>
          )}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/worker-signin" element={<WorkerSignIn />} />
          <Route path="/care-home-signin" element={<CareHomeSignIn />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/care-home-register"
            element={<CareHomeRegistration />}
          />

          <Route
            path="/care-home-dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="post-shift" element={<PostShift />} />
            <Route path="manage-shifts" element={<ManageShifts />} />
            <Route path="workers" element={<Workers />} />
            <Route path="timesheets" element={<Timesheets />} />
            <Route path="incidents" element={<IncidentReports />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
            path="/care-worker-dashboard/*"
            element={
              <WorkerProtectedRoute>
                <WorkerDashboardLayout />
              </WorkerProtectedRoute>
            }
          >
            <Route path="change-password" element={<ChangePassword />} />
            <Route index element={<WorkerOverview />} />
            <Route path="available-shifts" element={<AvailableShifts />} />
            <Route path="my-shifts" element={<MyShifts />} />
            <Route path="timesheets" element={<WorkerTimesheets />} />
            <Route path="payslips" element={<Payslips />} />
            <Route path="settings" element={<WorkerSettings />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
