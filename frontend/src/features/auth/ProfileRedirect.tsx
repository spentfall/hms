import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProfileRedirect() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'ADMIN') {
        return <Navigate to="/profile/edit" replace />;
    }

    if (user.role === 'DOCTOR' && user.profileId) {
        return <Navigate to={`/doctors/${user.profileId}`} replace />;
    }

    if (user.role === 'PATIENT' && user.profileId) {
        return <Navigate to={`/patients/${user.profileId}`} replace />;
    }

    // fallback if no profileId found
    return <Navigate to="/" replace />;
}
