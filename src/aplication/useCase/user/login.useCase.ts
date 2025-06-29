import axios from "axios";

export class LoginUseCase {
  async authenticateUser(email: string, password: string) {
    const userServiceUrl = process.env.USER_SERVICE_URL;
    if (!userServiceUrl) {
      throw new Error("USER_SERVICE_URL is not defined in environment variables");
    }
    try {
      const response = await axios.post(`${userServiceUrl}/users/login`, { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Error en el servicio de autenticación"
        };
      }
      throw { status: 500, message: "Error interno al conectar con el User Service" };
    }
  }
} 