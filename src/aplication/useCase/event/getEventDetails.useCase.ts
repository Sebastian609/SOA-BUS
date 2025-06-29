import axios from "axios";

export class GetEventDetailsUseCase {
  async execute(eventId: number) {
    const eventServiceUrl = process.env.EVENT_SERVICE_URL;
    if (!eventServiceUrl) {
      throw new Error("EVENT_SERVICE_URL is not defined in environment variables");
    }

    try {
      const response = await axios.get(`${eventServiceUrl}/events/${eventId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || "Error al obtener detalles del evento"
        };
      }
      throw { 
        status: 500, 
        message: "Error interno al conectar con el Event Service" 
      };
    }
  }
} 