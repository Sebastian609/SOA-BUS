module.exports = {
    apps: [
      {
        name: 'sockets', // Nombre del proceso
        script: 'npm', // Comando que se ejecutará
        args: 'run start', // Argumentos pasados al comando (npm run start)
        instances: 1, // Número de instancias (ajusta según tu necesidad)
        autorestart: true, // Reinicia automáticamente si el proceso falla
        watch: false, // Desactiva reinicio automático al detectar cambios
        max_memory_restart: '500M', // Reinicia si usa más de 500 MB de memoria
        env: {
          // Server Configuration
          NODE_ENV: 'production',
          PORT: 2222,
          
          // Database Configuration
          DB_HOST: 'localhost',
          DB_PORT: 3306,
          DB_USERNAME: 'your_production_db_user',
          DB_PASSWORD: 'your_production_db_password',
          DB_NAME: 'soa_bus_db_production',
          
          // JWT Configuration
          JWT_SECRET: 'your_production_jwt_secret_key_here',
          
          // External Services
          PARTNER_URL_SERVICE: 'http://your-partner-service-url:2223',
          PARTNER_SERVICE_URL: 'http://your-partner-service-url:2223',
          EVENT_SERVICE_URL: 'http://your-event-service-url:2224',
          
          // CORS Configuration
          CORS_ORIGIN: '*',
          
          // Logging Configuration
          LOG_LEVEL: 'info',
          
          // Security Configuration
          BCRYPT_SALT_ROUNDS: 10
        },
        env_development: {
          NODE_ENV: 'development',
          PORT: 2222,
          DB_HOST: 'localhost',
          DB_PORT: 3306,
          DB_USERNAME: 'root',
          DB_PASSWORD: 'your_dev_password',
          DB_NAME: 'soa_bus_db_dev',
          JWT_SECRET: 'dev_jwt_secret_key',
          PARTNER_URL_SERVICE: 'http://localhost:2223',
          PARTNER_SERVICE_URL: 'http://localhost:2223',
          EVENT_SERVICE_URL: 'http://localhost:2224',
          CORS_ORIGIN: '*',
          LOG_LEVEL: 'debug',
          BCRYPT_SALT_ROUNDS: 10
        }
      }
    ]
  };
  