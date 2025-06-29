// api-gateway/src/infrastructure/routes/partners.routes.ts
import { Router } from "express";
import proxy from "express-http-proxy";
import { authenticateToken } from "../middleware/authJwt";
import { autenticatePartner } from "../middleware/authPartnerToken";
import { config } from "dotenv";

// Cargar variables de entorno
config();

const PARTNER_SERVICE_URL = process.env.PARTNER_SERVICE_URL || "http://localhost:2224/api";

export class PartnersRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // 🟢 Rutas públicas que requieren autenticación de partner
    this.router.use(
      "/token",
      autenticatePartner,
      proxy(PARTNER_SERVICE_URL, {
        proxyReqPathResolver: req => req.originalUrl,
        userResDecorator: async (proxyRes, proxyResData, req, res) => {
          try {
            return JSON.parse(proxyResData.toString("utf8"));
          } catch (err) {
            return proxyResData.toString("utf8");
          }
        }
      })
    );

    // 🔒 Rutas protegidas que requieren JWT
    this.router.use(
      "/",
      authenticateToken,
      proxy(PARTNER_SERVICE_URL, {
        proxyReqPathResolver: req => req.originalUrl,
        userResDecorator: async (proxyRes, proxyResData, req, res) => {
          try {
            return JSON.parse(proxyResData.toString("utf8"));
          } catch (err) {
            return proxyResData.toString("utf8");
          }
        }
      })
    );
  }
}

export default new PartnersRoutes().router; 