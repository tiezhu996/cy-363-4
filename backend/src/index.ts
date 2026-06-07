import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./common/logger";
import { initDatabase } from "./config/database";

async function startServer() {
  try {
    await initDatabase(false);
    app.listen(env.port, "0.0.0.0", () => {
      logger.info(`API listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

startServer();
