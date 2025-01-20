const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Registro = sequelize.define('Registro', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    nombrePod: DataTypes.STRING,
    nombreComponente: DataTypes.STRING,
    squad: DataTypes.STRING,
    ramaProd: DataTypes.STRING,
    namespace: DataTypes.STRING,
    cluster: DataTypes.STRING,
    ingress: DataTypes.STRING,
    proyecto: DataTypes.STRING,
    ultimoScaneoSonarCloud: DataTypes.STRING,
    resultadoEscaneo: DataTypes.STRING,
    secretManager: DataTypes.BOOLEAN,
    criticidad: DataTypes.STRING,
    baseDatos: DataTypes.STRING,
    fase: DataTypes.STRING
}, {
    timestamps: true
});

module.exports = Registro;
