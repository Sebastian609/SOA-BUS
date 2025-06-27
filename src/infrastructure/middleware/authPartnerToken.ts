import axios from "axios";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";

config();

export async function autenticatePartner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.body.token;

    if (!token) {
       res.status(400).json({ message: "Token is required" });
       return
    }

    const url = `${process.env.PARTNER_SERVICE_URL}/partners/token/${token}`;

    const response = await axios.get(url);

    if (!response.data?.success) {
       res.status(403).json({ message: response.data.message || "Invalid token" });
       return
    }

    next(); // autenticado correctamente
  } catch (error: any) {
    // Maneja errores HTTP de Axios (ej. 404, 500, etc.)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || "Authentication error";
       res.status(status).json({ message });
       return
    }

    // Otros errores inesperados
    res.status(500).json({ message: "Unexpected error" });
  }
}
