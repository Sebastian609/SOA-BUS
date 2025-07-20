// api-gateway/src/infrastructure/routes/events.routes.ts
import { Router } from "express";
import proxy from "express-http-proxy";
import { authenticateToken } from "../middleware/authJwt";
import { autenticatePartner } from "../middleware/authPartnerToken";
import { config } from "dotenv";
config();

export class EventsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // 🔓 Rutas públicas (requieren token de partner)
    this.router.use(
      "/paginated",
      autenticatePartner,
      proxy(`${process.env.EVENT_SERVICE_URL}`, {
        proxyReqPathResolver: req => {
          const cleanedPath = req.originalUrl;
          const finalTarget = `${process.env.EVENT_SERVICE_URL}${cleanedPath}`;
          console.log("🔓 [PUBLIC - PARTNER] Proxying request:");
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

    // 🔒 Todas las demás rutas protegidas con JWT
    this.router.use(
      "/",
      authenticateToken,
      proxy(`${process.env.EVENT_SERVICE_URL}`, {
        proxyReqPathResolver: req => {
          const cleanedPath = req.originalUrl;
          const finalTarget = `${process.env.EVENT_SERVICE_URL}${cleanedPath}`;
          console.log("🔒 [PROTECTED - AUTH] Proxying request:");
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
