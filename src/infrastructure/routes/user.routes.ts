// api-gateway/src/routes/user.routes.ts
import { Router } from "express";
import proxy from "express-http-proxy";
import { config } from "dotenv";

// Cargar variables de entorno
config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:2221/api";

export class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use("/", proxy(USER_SERVICE_URL, {
      proxyReqPathResolver: req => {
        const cleanedPath = req.originalUrl;
        const finalTarget = `${USER_SERVICE_URL}${cleanedPath}`;
        console.log("👤 [USER SERVICE] Proxying request:");
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
    }));
  }
}

export default new UserRoutes().router;
