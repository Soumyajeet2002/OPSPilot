import { createContext, useContext } from "react";
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
export interface LoginValues {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface AuthContextValue {
  user: User | null;
  notice: string;
  login: (values: LoginValues) => Promise<void>;
  endSession: () => void;
}
export const AuthContext = createContext<AuthContextValue | null>(null);
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
}
