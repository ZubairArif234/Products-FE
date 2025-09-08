import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '../services/hooks';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    lastCheck: 0
  });
  
  const checkAuth = useAuth();
  const mountedRef = useRef(true);
  const checkIntervalRef = useRef(null);
  
  // Listen for logout events and immediately update state
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      const isAuthenticated = !!token;
      
      setAuthState(prev => ({
        isAuthenticated,
        isLoading: false,
        lastCheck: Date.now()
      }));
    };
    
    // Check immediately
    handleAuthChange();
    
    // Listen for auth changes (login/logout)
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);
  
  useEffect(() => {
    mountedRef.current = true;
    
    const updateAuthState = () => {
      const now = Date.now();
      
      // Prevent multiple checks within 3 seconds
      if (now - authState.lastCheck < 3000) {
        return;
      }
      
      const newAuthState = {
        isAuthenticated: checkAuth,
        isLoading: false,
        lastCheck: now
      };
      
      // Only update if component is still mounted and state actually changed
      if (mountedRef.current && (
        newAuthState.isAuthenticated !== authState.isAuthenticated ||
        newAuthState.isLoading !== authState.isLoading
      )) {
        setAuthState(newAuthState);
      }
    };
    
    // Initial check
    updateAuthState();
    
    // Set up interval for periodic checks (every 60 seconds)
    checkIntervalRef.current = setInterval(updateAuthState, 60000);
    
    return () => {
      mountedRef.current = false;
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkAuth, authState.lastCheck]);
  
  const value = {
    ...authState,
    // Add method to force refresh if needed
    refreshAuth: () => {
      setAuthState(prev => ({ ...prev, lastCheck: 0 }));
    },
    // Add method to force logout
    logout: () => {
      // Clear all data
      localStorage.removeItem("token");
      localStorage.removeItem("ownerToken");
      localStorage.removeItem("user");
      
      // Immediately update local state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        lastCheck: Date.now()
      });
      
      // Force a small delay to ensure all components are updated
      setTimeout(() => {
        // Notify other components
        window.dispatchEvent(new Event('authChange'));
      }, 100);
    }
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};