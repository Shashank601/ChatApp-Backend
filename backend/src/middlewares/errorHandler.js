import logger from '../config/logger.js';

export default function errorHandler(err, req, res, next) {
    logger.error(err.stack || err);

    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({ error: message });
};
