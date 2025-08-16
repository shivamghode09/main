# Contributing to Gravix

Thank you for your interest in contributing to **Gravix**! This document provides guidelines and instructions for contributing to this project.

---

## About Gravix

Gravix is a solo-maintained project created by **Shivam Ghode** that aims to provide powerful, intuitive tools for developers. Your contributions help make this project better for everyone.

---

## Getting Started

### Prerequisites
Make sure you have the following installed before contributing:
- **Node.js** (v16 or higher recommended)
- **npm** 
- **Git**

### Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/main.git
   cd main
   ```

2. **Set Up Remote**
   ```bash
   git remote add upstream https://github.com/shivamghode09/main.git
   ```

---

## Development Workflow

### Branching Strategy
- **main** – stable production code  
- **dev** – active development branch for upcoming releases  
- **feat/*** – for new features (e.g. `feat/user-authentication`)  
- **fix/*** – for bug fixes (e.g. `fix/login-error`)  

---

### Making Changes

1. **Create a New Branch**
   ```bash
   git checkout dev
   git pull upstream dev
   git checkout -b feat/your-feature
   ```

2. **Make Your Changes**  
   Write your code, add necessary tests, and make sure everything runs correctly.

3. **Commit Your Changes** using the [Conventional Commits](https://www.conventionalcommits.org/) format:
   ```bash
   git commit -m "feat: add new component for data visualization"
   git commit -m "fix: resolve issue with CLI argument parsing"
   ```

4. **Push Your Branch**
   ```bash
   git push origin feat/your-feature
   ```

---

## Pull Request Process

- Create a **pull request against the `dev` branch**.  
- Fill out the provided **Pull Request Template** completely.  
- Wait for code review.  
- Address any requested changes.  
- Once approved, your PR will be merged into `dev`.  

---

## Coding Standards

### General Guidelines
- Use **2 spaces** for indentation  
- Use **descriptive variable and function names**  
- Write **self-documenting code** with comments for complex logic  
- **Follow existing style patterns** for consistency  

### JavaScript 
- Use modern **ES6+ features** appropriately  
- Add **JSDoc comments** for public APIs and complex functions  
- Avoid unnecessary dependencies  
- Write **unit tests** for all new functionality  

---

## Testing

- Run all existing tests before submitting:
  ```bash
  npm test
  ```
- Add new tests for new features or bug fixes.  
- Ensure **all tests pass** before creating your PR.  

---

## Documentation

- Update documentation whenever functionality changes.  
- Use **clear and concise language**.  
- Provide **examples** wherever helpful.  

---

## Communication

- For **general discussions or questions**, open a **Discussion** on GitHub.  
- For **bugs or feature requests**, use the respective **issue templates**.  
- For urgent matters, contact the maintainer directly at:  
  **shivamghode2021@gmail.com**  

---

## Release Process

- Releases are managed by the project maintainer.  
- **Semantic Versioning** (`MAJOR.MINOR.PATCH`) is followed for all releases.  
- Release notes will **credit all contributors**.  

---

## Thank You  

Thank you for helping make **Gravix** better! Every contribution, big or small, adds value to the project.  

---

Maintained by:  
**Shivam Ghode**  
Email: **shivamghode2021@gmail.com**  
GitHub: [@shivamghode09](https://github.com/shivamghode09)  

---