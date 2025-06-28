// api-gateway/src/index.ts
import express from "express";
import dotenv from "dotenv" // opcional si quieres separar login
import cors from "cors";
import { authenticateToken } from "./infrastructure/middleware/authJwt";
import { AuthRoutes } from "./infrastructure/routes/auth.routes";
import { UserRoutes } from "./infrastructure/routes/user.routes";
import { EventsRoutes } from "./infrastructure/routes/events.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2222;
// ✅ Acepta todos los orígenes
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

const authRoutes = new AuthRoutes()
const userRoutes = new UserRoutes()
const eventRoutes = new EventsRoutes()

app.use("/api/auth",authRoutes.router);
app.use("/api/users",authenticateToken, userRoutes.router);
app.use("/api/events",eventRoutes.router);

// Ruta de prueba para verificar JWT
app.get("/api/test", authenticateToken, (req, res) => {
  res.json({
    message: "Token válido!",
    user: (req as any).user,
    timestamp: new Date().toISOString()
  });
});

//app.use("/api/tickets",eventRoutes.router);
//app.use("/api/sales",eventRoutes.router);

app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
