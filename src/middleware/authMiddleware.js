const jwt = require('jsonwebtoken');
const SystemConfig = require('../models/SystemConfig');

const authenticateToken = (req, res, next) => {
    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = req.headers?.authorization?.split(' ')[1];

    console.log('🔐 Token desde cookie:', tokenFromCookie);
    console.log('🔐 Token desde header:', tokenFromHeader);

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
        console.log('❌ No se encontró token');
        return res.status(401).json({ message: 'Acceso denegado. No hay token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('❌ Token inválido:', err.message);
            return res.status(403).json({ message: 'Token inválido' });
        }

        console.log('✅ Token verificado. Usuario decodificado:', user);
        req.user = user;
        next();
    });
};

const conditionalAuthMiddleware = async (req, res, next) => {
    try {
        const setupConfig = await SystemConfig.findOne({ where: { key: 'system_initialized' } });

        console.log('⚙️ Configuración de sistema encontrada:', setupConfig?.value);

        if (setupConfig && setupConfig.value === 'true') {
            console.log('🔐 Sistema ya inicializado. Se requiere autenticación.');
            return authenticateToken(req, res, next);
        }

        console.log('🆕 Sistema aún no inicializado. Permitiendo acceso sin autenticación.');
        next();
    } catch (error) {
        console.error('🔥 Error en middleware condicional:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = { authenticateToken, conditionalAuthMiddleware };