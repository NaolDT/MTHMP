const app = require('./app');
const { port } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const { ensureSuperAdmin } = require('./config/bootstrap');
const logger = require('./shared/utils/logger');

let server;

async function start() {
  await connectDatabase();
  await ensureSuperAdmin();

  server = app.listen(port, () => {
    logger.info(`MTHMP API listening on port ${port}`);
  });
}

async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully`);
  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: reason?.message || reason });
});

start().catch((err) => {
  logger.error('Failed to start server', { error: err.message, stack: err.stack });
  process.exit(1);
});