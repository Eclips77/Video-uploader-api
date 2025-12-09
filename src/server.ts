import { app } from './app';
import { config } from './config/config';
import { Logger } from './infrastructure/logger/Logger';

const logger = Logger.getInstance();

const startServer = () => {
  try {
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
