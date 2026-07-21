const mongoose = require('mongoose');
const { mongodbUri } = require('./env');
const logger = require('../shared/utils/logger');

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB connection error', { error: err.message }));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  await mongoose.connect(mongodbUri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };