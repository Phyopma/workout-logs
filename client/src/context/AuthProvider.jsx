import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("[AuthProvider] Fetching user profile...");
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("[AuthProvider] No token found");
        return null;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.log("[AuthProvider] Invalid token or server error");
          localStorage.removeItem("token");
          return null;
        }

        const userData = await response.json();
        console.log(
          "[AuthProvider] User profile fetched successfully:",
          userData
        );
        return userData;
      } catch (error) {
        console.error("[AuthProvider] Error fetching user profile:", error);
        localStorage.removeItem("token");
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
      queryClient.setQueryData(["user"], user);
      console.log("[AuthProvider] Auth state updated:", {
        user,
        isLoading,
        currentPath: location.pathname,
      });

      // Redirect logged-in users away from auth routes
      if (
        user &&
        (location.pathname === "/login" || location.pathname === "/register")
      ) {
        console.log(
          "[AuthProvider] Redirecting authenticated user from auth route to home"
        );
        navigate("/");
      }
    }
  }, [user, isLoading, queryClient, navigate, location]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
