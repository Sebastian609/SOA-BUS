import axios from "axios";
import { plainToInstance } from "class-transformer";
import { EventLocationDto } from "./dto/eventLocation.dto";
import { EventLocationNotFoundError, EventServiceUnavailableError } from "../../../infrastructure/errors";

export class GetEventLocationUseCase {
  async execute(eventLocationId: number): Promise<EventLocationDto> {
    const eventServiceUrl = process.env.EVENT_SERVICE_URL;
    if (!eventServiceUrl) {
      throw new EventServiceUnavailableError();
    }

    try {
      const response = await axios.get(`${eventServiceUrl}/events/event-locations/${eventLocationId}`);
      
      const eventLocationDto = plainToInstance(EventLocationDto, response.data, { 
        excludeExtraneousValues: true 
      });

      return eventLocationDto;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          throw new EventLocationNotFoundError(eventLocationId);
        }
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Error al obtener ubicación de evento"
        };
      }
      throw { 
        status: 500, 
        message: "Error interno al conectar con el Event Service" 
      };
    }
  }
} 