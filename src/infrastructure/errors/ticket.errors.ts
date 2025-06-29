// Errores específicos del dominio de tickets
export class TicketDomainError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'TicketDomainError';
  }
}

export class TicketGenerationError extends TicketDomainError {
  constructor(quantity: number, eventLocationId: number) {
    super(`Error al generar ${quantity} tickets para el evento ${eventLocationId}`, 400);
    this.name = 'TicketGenerationError';
  }
}

export class InvalidTicketQuantityError extends TicketDomainError {
  constructor(quantity: number) {
    super(`Cantidad de tickets inválida: ${quantity}. Debe ser mayor a 0`, 400);
    this.name = 'InvalidTicketQuantityError';
  }
}

export class TicketEventLocationNotFoundError extends TicketDomainError {
  constructor(eventLocationId: number) {
    super(`Ubicación de evento ${eventLocationId} no encontrada`, 404);
    this.name = 'TicketEventLocationNotFoundError';
  }
}

export class TicketCapacityExceededError extends TicketDomainError {
  constructor(eventLocationId: number, requestedQuantity: number, availableCapacity: number) {
    super(`No se pueden generar ${requestedQuantity} tickets. Capacidad disponible: ${availableCapacity}`, 409);
    this.name = 'TicketCapacityExceededError';
  }
}

export class TicketServiceUnavailableError extends TicketDomainError {
  constructor() {
    super('Servicio de tickets no disponible', 503);
    this.name = 'TicketServiceUnavailableError';
  }
} 