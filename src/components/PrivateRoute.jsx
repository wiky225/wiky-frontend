import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wikya-gray-light">
        <div className="text-wikya-blue font-semibold">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
}
