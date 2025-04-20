import { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth,
  googleProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  onAuthStateChanged,
  signOut
} from '../services/firebase';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const response = await api.post('/auth/google', { token });
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithPhone = async (phoneNumber) => {
    try {
      const appVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
      }, auth);

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      return {
        success: true,
        confirmationResult,
      };
    } catch (error) {
      console.error('Phone login error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyPhoneCode = async (confirmationResult, verificationCode) => {
    try {
      const result = await confirmationResult.confirm(verificationCode);
      const token = await result.user.getIdToken();
      
      const response = await api.post('/auth/phone', { token });
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Phone verification error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await api.post('/auth/logout');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithPhone,
    verifyPhoneCode,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
