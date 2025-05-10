const { Sequelize } = require('sequelize');

// Datos de conexión (puedes usar variables de entorno en producción)
const DB_NAME = process.env.DB_NAME || 'devdb';
const DB_USER = process.env.DB_USER || 'devuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'devpass';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: console.log,
});

module.exports = { sequelize };