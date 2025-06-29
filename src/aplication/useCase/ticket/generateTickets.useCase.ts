import axios from "axios";
import { plainToInstance } from "class-transformer";
import { GenerateTicketsDto } from "./dto/generateTickets.dto";
import { GenerateTicketsResponseDto } from "./dto/generateTicketsResponse.dto";

export class GenerateTicketsUseCase {
  async execute(generateData: GenerateTicketsDto): Promise<GenerateTicketsResponseDto> {
    const ticketServiceUrl = process.env.TICKET_SERVICE_URL;
    if (!ticketServiceUrl) {
      throw new Error("TICKET_SERVICE_URL is not defined in environment variables");
    }

    try {
      const response = await axios.post(`${ticketServiceUrl}/tickets/generate`, generateData);
      
      const responseDto = plainToInstance(GenerateTicketsResponseDto, response.data, { 
        excludeExtraneousValues: true 
      });

      return responseDto;
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Error al generar tickets"
        };
      }
      throw { 
        status: 500, 
        message: "Error interno al conectar con el Ticket Service" 
      };
    }
  }
} 