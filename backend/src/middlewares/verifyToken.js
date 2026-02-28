import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

/**
 * Middleware to verify JWT for protected routes.
 * Throws error to be caught by asyncHandler / global error handler.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const cookieToken = req.cookies?.token;

  let token;
  if (authHeader) {
    const parts = authHeader.split(' ');
    token = parts.length === 2 ? parts[1] : undefined; // Bearer <token>
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    const err = new Error('No token provided');
    err.statusCode = 401;
    throw err;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next(); // token is valid, proceed
  } catch (e) {
    const err = new Error('Invalid token');
    err.statusCode = 401;
    throw err;
  }
};
