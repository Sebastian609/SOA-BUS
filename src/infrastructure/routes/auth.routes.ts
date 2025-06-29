import { Router } from "express";
import { LoginFlow } from "../orquestation/login.flow";

export class AuthRoutes {
    public router: Router;
    private controller: LoginFlow;

    constructor() {
        this.router = Router();
        this.controller = new LoginFlow();
        this.routes();
    }

    private routes() {
        this.router.post("/login", this.controller.login.bind(this.controller));
    }
}

export default new AuthRoutes().router;
