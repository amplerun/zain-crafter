import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    accentColor: '#FFE66D'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await api.get('/settings');
        const { primaryColor, secondaryColor, accentColor } = response.data;
        setTheme({ primaryColor, secondaryColor, accentColor });
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTheme();
  }, []);

  const updateTheme = async (newTheme) => {
    try {
      await api.put('/settings', newTheme);
      setTheme(newTheme);
      return { success: true };
    } catch (error) {
      console.error('Error updating theme:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    theme,
    updateTheme,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {!loading && children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
