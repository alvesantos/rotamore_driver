import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authTypes";
import type { User } from "./authTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("rotamore_driver_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("rotamore_driver_token");
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rotamore_driver_user");
    localStorage.removeItem("rotamore_driver_token");
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Client-Type": "driver",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user?.type !== "driver") {
            logout();
          } else {
            setUser(data.user);
            localStorage.setItem("rotamore_driver_user", JSON.stringify(data.user));
          }
        } else {
          logout();
        }
      } catch (err) {
        console.error("Erro ao verificar sessão com o servidor:", err);
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
          "X-Client-Type": "driver",
        },
        body: JSON.stringify({
          identifier,
          password,
          client_type: "driver",
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.token && data?.user) {
        if (data.user.type !== "driver") {
          return {
            success: false,
            error: "Acesso restrito: apenas motoristas parceiros podem entrar neste aplicativo.",
          };
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("rotamore_driver_user", JSON.stringify(data.user));
        localStorage.setItem("rotamore_driver_token", data.token);
        return { success: true };
      }

      return {
        success: false,
        error: data?.error || `Erro ao efetuar login (${res.status}).`,
      };
    } catch (netErr) {
      console.error("Falha de conexão com a API:", netErr);
      return {
        success: false,
        error: "Não foi possível conectar ao servidor. Certifique-se de que o backend está em execução.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && user.type === "driver",
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
