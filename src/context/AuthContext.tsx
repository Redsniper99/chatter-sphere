"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  [key: string]: any; // To allow other user fields if needed
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if the user is already logged in when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You can decode the token to get user data, or fetch user info from the server
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user profile");

      const userData = await res.json();
      setUser(userData); // Save user data including the user ID in context
    } catch (err) {
      console.error("Error fetching user profile:", err);
      localStorage.removeItem("token");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Set user data in context (including user ID)
      setUser(data.user);

      // Redirect to the home page or dashboard
      router.push("/home");
    } catch (err: any) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
