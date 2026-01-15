import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './features/auth/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { ProfileRedirect } from './features/auth/ProfileRedirect';
import { ProfileEdit } from './features/auth/ProfileEdit';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './features/home/Home';
import { DoctorList } from './features/doctors/DoctorList';
import { DoctorProfile } from './features/doctors/DoctorProfile';
import { PatientList } from './features/patient/PatientList';
import { PatientProfile } from './features/patient/PatientProfile';
import { AppointmentList } from './features/appointments/AppointmentList';
import { BillingList } from './features/billing/BillingList';
import { PaymentSuccess } from './features/billing/PaymentSuccess';
import { PaymentFailure } from './features/billing/PaymentFailure';


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route
                  path="doctors"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <DoctorList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="doctors/:id"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                      <DoctorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="patients"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                      <PatientList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="patients/:id"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
                      <PatientProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="appointments" element={<AppointmentList />} />
                <Route path="billing" element={<BillingList />} />
                <Route path="billing/payment/success" element={<PaymentSuccess />} />
                <Route path="billing/payment/failure" element={<PaymentFailure />} />
                <Route path="profile" element={<ProfileRedirect />} />
                <Route path="profile/edit" element={<ProfileEdit />} />
                {/* Add other protected routes here */}
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
