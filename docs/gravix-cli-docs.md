# Gravix CLI Documentation

This comprehensive reference documentation provides a detailed guide to the Gravix CLI tooling, explaining its architecture, command structure, template system, and best practices for creating new Gravix applications.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Command Line Interface](#command-line-interface)
- [Implementation Details](#implementation-details)
- [Template System](#template-system)
- [Execution Flow](#execution-flow)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Support and Community](#support-and-community)
- [Author](#author)

## Introduction

<a id="introduction"></a>

Gravix CLI is a smart scaffolding tool that speeds up JavaScript development by reducing boilerplate and automating setup, so you can focus on building features faster. It creates a production-ready Gravix project structure with a single command.

**Key Features**:

- Quick setup with interactive or non-interactive modes
- Comprehensive project name validation
- Professional visual styling with animated progress indicators
- Cross-platform compatibility with fallback mechanisms
- Automatic dependency installation
- Production-ready project structure

## Installation

<a id="installation"></a>

The Gravix CLI can be used in several ways:

```bash
# Using npx (recommended for one-time use)
npx create-gravix-app my-project

# Install globally and use
npm install -g gravix-cli
create-gravix-app my-project
```

**System Requirements**:

- Node.js v14.0.0 or higher
- npm v6.0.0 or higher

## Command Line Interface

<a id="command-line-interface"></a>

**Command Syntax**:

```
create-gravix-app [project-name]
```

If no project name is provided, the CLI will prompt for one interactively.

**Exit Codes**:

- `0`: Success - project created successfully
- `1`: Error - failure during creation process

**Usage Examples**:

```bash
# Interactive mode
$ npx create-gravix-app

# Non-interactive mode
$ npx create-gravix-app e-commerce-app
```

## Implementation Details

<a id="implementation-details"></a>

The CLI is built with several key components:

1. **Visual Interface**:

   - Uses `figlet` and `gradient-string` for the ASCII art banner
   - `boxen` for styled message boxes
   - `chalk` for colored text output
   - `ora` for animated progress spinners

2. **Project Name Validation**:

   - Ensures names follow npm naming conventions
   - Checks for reserved names, illegal characters, and length constraints
   - Prevents starting with dots or hyphens

3. **File Operations**:

   - Copies template files with built-in fallback for older Node.js versions
   - Processes template files to replace placeholders
   - Validates template existence before proceeding

4. **Dependency Installation**:
   - Runs `npm install` in the created project directory
   - Provides visual feedback during installation
   - Handles errors gracefully

## Template System

<a id="template-system"></a>

The Gravix CLI uses a base template located at `templates/base/` which contains the starter files for a new project:

```
templates/base/
├── public/
|   ├── fonts/
|   |   └── Manrope-VariableFont_wght.ttf
│   ├── favicon.svg
│   ├── gravix.svg
├── src/
│   ├── app.css
│   ├── app.js
│   └── main.js
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

The CLI processes the template by:

1. Copying all files from the template to the new project directory
2. Updating the `package.json` to use the new project name
3. Preserving the structure and configuration for immediate development

## Execution Flow

<a id="execution-flow"></a>

The Gravix CLI follows this sequence when creating a new project:

1. **Display Welcome Banner**:

   - Shows a visually appealing Gravix banner and welcome message

2. **Project Name Collection**:

   - Gets project name from command line argument or interactive prompt
   - Validates the project name against naming rules

3. **Template Verification**:

   - Checks if the template directory exists
   - Ensures the project directory doesn't already exist

4. **Initialization Animation**:

   - Displays animated progress indicators for initialization steps

5. **Template Processing**:

   - Copies template files to the new project directory
   - Updates configuration files with project-specific information

6. **Dependency Installation**:

   - Installs required npm packages with progress indicator
   - Handles potential installation errors

7. **Success Message**:
   - Displays project commands and next steps
   - Shows branding and GitHub information

## Best Practices

<a id="best-practices"></a>

### Project Naming

1. **Recommended naming conventions**:

   - Use descriptive names reflecting the application's purpose
   - Follow kebab-case convention (e.g., `e-commerce-platform`)
   - Keep names concise but meaningful

2. **Naming restrictions**:
   - Only letters, numbers, @, ., \_ and -
   - Cannot start with . or -
   - Maximum 50 characters
   - Cannot use reserved names like "node", "npm", "test", "gravix"

### Post-Creation Workflow

After creating a project, the recommended workflow is:

```bash
# Navigate to project directory
cd my-project

# Start development server
npm run gravix

# For production builds
npm run build
npm run preview
```

## Troubleshooting

<a id="troubleshooting"></a>

Common issues and their solutions:

1. **"Directory already exists"**

   - **Solution**: Choose a different project name or remove the existing directory

2. **"Template directory not found"**

   - **Solution**: Ensure the package was installed correctly, or reinstall the CLI

3. **"Failed to install dependencies"**

   - **Solutions**:
     - Check your internet connection
     - Verify npm is working properly (`npm -v`)
     - Try installing dependencies manually after project creation

4. **"Invalid project name"**
   - **Solution**: Follow the naming rules outlined in the [Project Naming](#project-naming) section

## License

<a id="license"></a>

MIT © 2025 **Shivam Ghode** - **Gravix**

## Support and Community

<a id="support-and-community"></a>

If you encounter any issues or have questions:

- [Create an issue](https://github.com/shivamghode09/main/issues) on GitHub
- Email support: shivamghode2021@gmail.com

## Author

<a id="author"></a>

Created by **Shivam Ghode**, Lead Architect of the Gravix Ecosystem.

GitHub: [https://github.com/shivamghode09/main](https://github.com/shivamghode09/main)
