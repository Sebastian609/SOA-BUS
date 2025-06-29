// Errores específicos del dominio de autenticación
export class AuthDomainError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthDomainError';
  }
}

export class InvalidCredentialsError extends AuthDomainError {
  constructor() {
    super('Credenciales inválidas', 401);
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends AuthDomainError {
  constructor(email: string) {
    super(`Usuario con email ${email} no encontrado`, 404);
    this.name = 'UserNotFoundError';
  }
}

export class UserInactiveError extends AuthDomainError {
  constructor(userId: number) {
    super(`El usuario ${userId} está inactivo`, 403);
    this.name = 'UserInactiveError';
  }
}

export class TokenExpiredError extends AuthDomainError {
  constructor() {
    super('Token de autenticación expirado', 401);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends AuthDomainError {
  constructor() {
    super('Token de autenticación inválido', 401);
    this.name = 'InvalidTokenError';
  }
} 