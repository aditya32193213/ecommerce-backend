/**
 * ============================================================
 * File: errorHandler.js
 * ------------------------------------------------------------
 * Purpose:
 * Centralized error-handling middleware.
 *
 * This middleware captures all unhandled errors thrown
 * anywhere in the application and sends a consistent
 * error response to the client.
 * ============================================================
 */

export const errorHandler = (err, req, res, next) => {
  /**
   * If response status is still 200 (default),
   * update it to 500 (Internal Server Error).
   * Otherwise, preserve the existing status code.
   */
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log full error stack for debugging
  console.error(err.stack);

  // Send standardized error response
  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
  });
};
