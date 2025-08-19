/**
 * Gravix Handles client-side routing for Single Page Applications
 *
 * Features include:
 * - Basic routing
 * - Nested routes
 * - Route prefetching
 * - Lazy loading
 * - Dynamic route parameters
 * - Error handling
 */

import { mount, useMajor, useMinor } from "..";

class Router {
  constructor() {
    // Store for lazy-loaded components to avoid reloading
    this.lazyComponents = new Map();

    // Map to store all registered routes and their configurations
    this.routes = new Map();

    // Track current active route
    this.currentRoute = null;

    // Global error handler function
    this.errorHandler = null;

    // DOM element where components will be mounted
    this.root = null;

    // Handle browser back/forward button navigation
    window.addEventListener("popstate", () => {
      this.handleRoute(window.location.pathname);
    });
  }

  /**
   * Register a global error handler for the router
   * @param {Function} handler - Function to call when errors occur
   * @throws {Error} If handler is not a function
   */
  setErrorHandler(handler) {
    if (typeof handler !== "function") {
      throw new Error("Error handler must be a function");
    }
    this.errorHandler = handler;
  }

  /**
   * Register a basic route with path and component
   * @param {string} path - URL path (e.g., '/home')
   * @param {Function} component - Component render function
   * @throws {Error} If path or component are invalid
   */
  addRoute(path, component) {
    if (typeof path !== "string" || !path) {
      throw new Error("Route path must be a non-empty string");
    }
    if (!component) {
      throw new Error("Component is required for route");
    }
    // Store as static route (immediately available)
    this.routes.set(path, { type: "static", component });
  }

  /**
   * Register a route nested under a parent path
   * @param {string} parentPath - Parent route path (e.g., '/dashboard')
   * @param {string} path - Child route segment (e.g., 'settings')
   * @param {Function} component - Component render function
   * @throws {Error} If paths or component are invalid
   */
  addNestedRoute(parentPath, path, component) {
    if (typeof parentPath !== "string" || !parentPath) {
      throw new Error("Parent path must be a non-empty string");
    }
    if (typeof path !== "string" || !path) {
      throw new Error("Child path must be a non-empty string");
    }
    if (!component) {
      throw new Error("Component is required for nested route");
    }
    // Combine parent and child paths
    this.routes.set(`${parentPath}/${path}`, { type: "static", component });
  }

  /**
   * Register route with data prefetching capability
   * @param {string} path - Route path
   * @param {Function} component - Component that accepts prefetched data
   * @param {Function} preFetch - Async function to fetch data
   * @throws {Error} If any parameter is invalid
   */
  addRouteWithPrefetch(path, component, preFetch) {
    if (typeof path !== "string" || !path) {
      throw new Error("Route path must be a non-empty string");
    }
    if (!component) {
      throw new Error("Component is required for route");
    }
    if (typeof preFetch !== "function") {
      throw new Error("preFetch must be a function");
    }

    const [data, setData] = useMinor([]);
    const [error, setError] = useMinor({});
    const [load, setLoad] = useMinor(true);

    useMajor(async () => {
      try {
        // Execute the preFetch function
        const resp = await preFetch();

        if (resp.length > 0) {
          setData(resp);
          setLoad(false);
        }
      } catch (err) {
        setError({
          errorMessage: "Failed to load data",
          errorDetails: err?.message,
        });
      }
    }, []);

    // Store route with data-injected & error handling component
    this.routes.set(path, {
      type: "prefetch",
      component: () =>
        component({
          data,
          error,
          load,
        }),
    });
  }

  /**
   * Register route with lazy-loaded component
   * @param {string} path - Route path
   * @param {Function} loader - Function returning Promise that resolves to component
   * @throws {Error} If path or loader are invalid
   */
  async addLazyRoute(path, loader) {
    if (typeof path !== "string" || !path) {
      throw new Error("Route path must be a non-empty string");
    }
    if (typeof loader !== "function") {
      throw new Error("Loader must be a function that returns a Promise");
    }
    // Mark route as lazy-loaded (will load when first accessed)
    this.routes.set(path, { type: "lazy", loader });
  }

  /**
   * Programmatically navigate to a route
   * @param {string} path - Destination path
   */
  navigate(path) {
    if (typeof path !== "string" || !path) {
      this.handleError(
        new Error("Navigation path must be a non-empty string"),
        "Navigation error"
      );
      return;
    }
    // Update browser history
    window.history.pushState({}, "", path);
    // Handle the route change
    this.handleRoute(path);
  }

  /**
   * Internal method to handle route changes and component rendering
   * @param {string} path - Path to handle
   */
  async handleRoute(path) {
    if (!path) {
      this.handleError(
        new Error("Path is required for route handling"),
        "Route handling error"
      );
      return;
    }

    let route = this.routes.get(path);
    let params = {};

    // Check for dynamic routes with parameters if no exact match
    if (!route) {
      for (const [routePath, routeData] of this.routes) {
        if (routePath === "*") continue; // Skip wildcard during matching

        const paramNames = [];
        // Convert route path to regex pattern (e.g., '/user/:id' => '/user/([^/]+)')
        const regexPattern = routePath.replace(/:\w+/g, (match) => {
          paramNames.push(match.substring(1)); // Extract parameter name
          return "([^/]+)"; // Capture group for actual value
        });

        const regex = new RegExp(`^${regexPattern}$`);
        const match = path.match(regex);

        // Check if path matches and has same segment count
        if (match && path.split("/").length === routePath.split("/").length) {
          // Extract parameter values from URL
          params = paramNames.reduce((acc, name, index) => {
            acc[name] = match[index + 1];
            return acc;
          }, {});
          route = routeData;
          break;
        }
      }
    }

    // Fallback to wildcard route if no match found
    if (!route) {
      route = this.routes.get("*");
    }

    if (route && this.root) {
      this.currentRoute = path;
      const prevContent = this.root.innerHTML;
      this.root.innerHTML = ""; // Clear previous content

      try {
        let componentToRender;

        // Handle different route types
        switch (route.type) {
          case "lazy":
            // Load component if not already cached
            if (!this.lazyComponents.has(path)) {
              const loaded = await route.loader();
              this.lazyComponents.set(path, loaded.default || loaded);
            }
            componentToRender = this.lazyComponents.get(path);
            break;

          case "prefetch":
          case "static":
          default:
            componentToRender = route.component;
            break;
        }

        // Mount the component with any route parameters
        mount(componentToRender(params), this.root);
      } catch (error) {
        // Restore previous content if mounting fails
        this.handleError(error, "Component mounting failed");
        this.root.innerHTML = prevContent;
      }
    } else if (!route) {
      this.handleError(
        new Error(`No route found for path: ${path}`),
        "Route not found"
      );
    }
  }

  /**
   * Centralized error handling
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  handleError(error, context) {
    if (this.errorHandler) {
      try {
        this.errorHandler(error, context);
      } catch (err) {
        console.error("Error handler failed:", err);
      }
    } else {
      // Default error logging if no handler set
      console.error(`[${context}]`, error);
    }
  }

  /**
   * Initialize the router with root mounting element
   * @param {string} rootId - ID of DOM element to mount components (default: 'root')
   */
  start(rootId = "root") {
    try {
      this.root = document.getElementById(rootId);
      if (!this.root) {
        throw new Error(`Root element with ID '${rootId}' not found`);
      }
      // Handle initial route based on current URL
      this.handleRoute(window.location.pathname);
    } catch (error) {
      this.handleError(error, "Router initialization failed");
    }
  }
}

// Export singleton router instance
export const router = new Router();
