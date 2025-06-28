// api-gateway/src/middleware/authJwt.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

// Cargar variables de entorno
config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  console.log("🔐 JWT Authentication - Headers:", req.headers);
  console.log("🔐 JWT Authentication - Auth Header:", authHeader);
  console.log("🔐 JWT Authentication - Token:", token ? `${token.substring(0, 20)}...` : 'No token');
  console.log("🔐 JWT Authentication - JWT_SECRET:", JWT_SECRET ? `${JWT_SECRET.substring(0, 10)}...` : 'No secret');

  try {
    if (!token) {
      console.log("❌ No token provided");
      res.status(401).json({ 
        message: "Token no proporcionado",
        error: "MISSING_TOKEN"
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified successfully:", decoded);

    (req as any).user = decoded;
    next();
  } catch (error: any) {
    console.log("❌ Token validation failed:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ 
        message: "Token expirado",
        error: "TOKEN_EXPIRED"
      });
      return;
    }
    
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ 
        message: "Token inválido",
        error: "INVALID_TOKEN"
      });
      return;
    }
    
    res.status(401).json({ 
      message: "Error en la validación del token",
      error: "TOKEN_VALIDATION_ERROR"
    });
    return;
  }
}
