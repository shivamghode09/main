import { createComponent } from "./builder";

/**
 * Creates a pre-configured single element builder
 * @param {string} type - HTML tag name
 * @param {Object|null} props - Element properties
 * @param {...any} children - Child elements
 */
export function buildElement(type, props = null, ...children) {
  return createComponent().create(type, props, ...children);
}

/**
 * Creates mapped components from an array
 * @param {Array} array - The array to map over
 * @param {Function} renderItem - Function that returns a component for each item
 */
export function mapList(array, renderItem) {
  return createComponent().list(array, renderItem);
}

/**
 * Creates a empty fragment container
 * @param {Object|null} props - Fragment properties (ignored except for key)
 * @param {...any} children - Child elements
 */
export function Fragment(...children) {
  return createComponent().fragment(null, ...children);
}

// Structural Elements
export function div(props, ...children) {
  return createComponent().create("div", props, ...children);
}
export function span(props, ...children) {
  return createComponent().create("span", props, ...children);
}
export function section(props, ...children) {
  return createComponent().create("section", props, ...children);
}
export function article(props, ...children) {
  return createComponent().create("article", props, ...children);
}
export function aside(props, ...children) {
  return createComponent().create("aside", props, ...children);
}
export function header(props, ...children) {
  return createComponent().create("header", props, ...children);
}
export function footer(props, ...children) {
  return createComponent().create("footer", props, ...children);
}
export function nav(props, ...children) {
  return createComponent().create("nav", props, ...children);
}
export function main(props, ...children) {
  return createComponent().create("main", props, ...children);
}

// Text Elements
export function h1(props, ...children) {
  return createComponent().create("h1", props, ...children);
}
export function h2(props, ...children) {
  return createComponent().create("h2", props, ...children);
}
export function h3(props, ...children) {
  return createComponent().create("h3", props, ...children);
}
export function h4(props, ...children) {
  return createComponent().create("h4", props, ...children);
}
export function h5(props, ...children) {
  return createComponent().create("h5", props, ...children);
}
export function h6(props, ...children) {
  return createComponent().create("h6", props, ...children);
}
export function p(props, ...children) {
  return createComponent().create("p", props, ...children);
}
export function a(props, ...children) {
  return createComponent().create("a", props, ...children);
}
export function strong(props, ...children) {
  return createComponent().create("strong", props, ...children);
}
export function em(props, ...children) {
  return createComponent().create("em", props, ...children);
}
export function small(props, ...children) {
  return createComponent().create("small", props, ...children);
}
export function mark(props, ...children) {
  return createComponent().create("mark", props, ...children);
}
export function del(props, ...children) {
  return createComponent().create("del", props, ...children);
}
export function ins(props, ...children) {
  return createComponent().create("ins", props, ...children);
}
export function sub(props, ...children) {
  return createComponent().create("sub", props, ...children);
}
export function sup(props, ...children) {
  return createComponent().create("sup", props, ...children);
}
export function blockquote(props, ...children) {
  return createComponent().create("blockquote", props, ...children);
}
export function code(props, ...children) {
  return createComponent().create("code", props, ...children);
}
export function pre(props, ...children) {
  return createComponent().create("pre", props, ...children);
}

// Form Elements
export function form(props, ...children) {
  return createComponent().create("form", props, ...children);
}
export function input(props) {
  return createComponent().create("input", props);
}
export function button(props, ...children) {
  return createComponent().create("button", props, ...children);
}
export function textarea(props, ...children) {
  return createComponent().create("textarea", props, ...children);
}
export function select(props, ...children) {
  return createComponent().create("select", props, ...children);
}
export function option(props, ...children) {
  return createComponent().create("option", props, ...children);
}
export function label(props, ...children) {
  return createComponent().create("label", props, ...children);
}
export function fieldset(props, ...children) {
  return createComponent().create("fieldset", props, ...children);
}
export function legend(props, ...children) {
  return createComponent().create("legend", props, ...children);
}
export function datalist(props, ...children) {
  return createComponent().create("datalist", props, ...children);
}
export function output(props, ...children) {
  return createComponent().create("output", props, ...children);
}

// Media Elements
export function img(props) {
  return createComponent().create("img", props);
}
export function video(props, ...children) {
  return createComponent().create("video", props, ...children);
}
export function audio(props, ...children) {
  return createComponent().create("audio", props, ...children);
}
export function source(props) {
  return createComponent().create("source", props);
}
export function track(props) {
  return createComponent().create("track", props);
}
export function canvas(props, ...children) {
  return createComponent().create("canvas", props, ...children);
}
export function figure(props, ...children) {
  return createComponent().create("figure", props, ...children);
}
export function figcaption(props, ...children) {
  return createComponent().create("figcaption", props, ...children);
}

// List Elements
export function ul(props, ...children) {
  return createComponent().create("ul", props, ...children);
}
export function ol(props, ...children) {
  return createComponent().create("ol", props, ...children);
}
export function li(props, ...children) {
  return createComponent().create("li", props, ...children);
}
export function dl(props, ...children) {
  return createComponent().create("dl", props, ...children);
}
export function dt(props, ...children) {
  return createComponent().create("dt", props, ...children);
}
export function dd(props, ...children) {
  return createComponent().create("dd", props, ...children);
}

// Table Elements
export function table(props, ...children) {
  return createComponent().create("table", props, ...children);
}
export function caption(props, ...children) {
  return createComponent().create("caption", props, ...children);
}
export function thead(props, ...children) {
  return createComponent().create("thead", props, ...children);
}
export function tbody(props, ...children) {
  return createComponent().create("tbody", props, ...children);
}
export function tfoot(props, ...children) {
  return createComponent().create("tfoot", props, ...children);
}
export function tr(props, ...children) {
  return createComponent().create("tr", props, ...children);
}
export function th(props, ...children) {
  return createComponent().create("th", props, ...children);
}
export function td(props, ...children) {
  return createComponent().create("td", props, ...children);
}

// Semantic Elements
export function time(props, ...children) {
  return createComponent().create("time", props, ...children);
}
export function address(props, ...children) {
  return createComponent().create("address", props, ...children);
}
export function progress(props, ...children) {
  return createComponent().create("progress", props, ...children);
}
