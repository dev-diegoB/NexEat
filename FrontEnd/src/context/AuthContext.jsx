import { createContext, useContext, useState, useEffect } from "react";
import { googleAuth, verify, logout as logoutRequest } from "../api/auth";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signinWithGoogle = async (credential) => {
    try {
      const res = await googleAuth(credential);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      handleApiError(error, "Error al autenticar con Google", setErrors);
    }
  };

  const signout = async () => {
    try {
      await logoutRequest();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

   useEffect(() => {
     const checkLogin = async () => {
       try {
         const res = await verify();
         setIsAuthenticated(true);
         setUser(res.data);
       } catch (error) {
         setIsAuthenticated(false);
         setUser(null);
       } finally {
         setLoading(false);
       }
     };

     checkLogin();
   }, []);



  useAutoClearErrors(errors, setErrors);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        errors,
        signinWithGoogle,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
