const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Acceso denegado' });

    const token = authHeader.split(' ')[1]; // Obtiene solo el token
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };