// src/database/data-source.ts
import { DataSource } from "typeorm";
import { config } from 'dotenv';

config(); 

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'SOA',
  synchronize: false,
  logging: true,
  entities: ["src/infrastructure/entity/**/*.ts"],
  migrations: [],
  subscribers: [],
});

// Inicializar la conexión
AppDataSource.initialize()
  .then(() => console.log("Conexión a la base de datos establecida"))
  .catch((error) => console.log("Error de conexión:", error));
