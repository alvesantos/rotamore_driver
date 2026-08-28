import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authTypes";
import type { User } from "./authTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Fallback users for offline frontend development
const FALLBACK_USERS: Record<string, { pass: string; user: User }> = {
  "rogab@admin.com": {
    pass: "r0g4b@2026!",
    user: {
      id: "a0000000-0000-0000-0000-000000000001",
      name: "Rogab",
      lastname: "Admin",
      phone: "11999999999",
      type: "admin",
      email: "rogab@admin.com",
      document: "00000000000",
    },
  },
  "ricberns@gmail.com": {
    pass: "1254101254@Abc",
    user: {
      id: "d0000000-0000-0000-0000-000000000002",
      name: "Ricardo",
      lastname: "Berns",
      phone: "11988888888",
      type: "driver",
      email: "ricberns@gmail.com",
      document: "11111111111",
    },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("rotamore_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("rotamore_token");
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rotamore_user");
    localStorage.removeItem("rotamore_token");
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("rotamore_user", JSON.stringify(data.user));
        } else {
          // Token expired or invalid
          if (!token.startsWith("fallback_token_")) {
            logout();
          }
        }
      } catch (err) {
        console.warn("API offline, mantendo sessão local:", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, logout]);

  const login = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("rotamore_user", JSON.stringify(data.user));
        localStorage.setItem("rotamore_token", data.token);
        return { success: true };
      }

      const errorData = await res.json().catch(() => null);
      if (res.status === 401 || res.status === 400) {
        return {
          success: false,
          error: errorData?.error || "E-mail/celular ou senha incorretos.",
        };
      }
      return {
        success: false,
        error: errorData?.error || `Erro no servidor (${res.status}).`,
      };
    } catch (netErr) {
      console.warn("Falha de rede ao conectar à API. Testando fallback local:", netErr);

      // Fallback local se a API estiver offline
      const normalizedIdentifier = identifier.trim().toLowerCase();
      const matched = Object.entries(FALLBACK_USERS).find(
        ([email, data]) =>
          email.toLowerCase() === normalizedIdentifier ||
          data.user.phone === identifier.replace(/\D/g, "")
      );

      if (matched && matched[1].pass === password) {
        const fallbackUser = matched[1].user;
        const fallbackToken = `fallback_token_${Date.now()}`;
        setUser(fallbackUser);
        setToken(fallbackToken);
        localStorage.setItem("rotamore_user", JSON.stringify(fallbackUser));
        localStorage.setItem("rotamore_token", fallbackToken);
        return { success: true };
      }

      return {
        success: false,
        error: "E-mail/celular ou senha incorretos.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

