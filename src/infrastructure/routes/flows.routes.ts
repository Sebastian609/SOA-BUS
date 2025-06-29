// api-gateway/src/infrastructure/routes/partners.routes.ts
import { Router } from "express";
import proxy from "express-http-proxy";
import { authenticateToken } from "../middleware/authJwt";
import { autenticatePartner } from "../middleware/authPartnerToken";
import { CreateSaleFlow } from "../orquestation/createSale.flow";


export class FlowsRoutes {
  public router: Router;
  public flow: CreateSaleFlow

  constructor() {
    this.router = Router();
    this.flow = new CreateSaleFlow;
    this.routes();
  }

  private routes() {
    this.router.post("/create-sale",this.flow.execute.bind(this.flow))
  }
}

export default new FlowsRoutes().router; 