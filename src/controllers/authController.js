const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/Usuario');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await Usuario.create({ id: uuidv4(), username, password: hashedPassword });
        res.json({ message: 'Usuario registrado', user });
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar usuario', error });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await Usuario.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000
    });

    res.json({ message: 'Login exitoso', user: { id: user.id, username: user.username } });
};

exports.session = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ user: { id: decoded.id, username: decoded.username } });
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido', error });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token'); // 🔹 Eliminamos la cookie del cliente
    res.json({ message: 'Logout exitoso' });
};