import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SERVER_URL, DEBUG } from "../config/conf";

export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null to represent initial loading state
  const [user, setUser] = useState({});
  const [authenticating, setAuthenticating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch and verify JWT tokens from your API
    async function verifyTokens() {
      setAuthenticating(true);
      try {
        const response = await fetch(`${SERVER_URL}/verify`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true); // Tokens are valid
          const re = await response.json();
          setUser(re?.user);
          console.log(re);
        } else {
          setIsAuthenticated(false); // Tokens are not valid
          router.push("/login"); // Redirect to the login page
        }
      } catch (error) {
        if (DEBUG) console.error("Authentication error:", error);
        setIsAuthenticated(false);
        router.push("/login"); // Redirect to the login page on error
      }
      setAuthenticating(false);
    }

    verifyTokens();
  }, []);

  return { isAuthenticated, user, authenticating };
}
