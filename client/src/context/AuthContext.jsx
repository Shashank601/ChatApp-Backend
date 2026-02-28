import { createContext, useContext, useEffect, useState } from 'react';
import { me } from '../api/users.api';
import { getToken, clearToken } from '../utils/token';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    me()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const newToken = e.newValue;
        const currentToken = getToken();
        
        // If token changed in another tab
        if (newToken !== currentToken) {
          if (newToken) {
            // Another tab logged in as different user
            clearToken();
            setUser(null);
            navigate('/login');
          } else {
            // Another tab logged out
            clearToken();
            setUser(null);
            navigate('/login');
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  if (loading) {
    return null; // or a loader component
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};