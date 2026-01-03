/**
 * ============================================================
 * File: logger.js
 * ------------------------------------------------------------
 * Purpose:
 * Simple custom logging middleware.
 *
 * Logs basic request information to the console
 * for monitoring and debugging purposes.
 * ============================================================
 */

const logger = (req, res, next) => {
  // Log HTTP method and requested URL
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

export default logger;
