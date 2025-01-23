const { Sequelize } = require('sequelize');
const path = require('path');

// Asegurar que SQLite almacena la BD en el volumen persistente
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_PATH,
    logging: console.log // Opcional: muestra logs de las consultas SQL
});

module.exports = { sequelize };