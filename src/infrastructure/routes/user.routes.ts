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
      proxyReqPathResolver: req => req.originalUrl,
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
