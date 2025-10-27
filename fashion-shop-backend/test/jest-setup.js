const dotenv = require('dotenv');
const path = require('path');

// Cargar .env.test para los tests E2E
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
