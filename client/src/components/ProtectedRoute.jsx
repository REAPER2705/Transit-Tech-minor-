import { Navigate } from 'react-router-dom';
import authStore from '../store/authStore';

export default function ProtectedRoute({ children, roles }) {
  const { user } = authStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.some(role => user.roles?.includes(role))) {
    return <Navigate to="/login" />;
  }

  return children;
}
