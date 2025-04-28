const jwt = require('jsonwebtoken');
const SystemConfig = require('../models/SystemConfig');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // 🔥 Obtener token desde la cookie

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token en la cookie.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user; // ✅ Guardar usuario autenticado en `req.user`
        next();
    });
};

// Middleware condicional que verifica si el sistema está inicializado
const conditionalAuthMiddleware = async (req, res, next) => {
    try {
        // Verificar si el sistema ya está inicializado
        const setupConfig = await SystemConfig.findOne({ where: { key: 'system_initialized' } });
        
        // Si el sistema ya está inicializado, requerir autenticación
        if (setupConfig && setupConfig.value === 'true') {
            return authenticateToken(req, res, next);
        }
        
        // Si el sistema no está inicializado, permitir el acceso sin autenticación
        next();
    } catch (error) {
        console.error('Error en middleware condicional:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = { authenticateToken, conditionalAuthMiddleware };