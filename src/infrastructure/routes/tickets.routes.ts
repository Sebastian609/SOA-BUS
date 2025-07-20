// api-gateway/src/infrastructure/routes/tickets.routes.ts
import { Router } from "express";
import proxy from "express-http-proxy";
import { authenticateToken } from "../middleware/authJwt";
import { config } from "dotenv";

// Cargar variables de entorno
config();

const TICKET_SERVICE_URL = process.env.TICKET_SERVICE_URL || "http://localhost:2225/api";

export class TicketsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // 🔒 Todas las rutas de tickets requieren autenticación
    this.router.use(
      "/",
      authenticateToken,
      proxy(TICKET_SERVICE_URL, {
        proxyReqPathResolver: req => {
          const cleanedPath = req.originalUrl;
          const finalTarget = `${TICKET_SERVICE_URL}${cleanedPath}`;
          console.log("🎫 [TICKET SERVICE] Proxying request:");
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

export default new TicketsRoutes().router; 