const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/Usuario');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

exports.register = async (req, res) => {
    const { username, password, role, nombre, apellidos, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Usuario.create({
            id: uuidv4(),
            username,
            password: hashedPassword,
            role,
            nombre,
            apellidos,
            email,
            estado: true
        });
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

    // 🚨 Validar si el usuario está inactivo
    if (!user.estado) {
        return res.status(403).json({ message: 'Usuario desactivado. No puede iniciar sesión.' });
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

/**
 * 📌 Listar todos los usuarios
 */
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
};

/**
 * 📌 Obtener usuario por ID
 */
exports.getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
};

/**
 * 📌 Actualizar usuario
 */
exports.updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role, nombre, apellidos, email } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.update({ username, role, nombre, apellidos, email });

        res.json({ message: 'Usuario actualizado', usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
};

/**
 * 📌 Eliminar usuario
 */
exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
};

/**
 * 📌 Cambiar estado de usuario (activo/inactivo)
 */
exports.toggleEstadoUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.estado = !usuario.estado;
        await usuario.save();

        res.json({ message: `Usuario ${usuario.estado ? 'activado' : 'desactivado'}`, usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar estado del usuario', error });
    }
};