import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

type AuthTokenPayload = JwtPayload & {
  userId: string;
};

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
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

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: 'Serverns auth-konfiguration saknas' });
    }
    return res.status(401).json({ message: 'Ogiltig eller utgången token' });
  }
};

export default authenticate;
