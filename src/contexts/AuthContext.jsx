import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  
  const checkAuth = useAuth(); // Assuming this returns a function
  const mountedRef = useRef(true);
  const checkIntervalRef = useRef(null);
  
  // Memoized function to check authentication
  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      const isTokenValid = !!token;
      
      // If checkAuth is a function, call it; if it's a boolean, use it directly
      const authResult = typeof checkAuth === 'function' ? checkAuth() : checkAuth;
      
      return isTokenValid && authResult;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  }, [checkAuth]);
  
  // Main auth state management
  useEffect(() => {
    let timeoutId;
    
    const updateAuthState = () => {
      const now = Date.now();
      
      // Prevent multiple checks within 3 seconds
      if (now - authState.lastCheck < 3000) {
        return;
      }
      
      const isAuthenticated = checkAuthStatus();
      
      setAuthState(prevState => {
        // Only update if state actually changed
        if (prevState.isAuthenticated !== isAuthenticated || prevState.isLoading) {
          return {
            isAuthenticated,
            isLoading: false,
            lastCheck: now
          };
        }
        return prevState;
      });
    };
    
    // Initial check with small delay to prevent race conditions
    timeoutId = setTimeout(updateAuthState, 100);
    
    // Set up interval for periodic checks (every 60 seconds)
    checkIntervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        updateAuthState();
      }
    }, 60000);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkAuthStatus]); // Remove authState.lastCheck from dependencies
  
  // Listen for auth change events
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      const isAuthenticated = !!token && checkAuthStatus();
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated,
        isLoading: false,
        lastCheck: Date.now()
      }));
    };
    
    // Listen for auth changes (login/logout)
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [checkAuthStatus]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const value = {
    ...authState,
    // Add method to force refresh
    refreshAuth: useCallback(() => {
      setAuthState(prev => ({ ...prev, lastCheck: 0 }));
    }, []),
    // Add method to force logout
    logout: useCallback(() => {
      // Clear all data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Immediately update local state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        lastCheck: Date.now()
      });
      
      // Notify other components after a small delay
      setTimeout(() => {
        window.dispatchEvent(new Event('authChange'));
      }, 100);
    }, [])
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};