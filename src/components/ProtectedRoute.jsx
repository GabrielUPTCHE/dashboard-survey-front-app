import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './ui/Spinner.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <Spinner className="text-4xl" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
