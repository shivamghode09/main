/**
 * Gravix Component Builder
 *
 * A lightweight, fluent interface for declarative UI construction with:
 * - Type-safe element creation
 * - Memory efficient implementation
 * - Optimal DOM creation performance
 * - Comprehensive error handling
 * - Reusable component patterns
 */

import { createElement } from "../..";

class ComponentBuilder {
  constructor() {
    this.elements = [];
  }

  /**
   * Creates a new element and adds to builder
   * @param {string} type - HTML tag name
   * @param {Object|null} props - Element properties
   * @param {...any} children - Child elements
   * @returns {ComponentBuilder} Current builder instance for chaining
   * @throws {TypeError} If type is not a string
   */
  create(type, props = null, ...children) {
    if (typeof type !== "string") {
      throw new TypeError(
        `Element type must be a string, received ${typeof type}`
      );
    }

    this.elements.push({
      type,
      props: props || {},
      children: children.flat(), // Flatten nested arrays
    });
    return this;
  }

  /**
   * Builds the final component
   * @returns {VirtualDOM} Constructed virtual DOM element
   * @throws {Error} If no elements were added or build fails
   */
  build() {
    if (this.elements.length === 0) {
      throw new Error(
        "ComponentBuilder error: Cannot build - no elements added"
      );
    }

    try {
      const lastElement = this.elements[this.elements.length - 1];
      return this._processElement(lastElement);
    } catch (error) {
      throw new Error(`ComponentBuilder build failed: ${error.message}`);
    }
  }

  /**
   * Processes a single builder element into Virtual DOM
   * @private
   */
  _processElement({ type, props, children }) {
    const processedChildren = this._processChildren(children);
    return createElement(type, props, ...processedChildren);
  }

  /**
   * Processes all child elements recursively
   * @private
   */
  _processChildren(children) {
    return children
      .map((child) => this._processChild(child))
      .filter((child) => child != null); // Remove null/undefined
  }

  /**
   * Processes a single child element
   * @private
   */
  _processChild(child) {
    if (child == null) return null;

    // Handle fragment return values (arrays)
    if (Array.isArray(child)) {
      return child.map((c) => this._processChild(c)).flat();
    }

    if (child instanceof ComponentBuilder) {
      return child.build();
    }

    if (typeof child === "object" && "render" in child) {
      return child;
    }

    return child;
  }

  // Structural elements
  div(props = null, ...children) {
    return this.create("div", props, ...children);
  }
  section(props = null, ...children) {
    return this.create("section", props, ...children);
  }
  header(props = null, ...children) {
    return this.create("header", props, ...children);
  }
  footer(props = null, ...children) {
    return this.create("footer", props, ...children);
  }
  nav(props = null, ...children) {
    return this.create("nav", props, ...children);
  }

  // Text elements
  h1(props = null, ...children) {
    return this.create("h1", props, ...children);
  }
  h2(props = null, ...children) {
    return this.create("h2", props, ...children);
  }
  h3(props = null, ...children) {
    return this.create("h3", props, ...children);
  }
  p(props = null, ...children) {
    return this.create("p", props, ...children);
  }
  span(props = null, ...children) {
    return this.create("span", props, ...children);
  }

  // List elements
  ul(props = null, ...children) {
    return this.create("ul", props, ...children);
  }
  li(props = null, ...children) {
    return this.create("li", props, ...children);
  }

  // Form elements
  form(props = null, ...children) {
    return this.create("form", props, ...children);
  }
  input(props = null) {
    return this.create("input", props);
  }
  button(props = null, ...children) {
    return this.create("button", props, ...children);
  }
  label(props = null, ...children) {
    return this.create("label", props, ...children);
  }
  select(props = null, ...children) {
    return this.create("select", props, ...children);
  }
  option(props = null, ...children) {
    return this.create("option", props, ...children);
  }

  // Media elements
  img(props = null) {
    return this.create("img", props);
  }
  video(props = null, ...children) {
    return this.create("video", props, ...children);
  }
  audio(props = null, ...children) {
    return this.create("audio", props, ...children);
  }

  /**
   * Generates a unique ID for elements
   * @param {string} [prefix='uid'] - Optional ID prefix
   * @returns {string} Unique ID in format 'prefix-counter'
   */
  generateUniqueId(prefix = "uid") {
    if (typeof prefix !== "string") {
      prefix = "uid";
    }
    return prefix + Math.random().toString(36);
  }

  /**
   * Creates an element with auto-generated unique ID
   * @param {string} type - HTML tag name
   * @param {Object|null} props - Element properties
   * @param {...any} children - Child elements
   * @returns {ComponentBuilder} Current builder instance
   */
  createWithId(type, props = null, ...children) {
    const id = this.generateUniqueId(type);
    const elementProps = props ? { ...props, id } : { id };
    return this.create(type, elementProps, ...children);
  }

  /**
   * Creates a data container element with attributes
   * @param {Object} data - Data attributes (key-value pairs)
   * @param {Object|null} props - Additional element properties
   * @param {...any} children - Child elements
   * @returns {ComponentBuilder} Current builder instance
   * @throws {TypeError} If data is not an object
   */
  dataContainer(data, props = null, ...children) {
    if (typeof data !== "object" || data === null) {
      throw new TypeError("Data must be a non-null object");
    }

    const dataProps = Object.entries(data).reduce((acc, [key, value]) => {
      if (value != null) {
        acc[`data-${key}`] = value;
      }
      return acc;
    }, {});

    return this.create("div", { ...props, ...dataProps }, ...children);
  }

  /**
   * Conditionally includes elements based on a condition
   * @param {boolean} condition - Whether to include the elements
   * @param {Function} builderFn - Function that returns a ComponentBuilder
   * @returns {ComponentBuilder} Current builder instance
   * @throws {TypeError} If builderFn is not a function
   */
  conditional(condition, builderFn) {
    if (typeof builderFn !== "function") {
      throw new TypeError("builderFn must be a function");
    }

    if (condition) {
      const result = builderFn();
      this.elements.push(...result.elements);
    }
    return this;
  }

  /**
   * Creates mapped components from an array with automatic key handling
   * @param {Array} array - The array to map over
   * @param {Function} renderItem - Function that returns a component for each item
   * @returns {Array} Array of components with keys
   * @throws {TypeError} If array is not an array or renderItem is not a function
   */
  list(array, renderItem) {
    if (!Array.isArray(array)) {
      throw new TypeError("list() expects an array as first argument");
    }
    if (typeof renderItem !== "function") {
      throw new TypeError("list() expects a function as second argument");
    }

    return array
      .map((item, index) => {
        const element = renderItem(item, index);

        // Automatically add key prop if not provided
        if (
          element &&
          typeof element === "object" &&
          element.props &&
          !element.props.key
        ) {
          element.props.key = index;
        }

        return element;
      })
      .filter(Boolean); // Remove any null/undefined items
  }

  /**
   * Creates a fragment container that doesn't render itself
   * @param {Object|null} props - Fragment properties (ignored except for key)
   * @param {...any} children - Child elements
   * @returns {Array} Array of child elements
   */
  fragment(props = null, ...children) {
    // Process children (flatten arrays and handle null/undefined)
    const processedChildren = this._processChildren(children.flat());

    // Return just the children without any wrapper
    return processedChildren;
  }
}

/**
 * Creates a new ComponentBuilder instance
 * @returns {ComponentBuilder} New builder instance
 */
export function createComponent() {
  return new ComponentBuilder();
}
