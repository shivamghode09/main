# Contributing to Gravix

Thank you for considering contributing to **Gravix**!  
This guide explains the contribution workflow and standards for making changes to the project.

---

## Development Process

Since **Gravix** is primarily a **solo-maintained project** by *Shivam Ghode*, the contribution workflow is intentionally simple and streamlined:

---

### 1. Issue Tracking  
- All **features**, **enhancements**, and **bug reports** are tracked using **GitHub Issues**.  
- Before starting any work, please check existing issues to avoid duplication.  
- If your idea/bug isn’t listed, feel free to open a **new issue**.

---

### 2. Branching Strategy  
Use clear and descriptive branch names that follow the convention:

- **`main`** → Stable, production-ready code  
- **Feature branches** → `feat/your-feature-name`  
  *(Example: `feat/user-authentication`)*  
- **Bug fix branches** → `fix/short-bug-description`  
  *(Example: `fix/button-alignment`)*  

---

### 3. Commit Messages  
Gravix follows the **[Conventional Commits](https://www.conventionalcommits.org/)** specification.  
This ensures readable history, automated versioning, and cleaner release notes.

**Common types:**
- `feat:` → A new feature  
- `fix:` → A bug fix  
- `docs:` → Documentation changes only  
- `chore:` → Maintenance tasks (deps, tooling, etc.)  
- `refactor:` → Code changes that improve structure without changing behavior  
- `test:` → Adding or updating tests  

**Example commits:**
```bash
feat: add OAuth support in CLI
fix: resolve crash on invalid config file
docs: update setup instructions in README
```

---

### 4. Release Process  
- Gravix uses **semantic-release** to handle versioning and publishing.  
- **Every push to `main`** automatically triggers:  
  - Version bump (based on commit messages)  
  - Changelog generation  
  - Package release  

This makes releases consistent, predictable, and effortless.

---

## Contributor’s Checklist

Before submitting your changes:
1. Code should be properly formatted (2-space indentation).  
2. Tests should pass (`npm test`).  
3. Update/add documentation if applicable.  
4. Ensure commit messages follow **Conventional Commit rules**.  
5. Open a **Pull Request** targeting the `main` branch.  

---

## Final Note

Contributions—no matter how small—are always welcome!  
Even fixing a typo in documentation helps the project grow.  

Maintained by:  
**Shivam Ghode**  
Email: **shivamghode2021@gmail.com**  
GitHub: [@shivamghode09](https://github.com/shivamghode09)  

---
