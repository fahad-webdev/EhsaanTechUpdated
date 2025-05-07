/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/utils/fetchClient";
import { useMemo } from "react";
import { AuthContextProps } from "@/types/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const shouldRedirect = useMemo(() => token && pathname === "/login", [token, pathname]);
  const publicRoutes = ["/login"];

  const routesToCheck = ["/", "/scene"];
  const isPublicRoute = routesToCheck.some((route) =>
    publicRoutes.includes(route)
  );

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; 
    }
  };

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/");
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken); 
    } else {
   
      setToken(null);
      localStorage.removeItem("token");
      if (!isPublicRoute) {
        router.push("/login"); 
      }
    }
  }, [pathname, isPublicRoute, router]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post(`/sign-in`, {
        email,
        password,
      });

      if (response?.data?.data?.user_access_token) {
        const accessToken = response?.data?.data?.user_access_token;
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        toast.success(response?.data?.message);
        router.push("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const signOut = () => {
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};