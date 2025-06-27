#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 SOA-BUS Environment Setup');
console.log('============================\n');

const questions = [
  {
    name: 'NODE_ENV',
    message: 'Environment (development/production):',
    default: 'development'
  },
  {
    name: 'PORT',
    message: 'Server port:',
    default: '2222'
  },
  {
    name: 'DB_HOST',
    message: 'Database host:',
    default: 'localhost'
  },
  {
    name: 'DB_PORT',
    message: 'Database port:',
    default: '3306'
  },
  {
    name: 'DB_USERNAME',
    message: 'Database username:',
    default: 'root'
  },
  {
    name: 'DB_PASSWORD',
    message: 'Database password:',
    default: ''
  },
  {
    name: 'DB_NAME',
    message: 'Database name:',
    default: 'soa_bus_db'
  },
  {
    name: 'JWT_SECRET',
    message: 'JWT secret key (leave empty for auto-generation):',
    default: ''
  },
  {
    name: 'PARTNER_URL_SERVICE',
    message: 'Partner service URL:',
    default: 'http://localhost:2223'
  },
  {
    name: 'PARTNER_SERVICE_URL',
    message: 'Partner service URL (alternative):',
    default: 'http://localhost:2223'
  },
  {
    name: 'EVENT_SERVICE_URL',
    message: 'Event service URL:',
    default: 'http://localhost:2224'
  },
  {
    name: 'CORS_ORIGIN',
    message: 'CORS origin:',
    default: '*'
  },
  {
    name: 'LOG_LEVEL',
    message: 'Log level (debug/info/warn/error):',
    default: 'debug'
  },
  {
    name: 'BCRYPT_SALT_ROUNDS',
    message: 'BCrypt salt rounds:',
    default: '10'
  }
];

function generateJWTSecret() {
  return require('crypto').randomBytes(64).toString('hex');
}

function askQuestion(question, index) {
  return new Promise((resolve) => {
    rl.question(`${question.message} `, (answer) => {
      let value = answer.trim() || question.default;
      
      // Auto-generate JWT secret if empty
      if (question.name === 'JWT_SECRET' && !value) {
        value = generateJWTSecret();
        console.log(`   Generated JWT secret: ${value.substring(0, 20)}...`);
      }
      
      resolve({ [question.name]: value });
    });
  });
}

async function setupEnvironment() {
  const envVars = {};
  
  for (let i = 0; i < questions.length; i++) {
    const result = await askQuestion(questions[i], i);
    Object.assign(envVars, result);
  }
  
  // Generate .env content
  const envContent = `# ===========================================
# SOA-BUS Environment Configuration
# Generated on ${new Date().toISOString()}
# ===========================================

# ===========================================
# SERVER CONFIGURATION
# ===========================================
NODE_ENV=${envVars.NODE_ENV}
PORT=${envVars.PORT}

# ===========================================
# DATABASE CONFIGURATION (MySQL)
# ===========================================
DB_HOST=${envVars.DB_HOST}
DB_PORT=${envVars.DB_PORT}
DB_USERNAME=${envVars.DB_USERNAME}
DB_PASSWORD=${envVars.DB_PASSWORD}
DB_NAME=${envVars.DB_NAME}

# ===========================================
# JWT CONFIGURATION
# ===========================================
JWT_SECRET=${envVars.JWT_SECRET}

# ===========================================
# EXTERNAL SERVICES
# ===========================================
PARTNER_URL_SERVICE=${envVars.PARTNER_URL_SERVICE}
PARTNER_SERVICE_URL=${envVars.PARTNER_SERVICE_URL}
EVENT_SERVICE_URL=${envVars.EVENT_SERVICE_URL}

# ===========================================
# CORS CONFIGURATION
# ===========================================
CORS_ORIGIN=${envVars.CORS_ORIGIN}

# ===========================================
# LOGGING CONFIGURATION
# ===========================================
LOG_LEVEL=${envVars.LOG_LEVEL}

# ===========================================
# SECURITY CONFIGURATION
# ===========================================
BCRYPT_SALT_ROUNDS=${envVars.BCRYPT_SALT_ROUNDS}
`;

  // Write .env file
  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment configuration completed!');
  console.log(`📁 .env file created at: ${envPath}`);
  console.log('\n🔒 Remember to:');
  console.log('   - Keep your .env file secure and never commit it to version control');
  console.log('   - Update the JWT_SECRET in production');
  console.log('   - Configure proper database credentials');
  console.log('   - Set up external service URLs correctly');
  
  rl.close();
}

setupEnvironment().catch(console.error); 