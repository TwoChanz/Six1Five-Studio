import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';

// When the app runs on Vercel (production or preview) it must never fall back
// to the built-in development secrets below: they are public in the repo, so
// anyone could sign their own admin token or log in with the default password.
const isDeployed = Boolean(process.env.VERCEL);

// Development-only fallbacks. Ignored on Vercel.
const DEV_JWT_SECRET = 'your-secret-key-change-in-production';
const DEV_ADMIN_PASSWORD = 'admin615';

const JWT_EXPIRES_IN = '8h'; // 8 hour sessions

interface JWTPayload {
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * The secret used to sign and check admin tokens.
 * Returns null on Vercel when JWT_SECRET is not set, so admin access fails
 * closed instead of using a secret anyone can read.
 */
function getJwtSecret(): string | null {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (isDeployed) {
    console.error('🔐 JWT_SECRET is not set; admin login is disabled until it is.');
    return null;
  }
  return DEV_JWT_SECRET;
}

/**
 * Verify admin password
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (passwordHash) {
      // Production: bcrypt hash comparison
      return await bcrypt.compare(password, passwordHash);
    }

    // No hash set: plain-text comparison against ADMIN_PASSWORD.
    // The built-in default password is only allowed for local development.
    const expectedPassword = process.env.ADMIN_PASSWORD || (isDeployed ? undefined : DEV_ADMIN_PASSWORD);
    if (!expectedPassword) {
      console.error('🔐 No admin password is configured; admin login is disabled.');
      return false;
    }
    return password === expectedPassword;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate JWT token. Returns null when no signing secret is available.
 */
export function generateToken(): string | null {
  const secret = getJwtSecret();
  if (!secret) return null;

  const payload: JWTPayload = {
    role: 'admin',
  };

  return jwt.sign(payload, secret, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  const secret = getJwtSecret();
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded.role === 'admin' ? decoded : null;
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
