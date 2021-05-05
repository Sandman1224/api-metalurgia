
// ====================
// Puerto
// ====================
process.env.PORT = process.env.PORT || 3000;

// ====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Base de datos
// ====================
const dbName = 'metallurgy';
process.env.URLDB = process.env.URLDB || `mongodb://localhost:27017/${dbName}`;

// ====================
// Vencimiento del Token
// ====================
process.env.CADUCIDAD_TOKEN = '48h';

// ====================
// SED de autenticación
// ====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';