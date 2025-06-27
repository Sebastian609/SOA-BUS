import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '2222'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'soa_bus_db',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
  },

  // External Services
  services: {
    partner: {
      url: process.env.PARTNER_URL_SERVICE || 'http://localhost:2223',
      serviceUrl: process.env.PARTNER_SERVICE_URL || 'http://localhost:2223',
    },
    events: {
      url: process.env.EVENT_SERVICE_URL || 'http://localhost:2224',
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
  },
};

// Validación de configuración crítica
export function validateConfig() {
  const requiredVars = [
    'DB_HOST',
    'DB_USERNAME', 
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Warning: Missing required environment variables:', missingVars);
    console.warn('Please check your .env file or environment configuration.');
  }

  return missingVars.length === 0;
}

// Función para obtener configuración específica
export function getConfig() {
  return config;
} 