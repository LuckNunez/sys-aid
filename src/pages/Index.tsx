import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated, otherwise to dashboard
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return null; // This component will redirect, so no need to render anything
};

export default Index;
