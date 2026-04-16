import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

type UserRole = 'adopter' | 'organization';

type AuthTokenPayload = JwtPayload & {
  userId: string;
  role?: UserRole;
};

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    role?: UserRole;
  };
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET saknas i miljövariablerna');
  }
  return secret;
};

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Saknar giltig token' });
  }

  console.log("Authorization header:", authHeader);

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
    console.log("Decoded token:", decoded);
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Ogiltig token' });
    }

    const role =
      decoded.role === 'organization' || decoded.role === 'adopter'
        ? decoded.role
        : undefined;

    req.user = { userId: decoded.userId, role };
    next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: 'Serverns auth-konfiguration saknas' });
    }
    return res.status(401).json({ message: 'Ogiltig eller utgången token' });
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.user?.role;
  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Åtkomst nekad' });
  }

  return next();
};

export default authenticate;
