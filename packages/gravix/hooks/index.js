/**
 * Additional Hook's for Gravix
 *
 * Features:
 * - State & Effects
 * - Refs & Memoization
 * - Context API
 * - Async Helpers
 * - Performance
 * - Debugging
 * - Advanced
 * - Auto-Cleanup
 * - Cache
 */

import { mount } from "..";

// Global state for tracking component context
let currentComponent = null;
let states = new Map();
let effects = new Map();
let refs = new Map();
let stateIndex = 0;
let effectIndex = 0;
let refIndex = 0;

/**
 * Sets the current component context and resets hook indices
 * @param {Object} component - The current component instance
 * @return {void}
 */
export function setCurrentComponent(component) {
  currentComponent = component;
  stateIndex = 0;
  effectIndex = 0;
  refIndex = 0;
}

/**
 * Cleans up all effects and states for a component when unmounted
 * @param {Object} component - The component to clean up
 * @return {void}
 */
export function cleanupComponent(component) {
  // Clean up all effects
  if (effects.has(component)) {
    effects.get(component).forEach((effect) => {
      if (effect?.cleanup) effect.cleanup();
    });
    effects.delete(component);
  }

  // Clean up states and refs
  states.delete(component);
  refs.delete(component);
}

/**
 * State management hook (similar to useState)
 * @param {any} initialValue - Initial state value
 * @return {Array} [state, setState] - State and state setter
 */
export function useMinor(initialValue) {
  const component = currentComponent;
  const index = stateIndex++;

  if (!states.has(component)) {
    states.set(component, []);
  }

  const componentStates = states.get(component);

  if (componentStates[index] === undefined) {
    componentStates[index] = initialValue;
  }

  const setState = (newValue) => {
    const value =
      typeof newValue === "function"
        ? newValue(componentStates[index])
        : newValue;

    if (componentStates[index] !== value) {
      componentStates[index] = value;
      // Re-render the component
      const root = document.getElementById("root");
      mount(component, root);
    }
  };

  return [componentStates[index], setState];
}

/**
 * Side effect hook (similar to useEffect)
 * @param {Function} callback - Effect callback
 * @param {Array} dependencies - Dependency array
 * @return {void}
 */
export function useMajor(callback, dependencies = []) {
  const component = currentComponent;
  const index = effectIndex++;

  if (!effects.has(component)) {
    effects.set(component, []);
  }

  const componentEffects = effects.get(component);
  const prevDeps = componentEffects[index]?.dependencies;

  const depsChanged =
    !prevDeps ||
    dependencies.length !== prevDeps.length ||
    dependencies.some((dep, i) => dep !== prevDeps[i]);

  if (depsChanged) {
    // Clean up previous effect if exists
    if (componentEffects[index]?.cleanup) {
      componentEffects[index].cleanup();
    }

    const cleanup = callback();
    componentEffects[index] = {
      dependencies,
      cleanup: typeof cleanup === "function" ? cleanup : undefined,
    };
  }
}

/**
 * Layout effect hook (similar to useLayoutEffect)
 * @param {Function} callback - Effect callback
 * @param {Array} dependencies - Dependency array
 * @return {void}
 */
export function useLayoutMajor(callback, dependencies = []) {
  // Use microtask to run after DOM mutations but before paint
  useMajor(() => {
    Promise.resolve().then(callback);
  }, dependencies);
}

/**
 * Reference hook (similar to useRef)
 * @param {any} initialValue - Initial ref value
 * @return {Object} { current: value } - Ref object
 */
export function useEcho(initialValue) {
  const component = currentComponent;
  const index = refIndex++;

  if (!refs.has(component)) {
    refs.set(component, []);
  }

  const componentRefs = refs.get(component);

  if (componentRefs[index] === undefined) {
    componentRefs[index] = { current: initialValue };
  }

  return componentRefs[index];
}

/**
 * Memoization hook (similar to useMemo)
 * @param {Function} factory - Function to memoize
 * @param {Array} dependencies - Dependency array
 * @return {any} - Memoized value
 */
export function useMemo(factory, dependencies) {
  const [value, setValue] = useMinor(null);

  useMajor(() => {
    setValue(factory());
  }, dependencies);

  return value;
}

/**
 * Callback hook (similar to useCallback)
 * @param {Function} callback - Function to memoize
 * @param {Array} dependencies - Dependency array
 * @return {Function} - Memoized callback
 */
export function useCallback(callback, dependencies) {
  return useMemo(() => callback, dependencies);
}

// Export file's
export * from "./context";
export * from "./utility";
export * from "./performance";
export * from "./async";
