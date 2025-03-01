const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id: { 
        type: DataTypes.UUID, 
        primaryKey: true, 
        defaultValue: DataTypes.UUIDV4 
    },
    username: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'user' 
    },
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    apellidos: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false, 
        validate: { isEmail: true } 
    },
    estado: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Usuario;