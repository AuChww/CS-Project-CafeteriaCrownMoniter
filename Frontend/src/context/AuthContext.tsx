"use client"
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

// Interface สำหรับข้อมูลที่เราจะเก็บใน context
interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

// กำหนด type ของ children ให้กับ component
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider ที่จะใช้ให้ทุกหน้าเข้าถึงได้
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // โหลด token และ role จาก localStorage เมื่อเริ่มต้น
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("authRole");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authRole", role);
    setToken(token);
    setRole(role);
    
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    setToken(null);
    setRole(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
