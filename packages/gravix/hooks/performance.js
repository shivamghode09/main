import { useMinor, useMajor, useEcho } from ".";

/**
 * A lightweight key-value cache with fixed size limit
 * Automatically removes oldest entry when full
 */
export class Cache {
  /**
   * Create a new cache instance
   * @param {number} maxSize - Maximum number of items to store (default: 100)
   */
  constructor(maxSize = 100) {
    // Internal storage using Map (preserves insertion order)
    this.store = new Map();

    // Maximum number of items the cache can hold
    this.maxSize = maxSize;
  }

  /**
   * Add or update an item in the cache
   * @param {string} key - Unique identifier for the cached item
   * @param {any} value - Data to be cached
   */
  set(key, value) {
    // Check if cache is full
    if (this.store.size >= this.maxSize) {
      // Get the first/oldest key in the Map (insertion order)
      const firstKey = this.store.keys().next().value;

      // Remove the oldest item to make space
      this.store.delete(firstKey);
    }

    // Add the new item to cache
    this.store.set(key, value);
  }

  /**
   * Retrieve an item from cache
   * @param {string} key - Key of the item to retrieve
   * @returns {any|undefined} - Returns the cached value or undefined if not found
   */
  get(key) {
    return this.store.get(key);
  }

  /**
   * Remove a specific item from cache
   * @param {string} key - Key of the item to remove
   * @returns {boolean} - True if item existed and was deleted
   */
  delete(key) {
    return this.store.delete(key);
  }

  /**
   * Completely clear the cache
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get current number of items in cache
   * @returns {number} - Current cache size
   */
  size() {
    return this.store.size;
  }
}

// Shared cache instance with default settings
export const cache = new Cache(100);

/**
 * Throttle hook
 * @param {any} value - Value to throttle
 * @param {number} delay - Throttle delay in ms
 * @return {any} - Throttled value
 */
export function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useMinor(value);
  const lastExecuted = useEcho(Date.now());

  useMajor(() => {
    const handler = setTimeout(() => {
      if (Date.now() >= lastExecuted.current + delay) {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return throttledValue;
}

/**
 * Debounce hook
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @return {any} - Debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useMinor(value);

  useMajor(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
