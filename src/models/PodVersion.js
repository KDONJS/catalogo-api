const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PodVersion = sequelize.define('PodVersion', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    fechaPase: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    componentName: { type: DataTypes.STRING, allowNull: false },
    container: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    tagRollback: { type: DataTypes.STRING, allowNull: false },
    aplico: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
    timestamps: true
});

module.exports = PodVersion;