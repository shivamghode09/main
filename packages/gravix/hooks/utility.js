import { useMajor, useEcho } from ".";

// Create variable
let idCounter = 0;

/**
 * Imperative handle hook (similar to useImperativeHandle)
 * @param {Object} ref - Ref object
 * @param {Function} init - Initializer function
 * @param {Array} dependencies - Dependency array
 * @return {void}
 */
export function useImperativeHandle(ref, init, dependencies = []) {
  useMajor(() => {
    if (ref) {
      const methods = init();
      Object.assign(ref.current, methods);
    }
  }, dependencies);
}

/**
 * Debug value hook (similar to useDebugValue)
 * @param {any} value - Value to debug
 * @param {Function} format - Formatter function
 * @return {void}
 */
export function useDebugValue(value, format) {
  if (process.env.NODE_ENV === "development") {
    const displayValue = format ? format(value) : value;
    console.log(`Debug Value: ${displayValue}`);
  }
}

/**
 * Unique ID hook (similar to useId)
 * @return {string} - Unique ID
 */
export function useId() {
  const id = useEcho(null);

  if (id.current === null) {
    id.current = `gravix-${idCounter++}`;
  }

  return id.current;
}

/**
 * Deep comparison effect hook
 * @param {Function} callback - Effect callback
 * @param {Array} dependencies - Dependency array
 * @return {void}
 */
export function useDeepCompareEffect(callback, dependencies) {
  const previousDeps = useEcho();

  const isEqual = (prev, next) => {
    if (prev === next) return true;
    if (typeof prev !== "object" || prev === null) return false;
    if (typeof next !== "object" || next === null) return false;

    const keys1 = Object.keys(prev);
    const keys2 = Object.keys(next);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => isEqual(prev[key], next[key]));
  };

  useMajor(() => {
    if (!previousDeps.current || !isEqual(previousDeps.current, dependencies)) {
      previousDeps.current = dependencies;
      return callback();
    }
  });
}
