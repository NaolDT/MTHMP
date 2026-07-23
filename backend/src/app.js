const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const sanitizeRequest = require('./shared/middlewares/sanitize');
const rateLimit = require('express-rate-limit');

const { clientUrl, env } = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFound } = require('./shared/middlewares/errorHandler');
const logger = require('./shared/utils/logger');

const app = express();

app.set('trust proxy', 1); 

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(
  morgan(env === 'production' ? 'combined' : 'dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;