const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for token in Authorization header (for localStorage compatibility)
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  
  // If no token in header, check cookies (new secure method)
  if (!token && req.cookies) {
    token = req.cookies.jwt_token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
