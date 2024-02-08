const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    // No Authorization header, assuming it's a registration request
    return next();
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Invalid Authorization header format' });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Store the decoded user information in req.user
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
