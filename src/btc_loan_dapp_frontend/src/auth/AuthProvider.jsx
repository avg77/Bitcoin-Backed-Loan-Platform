import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading flag

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        setIsAuthenticated(true);
        setPrincipal(client.getIdentity().getPrincipal().toText());
      }
      setLoading(false);  // Done loading after auth init
    };
    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: 'https://identity.ic0.app/#authorize',
      onSuccess: () => window.location.reload(),
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    window.location.reload();
  };



  return (
    <AuthContext.Provider value={{ isAuthenticated, principal, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

