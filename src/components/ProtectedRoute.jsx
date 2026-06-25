import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if the token exists in localStorage (returns true or false)
  const isAuthenticated = !!localStorage.getItem("token"); 

  if (!isAuthenticated) {
    // Redirect to login, but save the current URL in state so we can return here later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;