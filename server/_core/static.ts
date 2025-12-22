import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { loggers } from "./logger";

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    loggers.server.error("Could not find build directory", {
      path: distPath,
      hint: "Make sure to build the client first with: pnpm run build",
    });
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
