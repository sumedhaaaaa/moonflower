import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const API_BASE = process.env.REACT_APP_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("moonflower_token");

      const res = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data?.username ? data : null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("moonflower_token", token);

      // Remove the token from the browser URL
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("moonflower_token") || ""
          }`,
        },
      });
    } catch {
      // Clear local state even if the request fails.
    }

    localStorage.removeItem("moonflower_token");
    setUser(null);
  }, []);

  // Use this instead of raw fetch() for any request that needs to know who's logged in.
  // Attaches the JWT (Google login) when one exists, and always sends the session cookie too.
  const authFetch = useCallback((url, options = {}) => {
    const token = localStorage.getItem("moonflower_token");
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        refreshUser,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}