const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemConfig = sequelize.define('SystemConfig', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    key: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    value: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    timestamps: true
});

module.exports = SystemConfig;