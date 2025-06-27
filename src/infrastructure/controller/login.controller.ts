
import { Request, Response } from "express";
import axios from "axios";
import { plainToInstance } from "class-transformer";
import { LoginUserDto, SafeUserDto } from "../dto/users.dto";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class LoginController {
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

      const response = await axios.post("http://localhost:2221/api/users/login", { email, password });

      const user = response.data;
      const safeUser = plainToInstance(SafeUserDto, user, { excludeExtraneousValues: true });

      const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol?.name }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        token,
        data: safeUser
      });
    } catch (error: any) {
      console.error("Login error:", error.message);
      return res.status(error.response?.status || 500).json({
        message: error
      });
    }
  }
}