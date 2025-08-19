import { button, div, h1, h2, img, p, a, useMinor } from "gravix";
import gravixLogo from "/gravix.svg";
import "./app.css";

const App = () => {
  const [count, setCount] = useMinor(0);

  return div({ className: "container" }, [
    // Logo
    a(
      { href: "https://github.com/shivamghode09/main" },
      img({
        src: gravixLogo,
        alt: "Gravix Logo",
        className: "logo gravix",
        loading: "lazy",
      })
    ),

    // Main title and subtitle
    h1({ className: "title" }, "Welcome to Gravix"),
    h2({ className: "subtitle" }, "Fast. Minimal. Modern."),

    // Action button
    div({ className: "btn-container" }, [
      button(
        {
          onclick: () => setCount(count + 1),
          ariaLabel: `Increment counter to ${count + 1}`,
        },
        `Counter: ${count}`
      ),
    ]),

    // Instruction text
    p(
      { className: "description" },
      "Open app.js and app.css to start creating your masterpiece."
    ),

    // Footer
    p(
      { className: "footer" },
      `© ${new Date().getFullYear()} Gravix Starter | Crafted with Gravix`
    ),
  ]).build();
};

export default App;
