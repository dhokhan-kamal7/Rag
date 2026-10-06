import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getCurrentUser,
  isAuthenticated,
  loginUser,
  logoutUser,
  registerUser
} from "../services/authService";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(
    isAuthenticated()
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    isAuthenticated()
  );


  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
        setAuthenticated(true);
      } catch {
        logoutUser();
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);


  const login = async (email, password) => {
    await loginUser(
      email,
      password
    );

    const currentUser = await getCurrentUser();

    setUser(currentUser);
    setAuthenticated(true);

    return currentUser;
  };


  const register = async (email, password) => {
    return registerUser(
      email,
      password
    );
  };


  const logout = () => {
    logoutUser();

    setUser(null);
    setAuthenticated(false);
  };


  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        isAdmin: user?.is_admin === true,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}