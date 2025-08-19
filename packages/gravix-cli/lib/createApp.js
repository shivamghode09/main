import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import boxen from "boxen";
import inquirer from "inquirer";
import ora from "ora";
import { spawn } from "child_process"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.resolve(__dirname, "../templates");

/**
 * Displays the welcome message with professional styling
 */
async function showWelcome() {
  console.clear();

  console.log(
    gradient.passion(
      figlet.textSync("  GRAVIX   ", {
        font: "Slant",
        horizontalLayout: "controlled smushing",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    )
  );

  const welcomeBox = boxen(
    chalk.cyanBright.bold(" SUPERCHARGE YOUR WEB DEVELOPMENT ") +
      "\n\n" +
      chalk.white("Get started with a modern, optimized Gravix project"),
    {
      padding: 1,
      margin: 1,
      borderStyle: "double",
      borderColor: "cyan",
      backgroundColor: "#1a1a2e",
      textAlignment: "center",
    }
  );

  console.log(welcomeBox);
}

/**
 * Validates project name with comprehensive checks
 */
function validateProjectName(name) {
  if (!name || typeof name !== "string") {
    throw new Error("Project name must be a non-empty string");
  }

  let validated = name.trim();

  if (validated.length === 0) {
    throw new Error("Project name cannot be empty");
  }

  if (!/^[a-z0-9@._-]+$/i.test(validated)) {
    throw new Error(
      "Project name can only contain letters, numbers, @, ., _ and -"
    );
  }

  const reservedNames = ["node", "npm", "test", "gravix"];
  if (reservedNames.includes(validated.toLowerCase())) {
    throw new Error(`"${validated}" is a reserved name`);
  }

  if (validated.startsWith(".") || validated.startsWith("-")) {
    throw new Error("Project name cannot start with . or -");
  }

  if (validated.length > 50) {
    throw new Error("Project name is too long (max 50 characters)");
  }

  return validated;
}

/**
 * Processes template files with replacements
 */
async function processTemplateFiles(projectPath, projectName) {
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`Template package.json not found at ${packageJsonPath}`);
    }
    
    const packageJson = JSON.parse(
      await fs.promises.readFile(packageJsonPath, "utf8")
    );

    packageJson.name = projectName.toLowerCase().replace(/\s+/g, "-");

    await fs.promises.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );
  } catch (error) {
    throw new Error(`Failed to process template files: ${error.message}`);
  }
}

/**
 * Shows animated initialization messages
 */
async function showInitializationMessages() {
  const initSpinner = ora({
    text: chalk.cyan("Initializing project structure"),
    spinner: {
      frames: ["▰▱▱▱▱", "▰▰▱▱▱", "▰▰▰▱▱", "▰▰▰▰▱", "▰▰▰▰▰"],
      interval: 120,
    },
  }).start();

  await new Promise((resolve) => setTimeout(resolve, 1500));
  initSpinner.succeed(chalk.green("Project structure initialized"));

  const configSpinner = ora({
    text: chalk.cyan("Configuring settings"),
    spinner: {
      frames: ["▰▱▱▱▱", "▰▰▱▱▱", "▰▰▰▱▱", "▰▰▰▰▱", "▰▰▰▰▰"],
      interval: 120,
    },
  }).start();

  await new Promise((resolve) => setTimeout(resolve, 1500));
  configSpinner.succeed(chalk.green("Settings configured"));
}

/**
 * Installs project dependencies with progress display
 */
async function installDependencies(projectPath) {
  const spinner = ora({
    text: chalk.cyan("Installing dependencies"),
    spinner: {
      frames: ["▰▱▱▱▱", "▰▰▱▱▱", "▰▰▰▱▱", "▰▰▰▰▱", "▰▰▰▰▰"],
      interval: 120,
    },
  }).start();

  try {
    await runCommand("npm", ["install"], projectPath);
    spinner.succeed(chalk.green("Dependencies installed successfully"));
  } catch (error) {
    spinner.fail(chalk.red("Failed to install dependencies"));
    throw error;
  }
}

/**
 * Runs shell commands with error handling
 */
async function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${command} failed with exit code ${code}`));
        return;
      }
      resolve();
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Shows post-install success message
 */
function showSuccessMessage(projectName) {
  console.log();
  console.log(
    chalk.bold.cyan("Project Commands:\n") +
      chalk.dim("  Development:\n") +
      chalk.cyan(`  cd ${projectName}`) +
      chalk.dim("        # Enter project\n") +
      chalk.cyan("  npm run gravix") +
      chalk.dim("   # Start dev server\n") +
      chalk.dim("\n  Production:\n") +
      chalk.cyan("  npm run build") +
      chalk.dim("    # Create production build\n") +
      chalk.cyan("  npm run preview") +
      chalk.dim("  # Locally test production\n\n")
  );

  console.log(
    chalk.bold.blue("CREATED WITH ❤️  BY\n") +
      gradient.rainbow(figlet.textSync("GRAVIX", { font: "Mini", width: 60 })) +
      chalk.dim("\nLead Architect of Gravix Ecosystem\n") +
      chalk.cyan("GitHub: ") +
      chalk.white("https://github.com/shivamghode09/main\n")
  );

  console.log(chalk.yellow("⭐ Star us on GitHub!\n"));

  console.log(gradient.morning("Happy coding!"));
}

/**
 * Copy template directory recursively (fallback for older Node.js versions)
 */
async function copyDirectory(source, destination) {
  if (typeof fs.promises.cp === 'function') {
    await fs.promises.cp(source, destination, { recursive: true });
    return;
  }

  // Fallback implementation for older Node versions
  await fs.promises.mkdir(destination, { recursive: true });
  const entries = await fs.promises.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Main function to create the Gravix app
 */
export async function createApp() {
  try {
    await showWelcome();

    let projectName = process.argv[2];
    if (!projectName) {
      const { name } = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Project name:",
          validate: (input) => {
            try {
              validateProjectName(input);
              return true;
            } catch (error) {
              return error.message;
            }
          },
        },
      ]);
      projectName = name;
    } else {
      try {
        projectName = validateProjectName(projectName);
      } catch (error) {
        throw new Error(`Invalid project name: ${error.message}`);
      }
    }

    // Added template directory check
    const templatePath = path.join(TEMPLATE_DIR, "base");
    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Template directory not found at: ${templatePath}\nPlease ensure the package was installed correctly.`
      );
    }

    await showInitializationMessages();

    const projectPath = path.resolve(process.cwd(), projectName);
    
    // Added check for existing directory
    if (fs.existsSync(projectPath)) {
      throw new Error(
        `Directory "${projectName}" already exists. Please choose a different name.`
      );
    }

    // Using the fallback method for copying
    await copyDirectory(templatePath, projectPath);

    await processTemplateFiles(projectPath, projectName);
    await installDependencies(projectPath);

    showSuccessMessage(projectName);
  } catch (error) {
    console.error(
      boxen(
        chalk.redBright.bold(" ERROR ") + "\n\n" + chalk.white(error.message),
        { padding: 1, margin: 1, borderStyle: "round", borderColor: "red" }
      )
    );
    process.exit(1);
  }
}