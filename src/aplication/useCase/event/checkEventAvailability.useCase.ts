import axios from "axios";
import { plainToInstance } from "class-transformer";
import { EventAvailabilityDto } from "./dto/event-availability.dto";
import { log } from "node:console";
import { EventLocationDto } from "./dto/eventLocation.dto";

export class CheckEventAvailabilityUseCase {
  async execute(eventLocationId: number): Promise<EventLocationDto> {
    const eventServiceUrl = process.env.EVENT_SERVICE_URL;
    if (!eventServiceUrl) {
      throw new Error("EVENT_SERVICE_URL is not defined in environment variables");
    }

    try {

      console.log(`${eventServiceUrl}events/event-locations/${eventLocationId}/available`);
      
      const response = await axios.get(`${eventServiceUrl}/events/event-locations/${eventLocationId}/available`);
      
      
      const availabilityDto = plainToInstance(EventAvailabilityDto, response.data, { excludeExtraneousValues: true });
      if (!availabilityDto.isAvailable) {
        throw new Error("Evento no disponible")
      } 



      return plainToInstance( EventLocationDto,response.data.eventLocation )
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
         throw new Error("error")// Evento no encontrado, por lo tanto no está disponible
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