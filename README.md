# Gravix - Modern JavaScript Tools

![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
![npm gravix](https://img.shields.io/npm/v/gravix)
![npm gravix](https://img.shields.io/npm/v/gravix-cli)
![GitHub stars](https://img.shields.io/github/stars/shivamghode09/main)
![GitHub issues](https://img.shields.io/github/issues/shivamghode09/main)

This repository contains two main projects:

1. **Gravix CLI** - A smart scaffolding tool for JavaScript projects
2. **Gravix UI Library** - A lightweight JavaScript library for building user interfaces

---

## Gravix CLI - Modern JavaScript Project Scaffolding

Gravix CLI is a smart scaffolding tool that speeds up JavaScript development by reducing boilerplate and automating setup.

### Features

- **Quick Setup**: Creates a production-ready project structure in seconds
- **Pre-configured**: Includes modern tooling out of the box
- **Dependency Management**: Automatically installs required packages
- **Hot Reloading**: Built-in development server with hot module replacement

## Requirements

- Node.js v14.0.0 or higher
- npm v6.0.0 or higher
- Modern web browser for development

## Installation Options

```bash
# Install globally
npm install -g gravix-cli

# Create a project
npx create-gravix-app <project-name>

# Navigate to project
cd <project-name>

# Start development server
npm run gravix
```

---

## Gravix UI Library - Modern JavaScript UI Library

A lightweight JavaScript library for building user interfaces with component-based architecture.

### Features

- **Lightning Fast**: Optimized virtual DOM implementation
- **Component-Based**: Create reusable UI components
- **Minimal Size**: Tiny footprint with no dependencies
- **Modern Architecture**: Built with modern JavaScript principles

### Installation

```bash
npm install gravix
```

## Quick Start

```javascript
import { h1 } from "gravix";

function App() {
  // Build DOM structure & Render the component
  return h1({ class: "title" }, "Hello Gravix!").build();
}

export default App;
```

## License

MIT License © 2025 **Shivam Ghode** - **Gravix**

## Author

Created by **Shivam Ghode**

---

**Gravix - Happy coding!**
