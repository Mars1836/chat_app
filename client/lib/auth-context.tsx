"use client";

import apiPath from "@/api_path";
import { User } from "@/types";
import type React from "react";
import socket from "./socket";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for stored user on mount
    const getUser = async () => {
      try {
        const { data: user } = await apiPath.getUser();
        if (user) {
          setUser(user);
        }
        setIsLoading(false);
      } catch (error) {
        setUser(null);
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const login = (userData: User) => {
    console.log("login", userData);
    socket.emit("login", userData.id);
    if (userData) {
      setUser(userData);
    }
  };

  const logout = async () => {
    socket.emit("logout", user?.id);
    await apiPath.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
