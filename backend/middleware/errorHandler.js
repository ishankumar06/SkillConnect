// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message,
    // Send stack only in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
