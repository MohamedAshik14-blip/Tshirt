// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    // Check if the user has the 'admin' role
    if (req.user && req.user.role === 'admin') {
      // User has admin role, allow access to the route
      next();
    } else {
      // User doesn't have admin role, send an unauthorized response
      res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }
  };
  
  module.exports = adminMiddleware;
  