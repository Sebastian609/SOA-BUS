#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

console.log('🔍 JWT Debug - Checking Secret Consistency');
console.log('==========================================\n');

// Verificar variables de entorno
console.log('📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 20)}...` : 'NOT SET');
console.log('USER_SERVICE_URL:', process.env.USER_SERVICE_URL);

// Simular el proceso de login controller
console.log('\n🔐 Simulating Login Controller:');
const loginControllerSecret = process.env.JWT_SECRET || "default_secret";
console.log('Login Controller JWT_SECRET:', loginControllerSecret ? `${loginControllerSecret.substring(0, 20)}...` : 'NOT SET');

const testUser = {
  id: 1,
  email: 'test@example.com',
  rol: { name: 'admin' }
};

const tokenPayload = {
  id: testUser.id,
  email: testUser.email,
  rol: testUser.rol?.name || 'user',
  iat: Math.floor(Date.now() / 1000)
};

const generatedToken = jwt.sign(tokenPayload, loginControllerSecret, {
  expiresIn: "1h",
});

console.log('Generated Token:', generatedToken);
console.log('Token Length:', generatedToken.length);

// Simular el proceso de middleware
console.log('\n🔐 Simulating JWT Middleware:');
const middlewareSecret = process.env.JWT_SECRET || "default_secret";
console.log('Middleware JWT_SECRET:', middlewareSecret ? `${middlewareSecret.substring(0, 20)}...` : 'NOT SET');

try {
  const decoded = jwt.verify(generatedToken, middlewareSecret);
  console.log('✅ Token verification successful');
  console.log('Decoded payload:', decoded);
} catch (error) {
  console.log('❌ Token verification failed:', error.message);
  console.log('Error name:', error.name);
}

// Verificar si los secretos son iguales
console.log('\n🔍 Secret Comparison:');
console.log('Login Controller Secret:', loginControllerSecret);
console.log('Middleware Secret:', middlewareSecret);
console.log('Secrets are equal:', loginControllerSecret === middlewareSecret);

// Probar con diferentes secretos
console.log('\n🧪 Testing with different scenarios:');

// Escenario 1: Sin JWT_SECRET (usa default)
delete process.env.JWT_SECRET;
const token1 = jwt.sign({ test: 'data' }, "default_secret", { expiresIn: "1h" });
try {
  jwt.verify(token1, "default_secret");
  console.log('✅ Scenario 1: Default secret works');
} catch (error) {
  console.log('❌ Scenario 1 failed:', error.message);
}

// Escenario 2: Con JWT_SECRET personalizado
process.env.JWT_SECRET = "my_custom_secret_123";
const token2 = jwt.sign({ test: 'data' }, process.env.JWT_SECRET, { expiresIn: "1h" });
try {
  jwt.verify(token2, process.env.JWT_SECRET);
  console.log('✅ Scenario 2: Custom secret works');
} catch (error) {
  console.log('❌ Scenario 2 failed:', error.message);
}

console.log('\n🎯 Debug completed!'); 