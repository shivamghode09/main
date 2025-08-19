import { COLORS } from "./constants.js";
import { getTimestamp } from "../utils/helpers.js";

export const logInfo = (msg) => {
  console.log(
    `${getTimestamp()} ${COLORS.BRIGHT}${COLORS.INFO}[GRAVIX]${
      COLORS.RESET
    } ${msg}`
  );
};

export const logError = (msg) => {
  console.clear();
  console.log(
    `\n  ${COLORS.INFO}${COLORS.BRIGHT}GRAVIX${COLORS.RESET} ${COLORS.INFO}v1.0.0${COLORS.RESET} - Error message\n`
  );
  console.log(
    `${getTimestamp()} ${COLORS.BRIGHT}${COLORS.INFO}[GRAVIX]${
      COLORS.RESET
    } ${msg}`
  );
};

export const createCustomLogger = () => ({
  info: (msg) => {
    switch (true) {
      case msg.includes("ready in"):
        console.clear();
        console.log(
          `\n  ${COLORS.INFO}${COLORS.BRIGHT}GRAVIX${COLORS.RESET} ${COLORS.INFO}v1.0.0${COLORS.RESET} - Development server running\n`
        );
        break;
      case msg.includes("4173"):
        console.clear();
        console.log(
          `\n  ${COLORS.INFO}${COLORS.BRIGHT}GRAVIX${COLORS.RESET} ${COLORS.INFO}v1.0.0${COLORS.RESET} - Preview server running\n`
        );
        console.log(msg);
        break;
      case msg.includes("show help"):
        console.info(
          `  ${COLORS.GREEN}➜${COLORS.RESET}  press ${COLORS.BRIGHT}h + enter${COLORS.RESET} to show help`
        );
        console.info(
          `  ${COLORS.GREEN}➜${COLORS.RESET}  press ${COLORS.BRIGHT}ctrl + c${COLORS.RESET} to stop\n`
        );
        break;
      case msg.includes("building"):
        console.clear();
        console.log(
          `\n  ${COLORS.INFO}${COLORS.BRIGHT}GRAVIX${COLORS.RESET} ${COLORS.INFO}v1.0.0${COLORS.RESET} - Building for production\n`
        );
        break;
      case msg.includes("page reload"):
        logInfo(`(client) ${msg}`);
        break;
      case msg.includes("vite.config.js changed"):
        logInfo("gravix.config.js changed, restarting server...");
        logInfo(
          "(client) Re-optimizing dependencies because gravix config has changed"
        );
        break;
      default:
        if (
          msg.includes("Local") ||
          msg.includes("Network") ||
          msg.includes("modules") ||
          msg.includes("dist") ||
          msg.includes("built") ||
          msg.includes("Shortcuts") ||
          msg.includes("enter") ||
          msg.includes("server restarted")
        ) {
          console.log(
            msg.includes("Shortcuts") || msg.includes("enter")
              ? "  " + msg
              : msg
          );
        } else {
          logInfo(msg);
        }
    }
  },
  warn: (msg) => {
    console.clear();
    console.log(
      `\n  ${COLORS.INFO}${COLORS.BRIGHT}GRAVIX${COLORS.RESET} ${COLORS.INFO}v1.0.0${COLORS.RESET} - Warning message\n`
    );
    logInfo(msg);
  },
  error: (msg) => {
    console.clear();
    console.log(
      `\n  ${COLORS.INFO}${COLORS.BRIGHT}GRAVIX${COLORS.RESET} ${COLORS.INFO}v1.0.0${COLORS.RESET} - Error message\n`
    );
    logInfo(msg);
  },
});
