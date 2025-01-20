const {DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApiToken = sequelize.define('ApiToken', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, unique: true, allowNull: false },
    createdBy: { type: DataTypes.UUID, allowNull: false }
}, {
    timestamps: true
});

module.exports = ApiToken;