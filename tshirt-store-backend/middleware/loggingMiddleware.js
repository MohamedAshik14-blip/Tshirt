// middleware/loggingMiddleware.js
const loggingMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  };
  
  module.exports = loggingMiddleware;
  
  // middleware/errorHandlingMiddleware.js
  const errorHandlingMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  };
  
  module.exports = errorHandlingMiddleware;
  