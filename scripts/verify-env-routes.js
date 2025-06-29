#!/usr/bin/env node

const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

console.log('🔍 Verificación de SERVICE_URL y Rutas');
console.log('=====================================\n');

// Variables de entorno definidas
const envVars = {
  'USER_SERVICE_URL': process.env.USER_SERVICE_URL,
  'PARTNER_SERVICE_URL': process.env.PARTNER_SERVICE_URL,
  'EVENT_SERVICE_URL': process.env.EVENT_SERVICE_URL,
  'TICKET_SERVICE_URL': process.env.TICKET_SERVICE_URL,
  'SALE_SERVICE_URL': process.env.SALE_SERVICE_URL,
  'SWAGGER_SERVER_URL': process.env.SWAGGER_SERVER_URL
};

// Rutas configuradas en el servidor
const configuredRoutes = [
  { path: '/api/auth', description: 'Autenticación', protected: false },
  { path: '/api/users', description: 'Usuarios', protected: true, service: 'USER_SERVICE_URL' },
  { path: '/api/events', description: 'Eventos', protected: false, service: 'EVENT_SERVICE_URL' },
  { path: '/api/tickets', description: 'Tickets', protected: true, service: 'TICKET_SERVICE_URL' },
  { path: '/api/sales', description: 'Ventas', protected: true, service: 'SALE_SERVICE_URL' },
  { path: '/api/partners', description: 'Partners', protected: false, service: 'PARTNER_SERVICE_URL' },
  { path: '/api/test', description: 'Prueba JWT', protected: true }
];

console.log('📋 Variables de Entorno:');
console.log('========================');
Object.entries(envVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  console.log(`${status} ${key}: ${value || 'NO DEFINIDA'}`);
});

console.log('\n🛣️  Rutas Configuradas:');
console.log('=======================');
configuredRoutes.forEach(route => {
  const protection = route.protected ? '🔒' : '🟢';
  const service = route.service ? `(${route.service})` : '';
  console.log(`${protection} ${route.path} - ${route.description} ${service}`);
});

console.log('\n🔍 Verificación de Uso:');
console.log('=======================');

// Verificar que cada SERVICE_URL tiene una ruta asociada
Object.entries(envVars).forEach(([key, value]) => {
  if (key.includes('SERVICE_URL') && key !== 'SWAGGER_SERVER_URL') {
    const hasRoute = configuredRoutes.some(route => route.service === key);
    const status = hasRoute ? '✅' : '❌';
    console.log(`${status} ${key} ${hasRoute ? 'tiene ruta asociada' : 'NO tiene ruta asociada'}`);
  }
});

// Verificar que cada ruta usa variables de entorno
console.log('\n🔧 Verificación de Implementación:');
console.log('==================================');

const routeFiles = [
  'src/infrastructure/routes/user.routes.ts',
  'src/infrastructure/routes/events.routes.ts',
  'src/infrastructure/routes/tickets.routes.ts',
  'src/infrastructure/routes/sales.routes.ts',
  'src/infrastructure/routes/partners.routes.ts'
];

routeFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const usesEnv = content.includes('process.env.');
    const usesDotenv = content.includes('dotenv') || content.includes('config()');
    const status = usesEnv && usesDotenv ? '✅' : '❌';
    console.log(`${status} ${file}: ${usesEnv ? 'Usa variables de entorno' : 'NO usa variables de entorno'}`);
  } catch (error) {
    console.log(`❌ ${file}: Archivo no encontrado`);
  }
});

console.log('\n📊 Resumen:');
console.log('===========');
const totalEnvVars = Object.keys(envVars).filter(key => key.includes('SERVICE_URL')).length;
const totalRoutes = configuredRoutes.filter(route => route.service).length;
const missingRoutes = totalEnvVars - totalRoutes;

console.log(`Total SERVICE_URL: ${totalEnvVars}`);
console.log(`Total rutas configuradas: ${totalRoutes}`);
console.log(`SERVICE_URL sin ruta: ${missingRoutes}`);

if (missingRoutes === 0) {
  console.log('🎉 ¡Todas las SERVICE_URL tienen rutas asociadas!');
} else {
  console.log('⚠️  Hay SERVICE_URL sin rutas asociadas');
}

console.log('\n✅ Verificación completada'); 