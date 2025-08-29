## Polished GitHub Issue

**Title:**  
`[BUG] Gravix UI – Newly created folders in src do not auto-register aliases until server restart`

## Description
When creating a new folder inside the `src` directory while using the Gravix UI library, an alias should automatically be created and registered. However, while Vite internally detects and creates the alias, the application does not reload or recognize the alias until the dev server is manually restarted.  

This breaks the expected workflow where developers assume new folders will be instantly usable without restarting.

## Package Affected
- [x] Gravix UI Library
- [ ] Gravix CLI
- [ ] Documentation
- [ ] Other (please specify)

## Environment
- Node.js version: [e.g. v16.15.0]
- npm version: [e.g. npm 8.5.5]
- ECMAScript version: [e.g. ES2022]
- Browser (if applicable): [e.g. Chrome 108]
- OS: [e.g. Windows 11, macOS 13.0]

## Steps To Reproduce
1. Create a new Gravix project and start the dev server with Vite.  
2. In the `src/` folder, create a new subfolder (e.g. `src/services`).  
3. Attempt to import from the new alias path.  
4. Notice that the alias is not resolved unless the server is stopped and restarted.  

## Expected Behavior
The alias for any new folder created inside `src/` should be automatically available without requiring a manual server restart.

## Actual Behavior
Aliases for new folders exist internally but are **not applied until the application is reloaded via stopping and restarting the server**.

## Code Sample
```javascript
// Example usage after creating src/services folder
import api from '@services/api';
// Expected: works instantly
// Actual: fails until server restart
```

## Possible Solution
Currently, a workaround is to stop and restart the dev server after creating new folders to refresh aliases.  
However, this is not ideal as it interrupts developer flow.  

**Potential approaches:**
- Trigger a “hot reload” or alias re-scan when new folders are created.  
- Add a custom Gravix watcher plugin that listens for new folders and re-registers aliases in Vite without requiring a full restart.  
- Provide a Gravix CLI command to “refresh aliases” on demand without stopping the dev server.  

## Additional Context
This issue affects developer experience when scaling a project and adding new folders on the fly. Automating alias refresh would greatly improve usability and productivity.  

<sub>Reported by: @shivamghode09</sub>