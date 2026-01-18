// src/utils/auth.js

export const setAuthData = (token, user, doctor) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  if (doctor) {
    localStorage.setItem("doctor", JSON.stringify(doctor));
    console.log(doctor)
  }
};


// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get logged-in user details (safe parse)
export const getUser = () => {
  const userData = localStorage.getItem("user");
  try {
    if (!userData || userData === "undefined" || userData === "null") {
      return null;
    }
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Remove token & user data (logout)
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if logged in
export const isAuthenticated = () => {
  return !!getToken();
};

// Check if user has a specific role
export const hasRole = (role) => {
  const user = getUser();
  return user?.role === role;
};
