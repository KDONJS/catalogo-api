const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ClusterSource = sequelize.define('ClusterSource', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    clusterName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = ClusterSource;
