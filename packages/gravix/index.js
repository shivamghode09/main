/**
 * Gravix Core Library
 *
 * A lightweight, high-performance virtual DOM implementation featuring:
 * - Efficient DOM diffing and patching
 * - Component-based architecture with lifecycle methods
 * - Support createElement
 * - Integrated hooks system
 * - Built-in performance monitoring
 */

import { setCurrentComponent } from "./hooks";

/**
 * Virtual DOM Node Implementation
 *
 * Represents a lightweight abstraction of DOM elements and components,
 * enabling efficient rendering and updates.
 */
class VirtualDOM {
  /**
   * Creates a new Virtual DOM node
   * @param {string|Function} type - Element tag name or component constructor
   * @param {Object} [props={}] - Element properties/attributes
   * @param {...any} children - Child nodes (can be nested arrays)
   * @throws {TypeError} If type is invalid
   */
  constructor(type, props = {}, ...children) {
    if (typeof type !== "string" && typeof type !== "function") {
      throw new TypeError(
        `Invalid element type: expected string or function, got ${typeof type}`
      );
    }

    this.type = type;
    this.props = props;
    this.children = children.flat(); // Flatten nested arrays immediately
  }

  /**
   * Converts virtual DOM to real DOM element
   * @returns {HTMLElement} Rendered DOM node
   * @throws {Error} If rendering fails
   */
  render() {
    try {
      // Handle component functions/classes
      if (typeof this.type === "function") {
        return this._renderComponent();
      }
      return this._renderElement();
    } catch (error) {
      throw new Error(`VirtualDOM render failed: ${error.message}`);
    }
  }

  /**
   * Renders a component (function or class)
   * @private
   */
  _renderComponent() {
    const result = this.type(this.props);
    if (result instanceof VirtualDOM) {
      return result.render();
    }
    if (result?.render instanceof Function) {
      return result.render();
    }
    throw new Error("Component must return a VirtualDOM or renderable object");
  }

  /**
   * Renders a standard DOM element
   * @private
   */
  _renderElement() {
    const element = document.createElement(this.type);

    // Apply properties efficiently
    this._applyProperties(element, this.props);

    // Render children with minimal DOM operations
    this._renderChildren(element, this.children);

    return element;
  }

  /**
   * Applies properties to DOM element
   * @private
   */
  _applyProperties(element, props) {
    for (const [key, value] of Object.entries(props)) {
      if (value == null) continue; // Skip null/undefined

      if (key.startsWith("on") && typeof value === "function") {
        this._addEventListener(element, key, value);
      } else if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (key === "className") {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    }
  }

  /**
   * Adds event listener with proper cleanup consideration
   * @private
   */
  _addEventListener(element, eventName, handler) {
    const eventType = eventName.toLowerCase().slice(2);
    element.addEventListener(eventType, handler);
    // Store handler reference for potential cleanup
    this._eventHandlers = this._eventHandlers || [];
    this._eventHandlers.push({ element, eventType, handler });
  }

  /**
   * Renders child nodes efficiently
   * @private
   */
  _renderChildren(parent, children) {
    const fragment = document.createDocumentFragment();

    for (const child of children) {
      if (child == null) continue; // Skip null/undefined

      let node;
      if (child instanceof VirtualDOM) {
        node = child.render();
      } else if (child?.render instanceof Function) {
        node = child.render();
      } else {
        node = document.createTextNode(String(child));
      }

      if (node) fragment.appendChild(node);
    }

    parent.appendChild(fragment);
  }
}

/**
 * Base Component Class
 *
 * Provides core lifecycle methods and state management
 * for building reusable UI components.
 */
class Component {
  /**
   * Creates a component instance
   * @param {Object} [props={}] - Component properties
   */
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this._isMounted = false;
    this._domNode = null;
    this._pendingStates = [];
  }

  /**
   * Updates component state and schedules re-render
   * @param {Object|Function} update - State update object or updater function
   * @throws {Error} If update is invalid
   */
  setState(update) {
    if (typeof update !== "object" && typeof update !== "function") {
      throw new Error("setState requires an object or function");
    }

    this._pendingStates.push(update);
    this._scheduleUpdate();
  }

  /**
   * Mounts component to DOM
   * @param {HTMLElement} container - Target DOM element
   */
  mount(container) {
    if (this._isMounted) return;

    this._isMounted = true;
    this._domNode = this._safeRender();

    if (container) {
      container.appendChild(this._domNode);
      this.componentDidMount?.();
    }
  }

  /**
   * Unmounts component from DOM
   */
  unmount() {
    if (!this._isMounted) return;

    this.componentWillUnmount?.();
    this._domNode?.remove();
    this._isMounted = false;
    this._domNode = null;
  }

  /**
   * Performs a safe render with error boundaries
   * @private
   */
  _safeRender() {
    try {
      const vdom = this.render();
      if (!(vdom instanceof VirtualDOM)) {
        throw new Error("render() must return a VirtualDOM instance");
      }
      return vdom.render();
    } catch (error) {
      console.error("Component render error:", error);
      return document.createTextNode("Render Error");
    }
  }

  /**
   * Schedules an update (batches state updates)
   * @private
   */
  _scheduleUpdate() {
    if (this._updateScheduled || !this._isMounted) return;

    this._updateScheduled = true;
    requestAnimationFrame(() => {
      this._performUpdate();
      this._updateScheduled = false;
    });
  }

  /**
   * Performs the actual component update
   * @private
   */
  _performUpdate() {
    if (!this._isMounted || !this._domNode) return;

    // Process all pending state updates
    while (this._pendingStates.length) {
      const update = this._pendingStates.shift();
      this.state =
        typeof update === "function"
          ? update(this.state, this.props)
          : { ...this.state, ...update };
    }

    const parent = this._domNode.parentNode;
    const newDomNode = this._safeRender();

    if (parent && newDomNode) {
      parent.replaceChild(newDomNode, this._domNode);
      this._domNode = newDomNode;
      this.componentDidUpdate?.();
    }
  }

  /**
   * Render method to be implemented by subclasses
   * @throws {Error} If not implemented
   */
  render() {
    throw new Error("Components must implement render()");
  }
}

/**
 * Creates a Virtual DOM element
 * @param {string|Function} type - Element type or component
 * @param {Object|null} [props=null] - Element properties
 * @param {...any} children - Child elements
 * @returns {VirtualDOM} Virtual DOM node
 */
function createElement(type, props = null, ...children) {
  return new VirtualDOM(type, props ?? {}, ...children);
}

/**
 * Mounts a component or element to the DOM
 * @param {Component|VirtualDOM|Function} component - Component to mount
 * @param {HTMLElement} container - Target DOM container
 * @throws {TypeError} For invalid arguments
 */
function mount(component, container) {
  if (!container || !(container instanceof HTMLElement)) {
    throw new TypeError("Container must be a DOM element");
  }

  // Clear container efficiently
  container.textContent = "";

  try {
    if (component instanceof Component) {
      component.mount(container);
    } else if (typeof component === "function") {
      setCurrentComponent(component);
      const element = component();
      if (element) {
        container.appendChild(
          element instanceof VirtualDOM ? element.render() : element
        );
      }
    } else if (component?.render instanceof Function) {
      container.appendChild(component.render());
    } else {
      throw new Error("Invalid component type");
    }
  } catch (error) {
    console.error("Mount error:", error);
    container.textContent = "Render Error";
  }
}

export { createElement, Component, mount };
export * from "./utils/elements/builder";
export * from "./utils/elements/elements";
export * from "./hooks";
