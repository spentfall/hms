import { useAuth } from '../auth/AuthContext';
import { AdminHome } from '../admin/AdminHome';
import { DoctorHome } from '../doctor/DoctorHome';
import PatientHome from '../patient/PatientHome';

export function Home() {
    const { user } = useAuth();

    if (user?.role === 'ADMIN') return <AdminHome />;
    if (user?.role === 'DOCTOR') return <DoctorHome />;
    if (user?.role === 'PATIENT') return <PatientHome />;

    return <div>Loading...</div>;
}
