import { createContext } from "react";

export type UserType = "admin" | "driver" | "customer";

export interface User {
  id: string;
  name: string;
  lastname: string;
  phone: string;
  type: UserType;
  email: string;
  document: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

