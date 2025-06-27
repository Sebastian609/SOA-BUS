import { Router } from "express";
import { LoginController } from "../controller/login.controller";

export class AuthRoutes {
    public router: Router;
    private controller: LoginController;

    constructor() {
        this.router = Router();
        this.controller = new LoginController();
        this.routes();
    }

    private routes() {
        this.router.post("/login", this.controller.login.bind(this.controller));
    }
}

export default new AuthRoutes().router;
