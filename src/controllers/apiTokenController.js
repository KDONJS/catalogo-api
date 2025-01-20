const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const ApiToken = require('../models/ApiToken');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

exports.createApiToken = async (req, res) => {
    try {
        const { name } = req.body;
        const rawToken = crypto.randomBytes(32).toString('hex'); // Genera un token aleatorio
        const hashedToken = jwt.sign({ rawToken }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const apiToken = await ApiToken.create({
            id: uuidv4(),
            name,
            token: hashedToken,
            createdBy: req.user.id
        });
        res.json({ message: 'Token de API creado', apiToken });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el token', error });
    }
};

exports.getApiTokens = async (req, res) => {
    try {
        const tokens = await ApiToken.findAll({ where: { createdBy: req.user.id } });
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tokens', error });
    }
};

exports.deleteApiToken = async (req, res) => {
    try {
        const { id } = req.params;
        const token = await ApiToken.findByPk(id);
        if (!token) return res.status(404).json({ message: 'Token no encontrado' });
        await token.destroy();
        res.json({ message: 'Token eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el token', error });
    }
};