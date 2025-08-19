import { router } from "./router";
import { useMajor, useMinor } from "../hooks";

/**
 * Hook for programmatic navigation
 * @returns {Function} Navigate function that accepts a path
 * @example
 * const navigate = useNavigate();
 * navigate('/profile');
 */
export function useNavigate() {
  // Return a function that delegates to router.navigate
  return (path) => router.navigate(path);
}

/**
 * Hook to access current route information
 * @returns {Object} Contains path, segments, and params
 * @property {string} path - Current route path
 * @property {Array<string>} segments - Route path segments
 * @property {Object} params - Route parameters
 */
export function useRoute() {
  // Use state to track current route
  const [route, setRoute] = useMinor(
    router.currentRoute || window.location.pathname
  );

  // Subscribe to route changes
  useMajor(() => {
    const handleRouteChange = () => {
      setRoute(router.currentRoute || window.location.pathname);
    };

    // Listen to browser history changes
    window.addEventListener("popstate", handleRouteChange);

    // Cleanup listener on unmount
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return {
    path: route,
    segments: route.split("/").filter(Boolean),
    params: {}, // Would be enhanced with actual param detection
  };
}

/**
 * Authentication guard for protected routes
 * @param {string} redirectOnSuccess - Path to redirect if authenticated
 * @param {string} redirectOnFail - Path to redirect if not authenticated
 * @returns {boolean} Current authentication status
 * @throws {Error} If redirect paths are invalid
 */
export function useAuthGuard(redirectOnSuccess, redirectOnFail) {
  // Check authentication status
  const isAuthenticated = () => {
    try {
      const userCredential = localStorage.getItem("userCredential");
      return !!userCredential && userCredential !== "null";
    } catch (error) {
      return false;
    }
  };

  // Validate redirect paths
  if (typeof redirectOnSuccess !== "string" || !redirectOnSuccess) {
    throw new Error("redirectOnSuccess must be a non-empty string");
  }

  if (typeof redirectOnFail !== "string" || !redirectOnFail) {
    throw new Error("redirectOnFail must be a non-empty string");
  }

  // Handle redirection based on auth status
  if (isAuthenticated()) {
    router.navigate(redirectOnSuccess);
    return true;
  }

  router.navigate(redirectOnFail);
  return false;
}

export * from "./router";
