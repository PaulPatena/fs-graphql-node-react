const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  try {
    if (!authHeader) {
      throw new Error('No authorization header.')
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
      throw new Error('No jwt token found.')
    }
  
    const decodedToken = jwt.verify(token, process.env.AUTH_SECRETKEY);
    if (!decodedToken) {
      throw new Error('Invalid jwt token.')
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
