/**
 * Gravix - API Client
 *
 * Features:
 * - Method Chaining
 * - Automatic Content Handling
 * - Enhanced Error Handling
 * - Header Management & many more
 */

export class ApiClient {
  /**
   * Initialize the API client
   * @param {Object} config - Configuration options
   * @param {string} config.baseURL - Base URL for all requests (e.g., "https://api.example.com")
   * @param {Object} config.headers - Default headers (e.g., { "Authorization": "Bearer token" })
   * @param {number} config.timeout - Request timeout in ms (default: 5000)
   */
  constructor(config = {}) {
    if (!config.baseURL) {
      throw new Error("baseURL is required (e.g., 'https://api.example.com')");
    }

    this.config = {
      baseURL: config.baseURL,
      headers: config.headers || {},
      timeout: config.timeout || 5000,
    };
  }

  /**
   * Make an HTTP request
   * @private
   */
  async _request(method, endpoint, options = {}) {
    const {
      headers = {},
      params = {},
      body,
      timeout = this.config.timeout,
    } = options;

    // 1. Construct URL
    const url = new URL(endpoint, this.config.baseURL);

    // 2. Add query parameters (for GET requests)
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.append(key, value);
    });

    // 3. Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // 4. Prepare request options
      const requestOptions = {
        method: method.toUpperCase(),
        headers: { ...this.config.headers, ...headers },
        signal: controller.signal,
      };

      // 5. Add body for POST, PUT, PATCH, DELETE
      if (
        body &&
        ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())
      ) {
        requestOptions.body = JSON.stringify(body);
        if (!requestOptions.headers["Content-Type"]) {
          requestOptions.headers["Content-Type"] = "application/json";
        }
      }

      // 6. Make the fetch request
      const response = await fetch(url.toString(), requestOptions);
      clearTimeout(timeoutId);

      // 7. Handle errors (non-2xx responses)
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw {
          status: response.status,
          message: `Request failed with status ${response.status}`,
          data: errorData,
        };
      }

      // 8. Return parsed JSON response
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw { message: `Request timed out after ${timeout}ms` };
      }
      throw error;
    }
  }

  // Public Methods (GET, POST, PUT, PATCH, DELETE)
  get(endpoint, options = {}) {
    return this._request("GET", endpoint, options);
  }

  post(endpoint, body, options = {}) {
    return this._request("POST", endpoint, { ...options, body });
  }

  put(endpoint, body, options = {}) {
    return this._request("PUT", endpoint, { ...options, body });
  }

  patch(endpoint, body, options = {}) {
    return this._request("PATCH", endpoint, { ...options, body });
  }

  delete(endpoint, options = {}) {
    return this._request("DELETE", endpoint, options);
  }

  // Helper methods
  setHeader(key, value) {
    this.config.headers[key] = value;
    return this; // Allows chaining
  }

  removeHeader(key) {
    delete this.config.headers[key];
    return this;
  }
}
