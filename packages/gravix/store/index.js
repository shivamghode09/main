/**
 * Gravix Store Centralized State Management System
 *
 * Features:
 * - Predictable State Container
 * - Middleware Pipeline
 * - Hooks Support
 * - Subscription Model
 * - Combination Reducers
 * - Action Standardization
 * - DevTools Potentail
 */

import { useMinor, useMajor } from "..";

/**
 * Store class for state management with middleware support
 */
class Store {
  /**
   * @constructor
   * @param {function} reducer - Root reducer function
   * @param {object} initialState - Initial state of the application
   */
  constructor(reducer, initialState = {}) {
    this.state = initialState;
    this.reducer = reducer;
    this.listeners = new Set();
    this.middlewares = [];
  }

  /**
   * Get current state
   * @returns {object} Current state
   */
  getState() {
    return this.state;
  }

  /**
   * Subscribe to state changes
   * @param {function} listener - Callback function to be called on state changes
   * @returns {function} Unsubscribe function
   */
  subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("Listener must be a function");
    }

    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Apply middleware to the store
   * @param {...function} middlewares - Middleware functions to apply
   */
  applyMiddleware(...middlewares) {
    this.middlewares = middlewares;
  }

  /**
   * Dispatch an action to update state
   * @param {object} action - Action object with type and payload
   * @returns {object} The dispatched action
   */
  dispatch(action) {
    if (!action || typeof action !== "object" || !action.type) {
      throw new Error("Actions must be plain objects with a type property");
    }

    // Run middleware chain
    const middlewareAPI = {
      getState: this.getState.bind(this),
      dispatch: this.dispatch.bind(this),
    };

    const chain = this.middlewares.map((middleware) =>
      middleware(middlewareAPI)
    );
    let finalAction = action;

    // Execute middleware chain
    chain.forEach((middleware) => {
      finalAction = middleware(finalAction);
    });

    // Update state through reducer
    this.state = this.reducer(this.state, finalAction);

    // Notify subscribers
    this.listeners.forEach((listener) => listener());

    return finalAction;
  }
}

/**
 * Creates a store
 * @param {function} reducer - Root reducer function
 * @param {object} initialState - Initial state
 * @param {array} middlewares - Array of middleware functions
 * @returns {Store} Store instance
 */
export function createStore(reducer, initialState, middlewares = []) {
  const store = new Store(reducer, initialState);
  if (middlewares.length > 0) {
    store.applyMiddleware(...middlewares);
  }
  return store;
}

/**
 * Combines multiple reducers into a single reducer
 * @param {object} reducers - Object of reducers
 * @returns {function} Combined reducer function
 */
export function combineReducers(reducers) {
  return (state = {}, action) => {
    const nextState = {};

    for (const key in reducers) {
      if (!reducers.hasOwnProperty(key)) continue;
      if (typeof reducers[key] !== "function") {
        throw new Error(`Reducer for key "${key}" must be a function`);
      }

      nextState[key] = reducers[key](state[key], action);
    }

    return nextState;
  };
}

/**
 * Creates an action creator function
 * @param {string} type - Action type
 * @returns {function} Action creator function
 */
export function createAction(type) {
  if (typeof type !== "string") {
    throw new Error("Action type must be a string");
  }

  return (payload) => ({ type, payload });
}

/**
 * Creates a middleware function
 * @param {function} handler - Middleware handler function
 * @returns {function} Middleware function
 */
export function createMiddleware(handler) {
  if (typeof handler !== "function") {
    throw new Error("Middleware handler must be a function");
  }

  return (store) => (next) => (action) => handler(store, next, action);
}

/**
 * Hook for accessing store in components
 * @param {Store} store - Store instance
 * @returns {array} [state, dispatch] pair
 */
export function useStore(store) {
  if (
    !store ||
    typeof store.getState !== "function" ||
    typeof store.subscribe !== "function"
  ) {
    throw new Error("Invalid store provided");
  }

  const [state, setState] = useMinor(store.getState());

  useMajor(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return unsubscribe;
  }, [store]);

  return [state, store.dispatch.bind(store)];
}
