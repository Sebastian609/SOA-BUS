import axios from "axios";
import { plainToInstance } from "class-transformer";
import { EventAvailabilityDto } from "./dto/event-availability.dto";

export class CheckEventAvailabilityUseCase {
  async execute(eventLocationId: number): Promise<boolean> {
    const eventServiceUrl = process.env.EVENT_SERVICE_URL;
    if (!eventServiceUrl) {
      throw new Error("EVENT_SERVICE_URL is not defined in environment variables");
    }

    try {
      const response = await axios.get(`${eventServiceUrl}/event-locations/${eventLocationId}/available`);
      const availabilityDto = plainToInstance(EventAvailabilityDto, response.data, { excludeExtraneousValues: true });
      return availabilityDto.isAvailable || false;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          return false; // Evento no encontrado, por lo tanto no está disponible
        }
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Error al verificar disponibilidad del evento"
        };
      }
      throw { 
        status: 500, 
        message: "Error interno al conectar con el Event Service" 
      };
    }
  }
} 