import axios from "axios";
import { plainToInstance } from "class-transformer";
import { CreateSaleDto } from "./dto/createSale.dto";

export class CreateSaleUseCase {
  async execute(saleData: CreateSaleDto) {
    const saleServiceUrl = process.env.SALE_SERVICE_URL;
    if (!saleServiceUrl) {
      throw new Error("SALE_SERVICE_URL is not defined in environment variables");
    }

    try {
      const response = await axios.post(`${saleServiceUrl}/sales`, saleData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Error al crear la venta"
        };
      }
      throw { 
        status: 500, 
        message: "Error interno al conectar con el Sale Service" 
      };
    }
  }
} 