import { Request, Response } from "express";
import axios from "axios";
import { plainToInstance } from "class-transformer";
import { LoginUserDto, SafeUserDto } from "../dto/users.dto";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { LoginUseCase } from "../../aplication/useCase/user/login.useCase";

config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class LoginFlow {
  private loginUseCase: LoginUseCase;

  constructor() {
    this.loginUseCase = new LoginUseCase();
  }

  async login(req: Request, res: Response) {
    try {
      const dto = plainToInstance(LoginUserDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Datos de login inválidos",
          errors: errors.map(e => ({ property: e.property, constraints: e.constraints }))
        });
      }

      const { email, password } = dto;

      // Usar el useCase para autenticar
      const user = await this.loginUseCase.authenticateUser(email, password);
      console.log(`User authenticated successfully: ${user.email}`);

      const safeUser = plainToInstance(SafeUserDto, user, { excludeExtraneousValues: true });

      // Generar token JWT con información del usuario
      const tokenPayload = {
        id: user.id,
        email: user.email,
        rol: user.rol?.name || 'user',
        iat: Math.floor(Date.now() / 1000)
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log(`JWT token generated successfully for user: ${user.email}`);

      return res.status(200).json({
        token,
        data: safeUser
      });
    } catch (error: any) {
      console.error("Login error:", error.message || error);
      if (error.status && error.message) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  }
}