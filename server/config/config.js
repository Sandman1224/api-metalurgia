
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

// ==============================
// SEED de autenticación de la App
// ==============================
process.env.APPSEED = process.env.APPSEED || '70F592DFAF4196BCCC15E652A94F44298BAB87B2AB3A868A788515E44AD378A7';

// =================
// Jwt key de la App
// =================
process.env.JWTKEY = process.env.JWTKEY || 'metallurgy-api';