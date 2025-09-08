// Improved authentication check with token validation
export const useAuth = () => {
  const token = localStorage.getItem("token");
  
  // Check if token exists
  if (!token) return false;
  
  // Basic JWT format validation (should have 3 parts separated by dots)
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    // Invalid token format, clean up
    localStorage.removeItem("token");
    localStorage.removeItem("ownerToken"); 
    localStorage.removeItem("user");
    return false;
  }
  
  // Check if token is expired (basic check without verifying signature)
  try {
    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, clean up
      localStorage.removeItem("token");
      localStorage.removeItem("ownerToken");
      localStorage.removeItem("user");
      return false;
    }
  } catch (error) {
    // Invalid token payload, clean up
    localStorage.removeItem("token");
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("user");
    return false;
  }
  
  return true;
};

export const userGetRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role || null;
  } catch (error) {
    return null;
  }
};

export const userGetData = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};

export const calculatePercentage = (total, obtain) => {
  return (obtain / total) * 100;
};