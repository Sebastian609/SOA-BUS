// Errores específicos del dominio de ventas
export class SaleDomainError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'SaleDomainError';
  }
}

export class SaleEventNotAvailableError extends SaleDomainError {
  constructor(eventId: number) {
    super(`El evento ${eventId} no está disponible para la venta`, 400);
    this.name = 'SaleEventNotAvailableError';
  }
}

export class UserNotAuthorizedError extends SaleDomainError {
  constructor(userId: number) {
    super(`El usuario ${userId} no está autorizado para realizar esta venta`, 403);
    this.name = 'UserNotAuthorizedError';
  }
}

export class InsufficientBalanceError extends SaleDomainError {
  constructor() {
    super('Saldo insuficiente para completar la venta', 402);
    this.name = 'InsufficientBalanceError';
  }
}

export class EventSalesClosedError extends SaleDomainError {
  constructor(eventId: number) {
    super(`El evento ${eventId} ya no acepta ventas`, 409);
    this.name = 'EventSalesClosedError';
  }
} 