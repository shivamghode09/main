#!/usr/bin/env node
import { createApp } from "../lib/createApp.js";

// Start the application
createApp().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
