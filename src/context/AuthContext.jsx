import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // user shape: { email: string, role: string }
  // No persiste entre recargas — el usuario debe volver a autenticarse.
  // TODO: cuando el backend exponga GET /api/auth/verify o /api/users/me,
  // agregar useEffect que llame ese endpoint para restaurar sesión automáticamente.
  // Al hacerlo, setIsLoading(true) al inicio y setIsLoading(false) al terminar.

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
