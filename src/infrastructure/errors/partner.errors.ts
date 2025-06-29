// Errores específicos del dominio de partners
export class PartnerDomainError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'PartnerDomainError';
  }
}

export class PartnerTokenRequiredError extends PartnerDomainError {
  constructor() {
    super('Token de partner es requerido', 400);
    this.name = 'PartnerTokenRequiredError';
  }
}

export class PartnerTokenInvalidError extends PartnerDomainError {
  constructor() {
    super('Token de partner inválido', 403);
    this.name = 'PartnerTokenInvalidError';
  }
}

export class PartnerNotFoundError extends PartnerDomainError {
  constructor(partnerId: number) {
    super(`Partner con ID ${partnerId} no encontrado`, 404);
    this.name = 'PartnerNotFoundError';
  }
}

export class PartnerInactiveError extends PartnerDomainError {
  constructor(partnerId: number) {
    super(`El partner ${partnerId} está inactivo`, 403);
    this.name = 'PartnerInactiveError';
  }
}

export class PartnerServiceUnavailableError extends PartnerDomainError {
  constructor() {
    super('Servicio de partners no disponible', 503);
    this.name = 'PartnerServiceUnavailableError';
  }
} 