const jwt = require('jsonwebtoken');

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

module.exports = { authenticateToken };