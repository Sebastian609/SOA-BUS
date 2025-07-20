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
        proxyReqPathResolver: req => {
          const cleanedPath = req.originalUrl;
          const finalTarget = `${PARTNER_SERVICE_URL}${cleanedPath}`;
          console.log("🟢 [PARTNER SERVICE - PUBLIC] Proxying request:");
          console.log("  🔸 Method:", req.method);
          console.log("  🔸 Original URL:", req.originalUrl);
          console.log("  🔸 Cleaned Path:", cleanedPath);
          console.log("  🎯 Final Target URL:", finalTarget);
          return cleanedPath;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          // 🔥 fuerza a que no acepte contenido comprimido
          proxyReqOpts.headers['accept-encoding'] = 'identity';
          return proxyReqOpts;
        },
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
        proxyReqPathResolver: req => {
          const cleanedPath = req.originalUrl;
          const finalTarget = `${PARTNER_SERVICE_URL}${cleanedPath}`;
          console.log("🔒 [PARTNER SERVICE - PROTECTED] Proxying request:");
          console.log("  🔸 Method:", req.method);
          console.log("  🔸 Original URL:", req.originalUrl);
          console.log("  🔸 Cleaned Path:", cleanedPath);
          console.log("  🎯 Final Target URL:", finalTarget);
          return cleanedPath;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
          // 🔥 fuerza a que no acepte contenido comprimido
          proxyReqOpts.headers['accept-encoding'] = 'identity';
          return proxyReqOpts;
        },
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