const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const SystemConfig = require('../models/SystemConfig');
const Usuario = require('../models/Usuario');
const { sequelize } = require('../config/database');

/**
 * Verifica si el sistema ya ha sido inicializado
 */
exports.checkSetupStatus = async (req, res) => {
    try {
        const setupConfig = await SystemConfig.findOne({ where: { key: 'system_initialized' } });
        const isInitialized = setupConfig && setupConfig.value === 'true';
        
        res.json({ 
            initialized: isInitialized,
            message: isInitialized ? 
                'El sistema ya ha sido inicializado' : 
                'El sistema necesita ser inicializado con un administrador'
        });
    } catch (error) {
        console.error('Error al verificar estado de inicialización:', error);
        res.status(500).json({ message: 'Error al verificar estado del sistema', error: error.message });
    }
};

/**
 * Configura el primer usuario administrador
 */
exports.setupAdmin = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        // Verificar si el sistema ya está inicializado
        const setupConfig = await SystemConfig.findOne({ 
            where: { key: 'system_initialized' },
            transaction
        });
        
        if (setupConfig && setupConfig.value === 'true') {
            await transaction.rollback();
            return res.status(400).json({ 
                message: 'El sistema ya ha sido inicializado previamente' 
            });
        }
        
        // Validar datos del administrador
        const { username, password, nombre, apellidos, email } = req.body;
        
        if (!username || !password || !nombre || !apellidos || !email) {
            await transaction.rollback();
            return res.status(400).json({ 
                message: 'Todos los campos son obligatorios: username, password, nombre, apellidos, email' 
            });
        }
        
        // Crear el usuario administrador
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = await Usuario.create({
            id: uuidv4(),
            username,
            password: hashedPassword,
            role: 'admin',
            nombre,
            apellidos,
            email,
            estado: true
        }, { transaction });
        
        // Marcar el sistema como inicializado
        await SystemConfig.create({
            key: 'system_initialized',
            value: 'true'
        }, { transaction });
        
        await transaction.commit();
        
        res.status(201).json({ 
            message: 'Sistema inicializado correctamente con usuario administrador',
            user: {
                id: adminUser.id,
                username: adminUser.username,
                role: adminUser.role,
                nombre: adminUser.nombre,
                email: adminUser.email
            }
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al inicializar el sistema:', error);
        res.status(500).json({ 
            message: 'Error al inicializar el sistema', 
            error: error.message 
        });
    }
};