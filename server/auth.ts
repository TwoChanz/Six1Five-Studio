import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';

// JWT secret - should be in environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '8h'; // 8 hour sessions

// Admin password - should be hashed and stored in database in production
// For now, using environment variable with bcrypt hash
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 
  // Default: bcrypt hash of "admin615"
  '$2a$10$8ZqF5x.rJ5UzR6YvxJxQPuK2Y0Q8nL8vQ5tFJ4FQ8YvxJxQPuK2Y0';

interface JWTPayload {
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Verify admin password
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    // For development, use plain text comparison if hash is not set
    if (!process.env.ADMIN_PASSWORD_HASH) {
      const expectedPassword = process.env.ADMIN_PASSWORD || 'admin615';
      console.log('🔐 Using plain text password comparison (development mode)');
      return password === expectedPassword;
    }
    
    console.log('🔐 Using bcrypt hash comparison (production mode)');
    // Production: use bcrypt hash comparison
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate JWT token
 */
export function generateToken(): string {
  const payload: JWTPayload = {
    role: 'admin',
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid token');
    }
    return null;
  }
}

/**
 * Express middleware to protect admin routes
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Check for token in Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'No authentication token provided' 
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or expired token' 
    });
  }

  // Attach user info to request for use in route handlers
  (req as any).user = decoded;
  next();
}

/**
 * Generate bcrypt hash for a password (utility for setup)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

