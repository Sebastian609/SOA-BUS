// Errores específicos del dominio de eventos
export class EventDomainError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'EventDomainError';
  }
}

export class EventNotFoundError extends EventDomainError {
  constructor(eventId: number) {
    super(`Evento con ID ${eventId} no encontrado`, 404);
    this.name = 'EventNotFoundError';
  }
}

export class EventLocationNotFoundError extends EventDomainError {
  constructor(locationId: number) {
    super(`Ubicación de evento con ID ${locationId} no encontrada`, 404);
    this.name = 'EventLocationNotFoundError';
  }
}

export class EventNotAvailableError extends EventDomainError {
  constructor(eventId: number) {
    super(`El evento ${eventId} no está disponible`, 400);
    this.name = 'EventNotAvailableError';
  }
}

export class EventCapacityExceededError extends EventDomainError {
  constructor(eventId: number) {
    super(`El evento ${eventId} ha alcanzado su capacidad máxima`, 409);
    this.name = 'EventCapacityExceededError';
  }
}

export class EventDateExpiredError extends EventDomainError {
  constructor(eventId: number) {
    super(`El evento ${eventId} ya ha pasado`, 400);
    this.name = 'EventDateExpiredError';
  }
}

export class EventServiceUnavailableError extends EventDomainError {
  constructor() {
    super('Servicio de eventos no disponible', 503);
    this.name = 'EventServiceUnavailableError';
  }
} 