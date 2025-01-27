const xlsx = require('xlsx');
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

exports.uploadExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const registros = await Promise.all(data.map(async (row) => {
            return await Registro.create({
                id: uuidv4(),
                nombrePod: row['NOMBRE POD EN EKS'],
                nombreComponente: row['NOMBRE COMPONENTE'],
                squad: row['SQUAD'],
                modoDespliegue: row['MODO DE DESPLIEGUE'],
                ramaProd: row['RAMA PROD'],
                namespace: row['NAMESPACE'],
                ingress: row['INGRESS'],
                cluster: row['CLUSTER'],
                backendFrontend: row['BACKEND / FRONTEND'],
                proyecto: row['PROYECTO'],
                ultimoScaneoSonarCloud: row['Ulltimo Scaneo SonarCloud'],
                resultadoEscaneo: row['Resultado del escaneo'],
                secretManager: row['Secret Manager?'] === 'true',
                criticidad: row['Criticidad'],
                baseDatos: row['Base de Datos'],
                fase: row['Fase']
            });
        }));

        res.json({ message: 'Datos subidos correctamente', registros });
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        res.status(500).json({ message: 'Error al subir el archivo', error: error.message });
    }
};