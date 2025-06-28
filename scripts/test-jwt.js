#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

console.log('🧪 Testing JWT Token Generation and Validation');
console.log('==============================================\n');

// Datos de prueba
const testUser = {
  id: 1,
  email: 'test@example.com',
  rol: { name: 'admin' }
};

console.log('📝 Test User Data:', testUser);
console.log('🔑 JWT Secret:', JWT_SECRET ? `${JWT_SECRET.substring(0, 10)}...` : 'No secret found');

// Generar token
console.log('\n🔐 Generating JWT Token...');
const tokenPayload = {
  id: testUser.id,
  email: testUser.email,
  rol: testUser.rol?.name || 'user',
  iat: Math.floor(Date.now() / 1000)
};

const token = jwt.sign(tokenPayload, JWT_SECRET, {
  expiresIn: "1h",
});

console.log('✅ Token generated successfully');
console.log('📄 Token:', token);
console.log('📏 Token length:', token.length);

// Verificar token
console.log('\n🔍 Verifying JWT Token...');
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verified successfully');
  console.log('📋 Decoded payload:', decoded);
  
  // Verificar que los datos coinciden
  if (decoded.id === testUser.id && decoded.email === testUser.email) {
    console.log('✅ Token payload matches original data');
  } else {
    console.log('❌ Token payload does not match original data');
  }
  
} catch (error) {
  console.log('❌ Token verification failed:', error.message);
}

// Probar con secret incorrecto
console.log('\n🧪 Testing with wrong secret...');
try {
  const decoded = jwt.verify(token, "wrong_secret");
  console.log('❌ Token should not be valid with wrong secret');
} catch (error) {
  console.log('✅ Correctly rejected token with wrong secret:', error.message);
}

// Probar token expirado
console.log('\n🧪 Testing expired token...');
const expiredToken = jwt.sign(tokenPayload, JWT_SECRET, {
  expiresIn: "1s",
});

// Esperar 2 segundos para que expire
setTimeout(() => {
  try {
    const decoded = jwt.verify(expiredToken, JWT_SECRET);
    console.log('❌ Expired token should not be valid');
  } catch (error) {
    console.log('✅ Correctly rejected expired token:', error.message);
  }
}, 2000);

console.log('\n🎯 JWT Test completed!'); 