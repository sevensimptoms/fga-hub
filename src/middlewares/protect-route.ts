import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';

// Middleware to protect the route
export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;

  if (!token) {
    req.flash('error', 'Please log in to access the dashboard.');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload; // Use JwtPayload
    const user = await User.findById(decoded.userId).select('-password').lean(); // Fetch user details

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/login');
    }

    // Attach the user object to the request
    req.user = user; // Augment the Request type
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    // console.error("JWT Verification Error:", err);
    req.flash('error', 'Invalid or expired token. Please log in again.');
    res.clearCookie('auth'); // Clear the invalid cookie
    return res.redirect('/login');
  }
};


declare global {
    namespace Express {
      interface Request {
        user?: any; // Или замените any на конкретный тип пользователя, если есть
      }
    }
  }