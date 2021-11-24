/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
const jwt = require('jsonwebtoken');
const { getUserByIdOrEmail } = require('../services/users');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) return next();
  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') return next();

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) return next(403);

    getUserByIdOrEmail(decodedToken.id)
      .then((userFound) => {
        if (!userFound) return resp.status(400).json({ message: 'user not found' });
        req.userToken = decodedToken;
        return next();
      })
      .catch(() => next(403));
  });
};

module.exports.isAuthenticated = (req) => !!req.userToken;

module.exports.isAdmin = async (req) => {
  const user = await getUserByIdOrEmail(req.userToken.id);
  return user.roles.admin;
};

module.exports.requireAuth = (req, resp, next) => (!module.exports.isAuthenticated(req) ? next(401) : next());

module.exports.requireAdmin = async (req, resp, next) => {
  if (!module.exports.isAuthenticated(req)) return next(401);
  if (!(await module.exports.isAdmin(req))) return next(403);
  return next();
};
