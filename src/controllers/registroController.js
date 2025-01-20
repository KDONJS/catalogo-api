const Registro = require('../models/Registro');
const { v4: uuidv4 } = require('uuid');

exports.createRegistro = async (req, res) => {
    const registro = await Registro.create({ id: uuidv4(), ...req.body });
    res.json(registro);
};

exports.getRegistros = async (req, res) => {
    const registros = await Registro.findAll();
    res.json(registros);
};

exports.getRegistroById = async (req, res) => {
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro no encontrado' });
    res.json(registro);
};

exports.updateRegistro = async (req, res) => {
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro no encontrado' });
    await registro.update(req.body);
    res.json(registro);
};

exports.deleteRegistro = async (req, res) => {
    const registro = await Registro.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro no encontrado' });
    await registro.destroy();
    res.json({ message: 'Registro eliminado' });
};