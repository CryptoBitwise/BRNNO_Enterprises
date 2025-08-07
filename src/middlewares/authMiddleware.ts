import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

// Interface for JWT payload
interface JWTPayload {
  id: string;
  email: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access token required'
      });
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Attach user data to request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    // Continue to the next middleware/route handler
    next();

  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        error: 'Invalid or expired token'
      });
    }
    
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}; 