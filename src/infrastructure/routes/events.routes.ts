// api-gateway/src/infrastructure/routes/events.routes.ts
import { Router } from "express";
import proxy from "express-http-proxy";
import { authenticateToken } from "../middleware/authJwt";
import { autenticatePartner } from "../middleware/authPartnerToken";
import { config } from "dotenv";
config()

export class EventsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {

   this.router.use(
  "/paginated",
  autenticatePartner,
  proxy(`${process.env.EVENT_SERVICE_URL}`, {
    proxyReqPathResolver: req => req.originalUrl, // 👈 evita duplicar el path
    userResDecorator: async (proxyRes, proxyResData, req, res) => {
      try {
        return JSON.parse(proxyResData.toString("utf8"));
      } catch (err) {
        return proxyResData.toString("utf8");
      }
    }
  })
);


    // 🔒 Todas las demás rutas: protegidas
    this.router.use(
      "/",
      authenticateToken,
      proxy(process.env.EVENT_SERVICE_URL, {
        proxyReqPathResolver: req => req.originalUrl
      })
    );
  }
}
