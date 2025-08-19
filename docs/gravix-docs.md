# Gravix Library Documentation

This comprehensive developer reference provides detailed documentation for the Gravix library, a lightweight JavaScript UI library with virtual DOM implementation. Each section includes detailed API references, implementation details, and practical usage examples to help you build efficient web applications.

## Navigation

This document is organized by module category and file path. Each entry includes:

- **Purpose**: The module's primary function within the library
- **Exports**: Public API elements exposed by the module
- **Implementation Notes**: Key internal behaviors and technical details
- **Usage Examples**: Practical code snippets demonstrating proper implementation
- **Caveats**: Important limitations and considerations when using the module

## Table of Contents

### Core Library

- [Core Library (`index.js`)](#core-indexjs)

### Component Lifecycle and State Management

- [Hooks API (`hooks/index.js`)](#hooks-indexjs)
- [Context System (`hooks/context.js`)](#hooks-contextjs)
- [Asynchronous Operations (`hooks/async.js`)](#hooks-asyncjs)
- [Performance Optimization (`hooks/performance.js`)](#hooks-performancejs)
- [Utility Hooks (`hooks/utility.js`)](#hooks-utilityjs)

### Routing and Navigation

- [Router Engine (`routes/router.js`)](#routes-routerjs)
- [Routing Hooks (`routes/index.js`)](#routes-indexjs)

### State Management

- [Global Store (`store/index.js`)](#store-indexjs)

### Utility Modules

- [Utilities Index (`utils/index.js`)](#utils-indexjs)
- [Element Builder (`utils/elements/builder.js`)](#utils-elements-builderjs)
- [HTML Element Helpers (`utils/elements/elements.js`)](#utils-elements-elementsjs)
- [API Client (`utils/api/index.js`)](#utils-api-indexjs)
- [Image Optimization (`utils/image/index.js`)](#utils-image-indexjs)
- [Form Validation (`utils/validation/index.js`)](#utils-validation-indexjs)

### Vite Integration

- [Vite Config Generator (`vite/index.js`)](#vite-indexjs)
- [Configuration Constants (`vite/config/constants.js`)](#vite-config-constantsjs)
- [Logging System (`vite/config/logger.js`)](#vite-config-loggerjs)
- [Directory Watcher (`vite/config/watcher.js`)](#vite-config-watcherjs)
- [Utility Helpers (`vite/utils/helpers.js`)](#vite-utils-helpersjs)
- [Path Aliases (`vite/utils/aliases.js`)](#vite-utils-aliasesjs)
- [Bundle Analysis (`vite/plugins/bundleAnalyzer.js`)](#vite-plugins-bundleanalyzerjs)

### Package Configuration

- [NPM Package Configuration (`package.json`)](#packagejson)

### Information's

- [License](#license)
- [Support and Community](#support-and-community)
- [Author](#author)

---

## Core Library

### Core: `index.js`

<a id="core-indexjs"></a>

**Purpose**: Provides the foundation of the Gravix library, defining the virtual DOM implementation, component architecture, and rendering pipeline.

**Exports**:

- `createElement(type, props?, ...children)`: Creates virtual DOM elements
- `Component`: Base class for creating stateful components
- `mount(component, container)`: Renders components to the DOM
- Re-exports element builders and hooks from their respective modules

**Key Implementation Details**:

- The `VirtualDOM` system supports both function components and string elements (HTML tags)
- Event handling uses standardized `on*` prop naming convention for DOM events
- Style objects are automatically processed and applied as inline styles
- The component lifecycle includes mount, update, and unmount hooks with error boundaries

**Usage Example**:

```javascript
import { createElement, Component, mount } from "gravix";

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const { product } = this.props;
    const { isExpanded } = this.state;

    return createElement(
      "div",
      { className: "product-card" },
      createElement("h3", null, product.name),
      createElement(
        "p",
        { className: "price" },
        `$${product.price.toFixed(2)}`
      ),
      createElement(
        "button",
        {
          onClick: this.toggleDetails,
          className: "details-toggle",
        },
        isExpanded ? "Hide Details" : "Show Details"
      ),
      isExpanded &&
        createElement(
          "div",
          { className: "product-details" },
          createElement("p", null, product.description),
          createElement("p", null, `SKU: ${product.sku}`)
        )
    );
  }
}

// Mount the component to the DOM
mount(
  new ProductCard({
    product: {
      name: "Wireless Headphones",
      price: 79.99,
      description: "Premium wireless headphones with noise cancellation",
      sku: "WH-NC100",
    },
  }),
  document.getElementById("product-container")
);
```

**Caveats**:

- When using hooks with functional components, ensure components are mounted using Gravix's `mount` function to properly establish the hook context
- Avoid manipulating the DOM directly in components; use the virtual DOM API instead

---

## Component Lifecycle and State Management

### Hooks: `hooks/index.js`

<a id="hooks-indexjs"></a>

**Purpose**: Provides the core hook system for managing component state, side effects, and memoization in functional components.

**Exports**:

- State Management: `useMinor(initialValue)` → `[state, setState]`
- Effect Hooks: `useMajor(callback, deps)`, `useLayoutMajor(callback, deps)`
- Reference Storage: `useEcho(initialValue)`
- Memoization: `useMemo(factory, deps)`, `useCallback(callback, deps)`
- Internal Engine: `setCurrentComponent`, `cleanupComponent`
- Re-exports from other hook modules

**Implementation Notes**:

- Maintains component-scoped state through internal maps keyed by component reference
- State updates trigger component re-renders through the virtual DOM system
- Effect dependencies are compared by reference to determine when to re-execute effects
- Internal component tracking ensures proper hook initialization and cleanup

**Usage Example**:

```javascript
import { createElement } from "gravix";
import { useMinor, useMajor, useEcho } from "gravix/hooks";

function AnalyticsTracker({ pageId }) {
  // State for view count
  const [viewCount, setViewCount] = useMinor(0);

  // Reference to track initial load time
  const loadTimeRef = useEcho(Date.now());

  // Effect to track page views and session duration
  useMajor(() => {
    // Track page view on mount
    const analyticsData = {
      pageId,
      timestamp: Date.now(),
      sessionId: localStorage.getItem("sessionId") || generateSessionId(),
    };

    // Send page view to analytics service
    const controller = new AbortController();
    fetch("/api/analytics/pageview", {
      method: "POST",
      body: JSON.stringify(analyticsData),
      signal: controller.signal,
    }).then(() => setViewCount((c) => c + 1));

    // Clean up function runs on unmount or when deps change
    return () => {
      // Track session duration
      const duration = Date.now() - loadTimeRef.current;
      fetch("/api/analytics/session-end", {
        method: "POST",
        body: JSON.stringify({
          pageId,
          duration,
          sessionId: localStorage.getItem("sessionId"),
        }),
      });
      controller.abort();
    };
  }, [pageId]); // Re-run when pageId changes

  return createElement(
    "div",
    { className: "analytics-debug" },
    createElement("span", null, `Page views: ${viewCount}`)
  );
}

function generateSessionId() {
  const id = Math.random().toString(36).substring(2);
  localStorage.setItem("sessionId", id);
  return id;
}
```

**Caveats**:

- Hook calls must follow React-like rules: only call hooks at the top level of components, not inside conditionals or loops
- The component reference must remain stable between renders for hooks to maintain their state

---

### Hooks: `hooks/context.js`

<a id="hooks-contextjs"></a>

**Purpose**: Implements a lightweight context system for sharing state across component trees.

**Exports**:

- `createClouds(defaultValue)`: Creates a new context with the specified default value
- `useClouds(context)`: Provides access to a context's value with `get()` and `set()` methods

**Implementation Notes**:

- Uses a global internal map with Symbol keys to maintain isolation between contexts
- Simple get/set API without provider/consumer pattern for lightweight implementation

**Usage Example**:

```javascript
import { createElement } from "gravix";
import { createClouds, useClouds } from "gravix/hooks";

// Create a context for theme management
const ThemeContext = createClouds({
  mode: "light",
  primaryColor: "#0066cc",
  textColor: "#333333",
});

function ThemeProvider({ children }) {
  const { get, set } = useClouds(ThemeContext);

  const toggleTheme = () => {
    const currentTheme = get();
    const newTheme =
      currentTheme.mode === "light"
        ? {
            mode: "dark",
            primaryColor: "#4d94ff",
            textColor: "#ffffff",
          }
        : {
            mode: "light",
            primaryColor: "#0066cc",
            textColor: "#333333",
          };
    set(newTheme);
  };

  return createElement(
    "div",
    { className: `theme-${get().mode}` },
    createElement(
      "button",
      {
        onClick: toggleTheme,
        className: "theme-toggle",
      },
      `Switch to ${get().mode === "light" ? "Dark" : "Light"} Mode`
    ),
    children
  );
}

function ThemedComponent() {
  const { get } = useClouds(ThemeContext);
  const theme = get();

  return createElement(
    "div",
    {
      style: {
        color: theme.textColor,
        backgroundColor: theme.mode === "light" ? "#ffffff" : "#222222",
        padding: "20px",
        transition: "all 0.3s ease",
      },
    },
    createElement(
      "h2",
      {
        style: { color: theme.primaryColor },
      },
      "Themed Content"
    ),
    createElement("p", null, "This content adapts to the current theme.")
  );
}
```

**Caveats**:

- Changes to context values affect all consumers immediately
- No hierarchical overrides like React's context system; use carefully in large applications

---

### Hooks: `hooks/async.js`

<a id="hooks-asyncjs"></a>

**Purpose**: Simplifies handling asynchronous operations within functional components.

**Exports**:

- `useAsync(asyncFunction, deps = [])`: Manages loading, error, and data states for async operations

**Implementation Details**:

- Tracks loading state during async execution
- Safely handles promise resolution and errors
- Re-runs when dependencies change

**Usage Example**:

```javascript
import { createElement } from "gravix";
import { useAsync } from "gravix/hooks";

function UserProfile({ userId }) {
  const { loading, error, data } = useAsync(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return response.json();
  }, [userId]);

  if (loading) {
    return createElement(
      "div",
      { className: "loading-spinner" },
      createElement("span", null, "Loading user data...")
    );
  }

  if (error) {
    return createElement(
      "div",
      { className: "error-message" },
      createElement("h3", null, "Error Loading Profile"),
      createElement("p", null, error.message),
      createElement(
        "button",
        {
          onClick: () => window.location.reload(),
        },
        "Retry"
      )
    );
  }

  return createElement(
    "div",
    { className: "user-profile" },
    createElement("img", {
      src: data.avatarUrl,
      alt: `${data.name}'s avatar`,
      className: "profile-avatar",
    }),
    createElement("h2", null, data.name),
    createElement("p", { className: "user-email" }, data.email),
    createElement(
      "div",
      { className: "user-stats" },
      createElement(
        "span",
        null,
        `Member since: ${new Date(data.joinDate).toLocaleDateString()}`
      ),
      createElement("span", null, `Posts: ${data.postCount}`)
    )
  );
}
```

---

### Hooks: `hooks/performance.js`

<a id="hooks-performancejs"></a>

**Purpose**: Provides performance optimization utilities and caching mechanisms.

**Exports**:

- `Cache`: Class implementing a size-bounded cache with LRU eviction
- `cache`: Global singleton cache instance (limited to 100 entries)
- `useThrottle(value, delay)`: Limits value updates to specified intervals
- `useDebounce(value, delay)`: Delays value updates until specified inactivity period

**Implementation Notes**:

- `Cache` uses an internal Map with controlled growth and oldest-entry eviction
- Throttling and debouncing help reduce unnecessary renders and API calls

**Usage Example**:

```javascript
import { createElement } from "gravix";
import { useMinor, useCallback } from "gravix/hooks";
import { useDebounce, useThrottle } from "gravix/hooks/performance";

function SearchComponent() {
  const [query, setQuery] = useMinor("");
  const [results, setResults] = useMinor([]);
  const [isSearching, setIsSearching] = useMinor(false);

  // Debounce the search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 500);

  // Throttle UI updates for search status
  const throttledSearching = useThrottle(isSearching, 300);

  // Search function
  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Effect to trigger search when debounced query changes
  useMajor(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return createElement(
    "div",
    { className: "search-container" },
    createElement(
      "div",
      { className: "search-input-wrapper" },
      createElement("input", {
        type: "text",
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: "Search products...",
        className: "search-input",
      }),
      throttledSearching &&
        createElement("span", { className: "search-indicator" }, "Searching...")
    ),
    createElement(
      "div",
      { className: "search-results" },
      results.length === 0 && debouncedQuery
        ? createElement("p", null, "No results found")
        : results.map((result) =>
            createElement(
              "div",
              { key: result.id, className: "search-result-item" },
              createElement("h3", null, result.title),
              createElement("p", null, result.description)
            )
          )
    )
  );
}
```

---

### Hooks: `hooks/utility.js`

<a id="hooks-utilityjs"></a>

**Purpose**: Collection of specialized utility hooks for common UI programming patterns.

**Exports**:

- `useImperativeHandle(ref, init, deps)`: Exposes methods to parent components via refs
- `useDebugValue(value, format?)`: Enhances development-time debugging
- `useId()`: Generates stable, unique identifiers for accessibility and labels
- `useDeepCompareEffect(callback, dependencies)`: Runs effects based on deep equality comparison

**Implementation Notes**:

- `useDeepCompareEffect` performs recursive object comparison for dependency checking
- `useId` generates prefixed IDs with incremental counters for uniqueness

**Usage Example**:

```javascript
import { createElement } from "gravix";
import { useMinor, useEcho } from "gravix/hooks";
import {
  useImperativeHandle,
  useId,
  useDeepCompareEffect,
} from "gravix/hooks/utility";

function ComplexForm({ onSubmit, initialData, parentRef }) {
  const [formState, setFormState] = useMinor(initialData);
  const formId = useId();
  const inputRef = useEcho(null);

  // Expose methods to parent component
  useImperativeHandle(
    parentRef,
    () => ({
      resetForm: () => setFormState(initialData),
      validateForm: () => validateFormData(formState),
      focusFirstInput: () => inputRef.current?.focus(),
    }),
    [initialData, formState]
  );

  // Use deep comparison for complex objects
  useDeepCompareEffect(() => {
    console.log("Form data changed significantly");
    // Perform expensive validation or side effect
    const isValid = validateFormData(formState);
    if (!isValid) {
      inputRef.current?.focus();
    }
  }, [formState]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData(formState)) {
      onSubmit(formState);
    }
  };

  return createElement(
    "form",
    {
      id: formId,
      onSubmit: handleSubmit,
      className: "complex-form",
    },
    createElement("label", { htmlFor: `${formId}-name` }, "Name"),
    createElement("input", {
      id: `${formId}-name`,
      ref: inputRef,
      type: "text",
      value: formState.name,
      onChange: (e) => handleChange("name", e.target.value),
      className: "form-input",
    }),

    createElement("label", { htmlFor: `${formId}-email` }, "Email"),
    createElement("input", {
      id: `${formId}-email`,
      type: "email",
      value: formState.email,
      onChange: (e) => handleChange("email", e.target.value),
      className: "form-input",
    }),

    createElement(
      "button",
      {
        type: "submit",
        className: "submit-button",
      },
      "Save"
    )
  );
}

function validateFormData(data) {
  const errors = {};
  if (!data.name) errors.name = "Name is required";
  if (!data.email) errors.email = "Email is required";
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  return Object.keys(errors).length === 0;
}
```

---

## Routing and Navigation

### Routing: `routes/router.js`

<a id="routes-routerjs"></a>

**Purpose**: Implements a client-side router for single-page applications with support for static, nested, dynamic, and lazy-loaded routes.

**Exports**:

- `router`: Singleton instance of the Router class

**Router API**:

- `setErrorHandler(handler)`: Sets a global error handler for routing errors
- `addRoute(path, component)`: Registers a component for a static route
- `addNestedRoute(parentPath, path, component)`: Registers a component at a nested path
- `addRouteWithPrefetch(path, component, preFetch)`: Registers a route with data prefetching
- `addLazyRoute(path, loader)`: Registers a route with lazy component loading
- `navigate(path)`: Navigates to a specified path and renders the matching component
- `start(rootId)`: Initializes the router and renders the current route

**Implementation Notes**:

- Supports path parameters (`:param`) and wildcard routes (`*`)
- Handles browser history for seamless navigation
- Provides error boundaries for route handling

**Usage Example**:

```javascript
import { createElement, mount } from "gravix";
import { router } from "gravix/routes";

// Define components for routes
function HomePage() {
  return createElement(
    "div",
    { className: "home-page" },
    createElement("h1", null, "Welcome to Our Application"),
    createElement("p", null, "This is the homepage of our SPA."),
    createElement(
      "button",
      {
        onClick: () => router.navigate("/products"),
      },
      "Browse Products"
    )
  );
}

function ProductsPage() {
  return createElement(
    "div",
    { className: "products-page" },
    createElement("h1", null, "Products"),
    createElement(
      "div",
      { className: "product-grid" },
      [1, 2, 3, 4].map((id) =>
        createElement(
          "div",
          {
            key: id,
            className: "product-card",
            onClick: () => router.navigate(`/products/${id}`),
          },
          createElement("h3", null, `Product ${id}`),
          createElement("p", null, "Click for details")
        )
      )
    ),
    createElement(
      "button",
      {
        onClick: () => router.navigate("/"),
      },
      "Back to Home"
    )
  );
}

function ProductDetailPage({ params }) {
  const productId = params.id;

  return createElement(
    "div",
    { className: "product-detail" },
    createElement("h1", null, `Product ${productId} Details`),
    createElement(
      "p",
      null,
      `This is the detailed view for product ${productId}.`
    ),
    createElement(
      "button",
      {
        onClick: () => router.navigate("/products"),
      },
      "Back to Products"
    )
  );
}

function NotFoundPage() {
  return createElement(
    "div",
    { className: "not-found" },
    createElement("h1", null, "404 - Page Not Found"),
    createElement("p", null, "The page you're looking for doesn't exist."),
    createElement(
      "button",
      {
        onClick: () => router.navigate("/"),
      },
      "Go to Homepage"
    )
  );
}

// Lazy-loaded admin page
const AdminPageLoader = () =>
  import("./admin.js").then((module) => module.AdminPage);

// Configure router
router.setErrorHandler((error, context) => {
  console.error("Routing error:", error);
  return createElement(
    "div",
    { className: "error-boundary" },
    createElement("h1", null, "Something went wrong"),
    createElement("p", null, error.message),
    createElement(
      "button",
      {
        onClick: () => router.navigate("/"),
      },
      "Go to Homepage"
    )
  );
});

// Register routes
router.addRoute("/", HomePage);
router.addRoute("/products", ProductsPage);
router.addRoute("/products/:id", ProductDetailPage);
router.addLazyRoute("/admin", AdminPageLoader);
router.addRoute("*", NotFoundPage); // Wildcard route for 404

// Initialize router
document.addEventListener("DOMContentLoaded", () => {
  router.start("app-root");
});
```

---

### Routing: `routes/index.js`

<a id="routes-indexjs"></a>

**Purpose**: Provides hook-based utilities for accessing and manipulating routing state within components.

**Exports**:

- `useNavigate()`: Returns a function for programmatic navigation
- `useRoute()`: Returns current route information (path, segments, params)
- `useAuthGuard(redirectOnSuccess, redirectOnFail)`: Handles route protection based on authentication status

**Implementation Notes**:

- `useRoute` subscribes to browser history events for automatic updates
- `useAuthGuard` checks local storage for authentication state

**Usage Example**:

```javascript
import { createElement } from "gravix";
import { useMinor } from "gravix/hooks";
import { useNavigate, useRoute, useAuthGuard } from "gravix/routes";

function NavigationBar() {
  const navigate = useNavigate();
  const { path } = useRoute();

  const isActive = (routePath) => (path === routePath ? "active" : "");

  return createElement(
    "nav",
    { className: "main-navigation" },
    createElement(
      "ul",
      null,
      createElement(
        "li",
        { className: isActive("/") },
        createElement(
          "a",
          {
            onClick: (e) => {
              e.preventDefault();
              navigate("/");
            },
            href: "#",
          },
          "Home"
        )
      ),
      createElement(
        "li",
        { className: isActive("/products") },
        createElement(
          "a",
          {
            onClick: (e) => {
              e.preventDefault();
              navigate("/products");
            },
            href: "#",
          },
          "Products"
        )
      ),
      createElement(
        "li",
        { className: isActive("/dashboard") },
        createElement(
          "a",
          {
            onClick: (e) => {
              e.preventDefault();
              navigate("/dashboard");
            },
            href: "#",
          },
          "Dashboard"
        )
      )
    )
  );
}

function ProtectedDashboard() {
  // Redirect to /login if not authenticated, or to /dashboard/overview if authenticated
  const isAuthenticated = useAuthGuard("/dashboard/overview", "/login");

  // This will only render if authentication check is still in progress
  return createElement(
    "div",
    { className: "loading" },
    createElement("p", null, "Checking authentication...")
  );
}

function ProductDetail() {
  const { params } = useRoute();
  const [product, setProduct] = useMinor(null);
  const navigate = useNavigate();

  useMajor(() => {
    // Fetch product details using the ID from route params
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Failed to load product:", err);
        navigate("/products", { replace: true });
      });
  }, [params.id]);

  if (!product) {
    return createElement("div", null, "Loading product...");
  }

  return createElement(
    "div",
    { className: "product-detail" },
    createElement("h1", null, product.name),
    createElement("p", null, product.description),
    createElement(
      "button",
      {
        onClick: () => navigate("/products"),
      },
      "Back to Products"
    )
  );
}
```

---

## State Management

### Store: `store/index.js`

<a id="store-indexjs"></a>

**Purpose**: Implements a predictable state container with Redux-like patterns for global application state management.

**Exports**:

- `createStore(reducer, initialState?, middlewares?)`: Creates a new store instance
- `combineReducers(reducers)`: Combines multiple reducers into one
- `createAction(type)`: Creates an action creator function
- `createMiddleware(handler)`: Creates middleware for intercepting actions
- `useStore(store)`: Hook for accessing store state and dispatch in components

**Implementation Notes**:

- Follows unidirectional data flow pattern
- Supports middleware for side effects, logging, etc.
- Integrates with Gravix components via the `useStore` hook

**Usage Example**:

```javascript
import { createElement } from "gravix";
import {
  createStore,
  combineReducers,
  createAction,
  createMiddleware,
  useStore,
} from "gravix/store";

// Define action creators
const incrementCounter = createAction("INCREMENT_COUNTER");
const decrementCounter = createAction("DECREMENT_COUNTER");
const setUser = createAction("SET_USER");
const clearUser = createAction("CLEAR_USER");

// Define reducers
function counterReducer(state = 0, action) {
  switch (action.type) {
    case "INCREMENT_COUNTER":
      return state + (action.payload || 1);
    case "DECREMENT_COUNTER":
      return state - (action.payload || 1);
    default:
      return state;
  }
}

function userReducer(state = null, action) {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
}

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
});

// Create logging middleware
const loggingMiddleware = createMiddleware((store, next, action) => {
  console.log("Action:", action);
  console.log("Previous State:", store.getState());
  const result = next(action);
  console.log("Next State:", store.getState());
  return result;
});

// Create store
const store = createStore(rootReducer, { counter: 0, user: null }, [
  loggingMiddleware,
]);

// Component using the store
function Counter() {
  const [state, dispatch] = useStore(store);

  return createElement(
    "div",
    { className: "counter-container" },
    createElement("h2", null, "Counter: " + state.counter),
    createElement(
      "div",
      { className: "counter-controls" },
      createElement(
        "button",
        {
          onClick: () => dispatch(decrementCounter()),
          className: "counter-button",
        },
        "-"
      ),
      createElement(
        "button",
        {
          onClick: () => dispatch(incrementCounter()),
          className: "counter-button",
        },
        "+"
      ),
      createElement(
        "button",
        {
          onClick: () => dispatch(incrementCounter(5)),
          className: "counter-button",
        },
        "+5"
      )
    ),
    createElement(
      "div",
      { className: "user-status" },
      state.user
        ? createElement(
            "div",
            null,
            createElement("p", null, `Logged in as: ${state.user.name}`),
            createElement(
              "button",
              {
                onClick: () => dispatch(clearUser()),
                className: "user-button",
              },
              "Logout"
            )
          )
        : createElement(
            "button",
            {
              onClick: () => dispatch(setUser({ id: 1, name: "John Doe" })),
              className: "user-button",
            },
            "Login"
          )
    )
  );
}
```

---

## Utility Modules

### Utils: `utils/elements/builder.js`

<a id="utils-elements-builderjs"></a>

**Purpose**: Provides a fluent builder API for constructing virtual DOM elements with chainable methods.

**Exports**:

- `ComponentBuilder`: Class with chainable methods for building components
- Element creation utilities: `create`, `createWithId`, `dataContainer`
- Conditional and collection helpers: `conditional`, `list`, `fragment`

**Implementation Notes**:

- Each method returns the builder instance for chaining
- Automatically handles property normalization and children flattening
- Includes convenience methods for all standard HTML elements

**Usage Example**:

```javascript
import { mount } from "gravix";
import { ComponentBuilder } from "gravix/utils/elements/builder";

function createProductList(products, onSelectProduct) {
  return new ComponentBuilder()
    .create("section", { className: "product-catalog" })
    .create("h2", { className: "section-title" })
    .text("Featured Products")
    .end()
    .conditional(products.length === 0, (builder) =>
      builder
        .create("p", { className: "empty-state" })
        .text("No products available at this time.")
        .end()
    )
    .list(products, (product) =>
      new ComponentBuilder()
        .createWithId(
          "div",
          {
            className: "product-item",
            onClick: () => onSelectProduct(product.id),
          },
          `product-${product.id}`
        )
        .create("img", {
          src: product.imageUrl,
          alt: product.name,
          className: "product-image",
        })
        .end()
        .create("div", { className: "product-info" })
        .create("h3", { className: "product-name" })
        .text(product.name)
        .end()
        .create("p", { className: "product-price" })
        .text(`$${product.price.toFixed(2)}`)
        .end()
        .create("p", { className: "product-rating" })
        .text(`Rating: ${product.rating}/5`)
        .end()
        .dataContainer(
          {
            category: product.category,
            stock: product.inStock ? "yes" : "no",
            featured: product.isFeatured ? "yes" : "no",
          },
          { className: "product-metadata" }
        )
        .text("See details")
        .end()
        .end()
        .end()
    )
    .end()
    .build();
}

// Example usage
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    rating: 4.5,
    category: "electronics",
    inStock: true,
    isFeatured: true,
    imageUrl: "/images/headphones.jpg",
  },
  // More products...
];

mount(
  createProductList(products, (id) => console.log(`Selected product: ${id}`)),
  document.getElementById("product-container")
);
```

---

### Utils: `utils/elements/elements.js`

<a id="utils-elements-elementsjs"></a>

**Purpose**: Provides shorthand functions for all standard HTML elements to simplify DOM creation.

**Exports**:

- Core utilities: `buildElement`, `mapList`, `Fragment`
- HTML tag helpers: `div`, `span`, `h1`-`h6`, `p`, `a`, etc.
- Form elements: `form`, `input`, `button`, `textarea`, `select`, etc.
- Media elements: `img`, `video`, `audio`, `canvas`, etc.
- Table elements: `table`, `thead`, `tbody`, `tr`, `td`, etc.
- Semantic elements: `time`, `address`, `progress`, etc.

**Implementation Notes**:

- All functions internally use the `ComponentBuilder` class
- Creates optimized virtual DOM nodes for rendering

**Usage Example**:

```javascript
import { mount } from "gravix";
import {
  div,
  h1,
  p,
  form,
  input,
  button,
  label,
  select,
  option,
  span,
  Fragment,
  mapList,
} from "gravix/utils/elements/elements";

function CheckoutForm({ cart, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(Object.fromEntries(formData));
  };

  return div(
    { className: "checkout-container" },
    h1({ className: "checkout-title" }, "Complete Your Order"),

    div(
      { className: "order-summary" },
      h1({ className: "summary-title" }, "Order Summary"),
      mapList(cart.items, (item) =>
        div(
          { key: item.id, className: "cart-item" },
          span({ className: "item-name" }, item.name),
          span({ className: "item-quantity" }, `× ${item.quantity}`),
          span(
            { className: "item-price" },
            `$${(item.price * item.quantity).toFixed(2)}`
          )
        )
      ),
      div(
        { className: "cart-total" },
        span(null, "Total:"),
        span(
          { className: "total-amount" },
          `$${cart.items
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2)}`
        )
      )
    ),

    form(
      { onSubmit: handleSubmit, className: "checkout-form" },
      div(
        { className: "form-section" },
        h1(null, "Shipping Information"),

        div(
          { className: "form-row" },
          div(
            { className: "form-group" },
            label({ htmlFor: "firstName" }, "First Name"),
            input({
              type: "text",
              id: "firstName",
              name: "firstName",
              required: true,
              className: "form-control",
            })
          ),
          div(
            { className: "form-group" },
            label({ htmlFor: "lastName" }, "Last Name"),
            input({
              type: "text",
              id: "lastName",
              name: "lastName",
              required: true,
              className: "form-control",
            })
          )
        ),

        div(
          { className: "form-group" },
          label({ htmlFor: "address" }, "Address"),
          input({
            type: "text",
            id: "address",
            name: "address",
            required: true,
            className: "form-control",
          })
        ),

        div(
          { className: "form-row" },
          div(
            { className: "form-group" },
            label({ htmlFor: "city" }, "City"),
            input({
              type: "text",
              id: "city",
              name: "city",
              required: true,
              className: "form-control",
            })
          ),
          div(
            { className: "form-group" },
            label({ htmlFor: "zipCode" }, "Zip Code"),
            input({
              type: "text",
              id: "zipCode",
              name: "zipCode",
              required: true,
              className: "form-control",
            })
          )
        ),

        div(
          { className: "form-group" },
          label({ htmlFor: "country" }, "Country"),
          select(
            {
              id: "country",
              name: "country",
              required: true,
              className: "form-control",
            },
            option({ value: "" }, "Select a country"),
            option({ value: "us" }, "United States"),
            option({ value: "ca" }, "Canada"),
            option({ value: "mx" }, "Mexico")
          )
        )
      ),

      div(
        { className: "form-section" },
        h1(null, "Payment Method")
        // Payment form fields would go here
      ),

      button(
        {
          type: "submit",
          className: "checkout-button",
        },
        "Complete Order"
      )
    )
  );
}
```

---

### Utils: `utils/api/index.js`

<a id="utils-api-indexjs"></a>

**Purpose**: Provides a configurable HTTP client for making API requests with standardized error handling and request configuration.

**Exports**:

- `ApiClient`: Class for creating configured HTTP clients

**API Client Features**:

- Base URL configuration and header management
- HTTP methods: `get`, `post`, `put`, `patch`, `delete`
- Request timeouts and cancellation
- JSON serialization and response parsing
- Standardized error handling

**Usage Example**:

```javascript
import { ApiClient } from "gravix/utils/api";

// Create a configured API client
const api = new ApiClient({
  baseURL: "https://api.example.com/v1",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Authentication helper
function authenticate(token) {
  return api.setHeader("Authorization", `Bearer ${token}`);
}

// API service module
const productService = {
  async getProducts(page = 1, perPage = 20, category = null) {
    const params = { page, perPage };
    if (category) params.category = category;

    return api.get("/products", { params });
  },

  async getProductById(id) {
    return api.get(`/products/${id}`);
  },

  async createProduct(productData) {
    return api.post("/products", productData);
  },

  async updateProduct(id, productData) {
    return api.put(`/products/${id}`, productData);
  },

  async deleteProduct(id) {
    return api.delete(`/products/${id}`);
  },

  async searchProducts(query, filters = {}) {
    return api.get("/products/search", {
      params: { q: query, ...filters },
    });
  },
};

// Usage in a component
async function loadProductData() {
  try {
    // Authenticate if needed
    const token = localStorage.getItem("authToken");
    if (token) {
      authenticate(token);
    }

    // Make API calls
    const featuredProducts = await productService.getProducts(1, 5, "featured");
    const productDetails = await productService.getProductById("prod-123");

    return { featuredProducts, productDetails };
  } catch (error) {
    // Standardized error handling
    if (error.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    } else if (error.status === 404) {
      // Handle not found
      return { error: "Product not found", code: 404 };
    } else {
      // Handle other errors
      console.error("API error:", error);
      return { error: "Failed to load products", code: error.status || 500 };
    }
  }
}
```

---

### Utils: `utils/image/index.js`

<a id="utils-image-indexjs"></a>

**Purpose**: Provides optimized image loading with blur-up placeholders for improved user experience.

**Exports**:

- `optimizedImg({ src, alt, width, height, ...options })`: Creates an optimized image element with lazy loading and blur placeholder

**Features**:

- Lazy loading of images for performance
- Blur-up technique with SVG placeholders
- Support for responsive images with `srcset` and `sizes`
- Progressive enhancement of image loading

**Usage Example**:

```javascript
import { div, h1 } from "gravix/utils/elements/elements";
import { optimizedImg } from "gravix/utils/image";

function ProductGallery({ products }) {
  return div(
    { className: "product-gallery" },
    h1({ className: "gallery-title" }, "Product Showcase"),

    div(
      { className: "gallery-grid" },
      products.map((product) =>
        div(
          { key: product.id, className: "gallery-item" },
          optimizedImg({
            src: product.imageUrl,
            alt: product.name,
            width: 400,
            height: 300,
            lazy: true,
            blur: true,
            className: "gallery-image",
            srcset: `
              ${product.imageUrl}?w=400 400w,
              ${product.imageUrl}?w=800 800w,
              ${product.imageUrl}?w=1200 1200w
            `,
            sizes: "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw",
          }),
          div({ className: "gallery-caption" }, product.name)
        )
      )
    )
  );
}

// Hero section with featured image
function HeroSection({ heroImage }) {
  return div(
    { className: "hero-section" },
    optimizedImg({
      src: heroImage.src,
      alt: heroImage.alt,
      width: 1920,
      height: 1080,
      lazy: false, // Load immediately for hero image
      blur: true,
      className: "hero-image",
      style: {
        objectFit: "cover",
        objectPosition: "center",
      },
    }),
    div(
      { className: "hero-content" },
      h1(null, "Welcome to Our Store")
      // Additional hero content
    )
  );
}
```

---

### Utils: `utils/validation/index.js`

<a id="utils-validation-indexjs"></a>

**Purpose**: Provides form validation utilities and enhanced form elements with built-in validation support.

**Exports**:

- Enhanced form elements: `input`, `textarea`, `select`, `option`, `label`, `fieldset`
- Validation helper: `validateForm(formElements)`

**Validation Features**:

- Basic validators: `required`, `minLength`, `maxLength`, `pattern`
- Custom validation functions with error messages
- Field-level and form-level validation
- Integration with form elements for automatic error state

**Usage Example**:

```javascript
import { div, button } from "gravix/utils/elements/elements";
import {
  input,
  textarea,
  select,
  option,
  label,
  fieldset,
  validateForm,
} from "gravix/utils/validation";
import { useMinor } from "gravix/hooks";

function RegistrationForm({ onSubmit }) {
  const [errors, setErrors] = useMinor({});
  const [submitted, setSubmitted] = useMinor(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all form elements
    const formResult = validateForm(e.target.elements);
    setErrors(formResult.errors);

    if (formResult.isValid) {
      const formData = new FormData(e.target);
      onSubmit(Object.fromEntries(formData));
      setSubmitted(true);
    }
  };

  if (submitted) {
    return div(
      { className: "success-message" },
      "Registration successful! Check your email to confirm your account."
    );
  }

  return div(
    { className: "registration-container" },
    div({ className: "form-header" }, "Create an Account"),

    fieldset(
      {
        className: "registration-form-container",
        validationErrors: Object.values(errors),
      },
      div(
        { className: "form-row" },
        div(
          { className: "form-group" },
          label({ htmlFor: "firstName" }, "First Name"),
          input({
            id: "firstName",
            name: "firstName",
            type: "text",
            placeholder: "Your first name",
            className: "form-control",
            validation: {
              required: true,
              requiredMessage: "First name is required",
              minLength: 2,
              minLengthMessage: "First name must be at least 2 characters",
            },
            onValidationChange: (result) => {
              setErrors((prev) => ({
                ...prev,
                firstName: result.isValid ? null : result.message,
              }));
            },
          })
        ),

        div(
          { className: "form-group" },
          label({ htmlFor: "lastName" }, "Last Name"),
          input({
            id: "lastName",
            name: "lastName",
            type: "text",
            placeholder: "Your last name",
            className: "form-control",
            validation: {
              required: true,
              requiredMessage: "Last name is required",
            },
          })
        )
      ),

      div(
        { className: "form-group" },
        label({ htmlFor: "email" }, "Email Address"),
        input({
          id: "email",
          name: "email",
          type: "email",
          placeholder: "your.email@example.com",
          className: "form-control",
          validation: {
            required: true,
            requiredMessage: "Email address is required",
            pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            patternMessage: "Please enter a valid email address",
            customValidator: (value) => {
              // Additional email validation logic if needed
              if (value.includes("test@test.com")) {
                return { isValid: false, message: "This email cannot be used" };
              }
              return { isValid: true };
            },
          },
        })
      ),

      div(
        { className: "form-group" },
        label({ htmlFor: "password" }, "Password"),
        input({
          id: "password",
          name: "password",
          type: "password",
          className: "form-control",
          validation: {
            required: true,
            requiredMessage: "Password is required",
            minLength: 8,
            minLengthMessage: "Password must be at least 8 characters",
            customValidator: (value) => {
              const hasLetter = /[a-zA-Z]/.test(value);
              const hasNumber = /[0-9]/.test(value);
              const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

              if (!hasLetter || !hasNumber || !hasSpecial) {
                return {
                  isValid: false,
                  message:
                    "Password must include letters, numbers, and special characters",
                };
              }
              return { isValid: true };
            },
          },
        })
      ),

      div(
        { className: "form-group" },
        label({ htmlFor: "accountType" }, "Account Type"),
        select(
          {
            id: "accountType",
            name: "accountType",
            className: "form-control",
            validation: {
              required: true,
              requiredMessage: "Please select an account type",
            },
          },
          option({ value: "" }, "Select account type"),
          option({ value: "personal" }, "Personal"),
          option({ value: "business" }, "Business"),
          option({ value: "enterprise" }, "Enterprise")
        )
      ),

      div(
        { className: "form-group" },
        label({ htmlFor: "bio" }, "Short Bio"),
        textarea({
          id: "bio",
          name: "bio",
          rows: 4,
          placeholder: "Tell us a bit about yourself",
          className: "form-control",
          validation: {
            maxLength: 500,
            maxLengthMessage: "Bio cannot exceed 500 characters",
          },
        })
      ),

      div(
        { className: "form-actions" },
        button(
          {
            type: "submit",
            className: "submit-button",
            onClick: handleSubmit,
          },
          "Create Account"
        )
      )
    )
  );
}
```

---

## Vite Integration

### Vite: `vite/index.js`

<a id="vite-indexjs"></a>

**Purpose**: Provides a configured Vite build system optimized for Gravix applications.

**Exports**:

- `createGravixConfig(userConfig)`: Factory function for generating Vite configurations

**Configuration Features**:

- Development server with hot module replacement
- Path aliases for simplified imports
- Optimized production builds
- Bundle analysis capabilities
- Source directory watching for structure changes

**Usage Example**:

```javascript
// vite.config.js
import { createGravixConfig } from "gravix/vite";

export default createGravixConfig({
  // Override default options
  PORT: 3000,
  OPEN_BROWSER: true,
  BUILD_TARGET: "es2018",
  SOURCE_MAPS: true,
  ANALYZE_BUNDLE: process.env.ANALYZE === "true",

  // Additional Vite config options
  plugins: [
    // Your custom Vite plugins
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
```

---

### Vite: `vite/config/constants.js`

<a id="vite-config-constantsjs"></a>

**Purpose**: Defines configuration constants used throughout the Vite integration.

**Exports**:

- `DEFAULT_CONFIG`: Default Vite configuration options
- `COLORS`: ANSI color codes for console output formatting

**Key Default Settings**:

- Development server port and host
- Environment variable prefixes
- Build optimization settings
- Hot module replacement configuration

---

### Vite: `vite/config/logger.js`

<a id="vite-config-loggerjs"></a>

**Purpose**: Provides formatted console logging for the build process and development server.

**Exports**:

- `logInfo(msg)`, `logError(msg)`: Utility functions for formatted logging
- `createCustomLogger()`: Factory for a Vite-compatible logger implementation

**Features**:

- Color-coded output by message type
- Timestamp prefixing
- Consistent formatting for error, warning, and info messages
- Console clearing for important state changes

---

### Vite: `vite/config/watcher.js`

<a id="vite-config-watcherjs"></a>

**Purpose**: Monitors the source directory structure and triggers rebuilds when significant changes occur.

**Exports**:

- `initWatcher(config, aliasesGenerator)`: Sets up file system watchers for the source directory

**Implementation Notes**:

- Uses Chokidar for efficient file system watching
- Detects directory additions and removals
- Regenerates path aliases when the directory structure changes
- Triggers server restart when necessary

---

### Vite: `vite/utils/helpers.js`

<a id="vite-utils-helpersjs"></a>

**Purpose**: Provides utility functions for the Vite integration.

**Exports**:

- `getTimestamp()`: Returns a formatted timestamp for logging

---

### Vite: `vite/utils/aliases.js`

<a id="vite-utils-aliasesjs"></a>

**Purpose**: Generates path aliases for simplified imports within Gravix applications.

**Exports**:

- `generateAliases(forceUpdate)`: Creates a map of path aliases based on source directory structure

**Features**:

- Automatic discovery of source directories
- Caching of aliases for performance
- Support for both static and dynamic aliases
- Fallback handling for missing directories

**Default Aliases**:

- `@`: Root source directory
- `@public`: Public assets directory
- `@components`, `@pages`, etc.: Based on existing directories

---

### Vite: `vite/plugins/bundleAnalyzer.js`

<a id="vite-plugins-bundleanalyzerjs"></a>

**Purpose**: Integrates bundle analysis visualization for optimizing application size.

**Exports**:

- `withBundleAnalyzer(config)`: Enhances a Vite configuration with bundle analysis capabilities

**Features**:

- Visual representation of bundle composition
- Size metrics including raw, gzipped, and brotli compression
- Component-level size analysis
- Configurable visualization options

---

## Package Configuration

### `package.json`

<a id="packagejson"></a>

**Key Configuration**:

- Package name: `gravix`
- Module type: ESM (`"type": "module"`)
- Main entry point: `index.js`
- Dependencies:
  - `chokidar`: File system watching
  - `vite`: Build system integration
- Developer documentation and scripts

**Import Patterns**:

- Direct imports: `import { createElement } from "gravix"`
- Module imports: `import { useMinor } from "gravix/hooks"`
- Utility imports: `import { ApiClient } from "gravix/utils/api"`

---

## Best Practices and Development Patterns

### Component Architecture

- Use functional components with hooks for most UI elements
- Reserve class components for complex stateful logic or legacy code
- Keep component references stable when using hooks
- Implement proper cleanup in effect hooks to prevent memory leaks

### State Management

- Use local component state for UI-specific concerns
- Leverage the store for application-wide state
- Implement pure reducers that avoid side effects
- Use middleware for async operations and side effects

### Routing

- Define wildcard routes as fallbacks for 404 handling
- Use dynamic parameters for resource identifiers
- Implement proper auth guards for protected routes
- Use lazy loading for code splitting large application sections

### Performance Optimization

- Implement proper memoization for expensive computations
- Use the image optimization utilities for media-heavy pages
- Apply throttling and debouncing for frequent event handlers
- Leverage code splitting and lazy loading for initial load performance

### Error Handling

- Implement proper error boundaries at strategic points
- Use standardized error handling in API requests
- Provide user-friendly error messages and recovery options
- Log errors appropriately for debugging

### Development Workflow

- Leverage the Vite integration for fast development cycles
- Organize source code to benefit from automatic path aliases
- Monitor bundle size using the analyzer plugin
- Follow the consistent patterns established in the library examples

## Troubleshooting

### Hook-Related Issues

- **Problem**: Hook state not persisting between renders
  **Solution**: Ensure component function references remain stable and components are properly mounted via Gravix

### Routing Problems

- **Problem**: Routes not rendering correctly
  **Solution**: Verify `router.start()` has been called and check route declarations for conflicts

### Build System Issues

- **Problem**: Path aliases not working
  **Solution**: Ensure source directories exist and restart the development server after structure changes

### Image Optimization

- **Problem**: Blur effect not transitioning correctly
  **Solution**: Verify image sources are correct and provide unique placeholder identifiers for similar images

### State Management

- **Problem**: Store updates not reflected in components
  **Solution**: Check that reducers are pure functions and components are properly subscribed via `useStore`

## License

<a id="license"></a>

MIT © 2025 **Shivam Ghode** - **Gravix**

## Support and Community

<a id="support-and-community"></a>

If you encounter any issues or have questions:

- [Create an issue](https://github.com/shivamghode09/main/issues) on GitHub
- Email support: shivamghode2021@gmail.com

## Author

<a id="author"></a>

Created by **Shivam Ghode**, Lead Architect of the Gravix Ecosystem.

GitHub: [https://github.com/shivamghode09/main](https://github.com/shivamghode09/main)
