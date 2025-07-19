// api-gateway/src/index.ts
import express from "express";
import dotenv from "dotenv" // opcional si quieres separar login
import cors from "cors";
import { authenticateToken } from "./infrastructure/middleware/authJwt";
import { AuthRoutes } from "./infrastructure/routes/auth.routes";
import { UserRoutes } from "./infrastructure/routes/user.routes";
import { EventsRoutes } from "./infrastructure/routes/events.routes";
import { TicketsRoutes } from "./infrastructure/routes/tickets.routes";
import { SalesRoutes } from "./infrastructure/routes/sales.routes";
import { PartnersRoutes } from "./infrastructure/routes/partners.routes";
import { setupSwagger } from "./infrastructure/config/swagger";
import { FlowsRoutes } from "./infrastructure/routes/flows.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2222;
// ✅ Acepta todos los orígenes
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Swagger UI
setupSwagger(app);

const authRoutes = new AuthRoutes()
const userRoutes = new UserRoutes()
const eventRoutes = new EventsRoutes()
const ticketsRoutes = new TicketsRoutes()
const salesRoutes = new SalesRoutes()
const partnersRoutes = new PartnersRoutes()
const flowRoutes = new FlowsRoutes()

//puente a los demas servicios
app.use("/api/auth",authRoutes.router);
app.use("/api/users", authenticateToken, userRoutes.router);
app.use("/api/events", eventRoutes.router);
app.use("/api/tickets", authenticateToken,ticketsRoutes.router);
app.use("/api/sales", authenticateToken,salesRoutes.router);
app.use("/api/partners", authenticateToken,partnersRoutes.router);

//orequetaciones
app.use("/api/flows",flowRoutes.router)

app.get("/api/test", authenticateToken, (req, res) => {
  res.json({
    message: "Token válido!",
    user: (req as any).user,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`-${process.env.EVENT_SERVICE_URL}`);
  
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api/docs`);
});
