// api-gateway/src/routes/user.routes.ts
import { Router } from "express";
import proxy from "express-http-proxy"; // Asegúrate de tenerlo instalado

const USER_SERVICE_URL = "http://localhost:2221";

export class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use("/", proxy(USER_SERVICE_URL));
  }
}

export default new UserRoutes().router;
