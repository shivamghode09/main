let contexts = new Map();

/**
 * Creates a new context (similar to createContext)
 * @param {any} defaultValue - Default context value
 * @return {Symbol} - Context identifier
 */
export function createClouds(defaultValue) {
  const context = Symbol("context");
  contexts.set(context, defaultValue);
  return context;
}

/**
 * Context hook (similar to useContext)
 * @param {Symbol} context - Context identifier
 * @return {Object} { get, set } - Context accessors
 */
export function useClouds(context) {
  if (!contexts.has(context)) {
    throw new Error("Context must be used within a provider");
  }

  return {
    set: (newValue) => contexts.set(context, newValue).get(context),
    get: () => contexts.get(context),
  };
}
