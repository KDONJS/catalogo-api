const PodVersion = require('../models/PodVersion');

exports.getPodVersions = async (req, res) => {
    try {
        const filters = req.query;
        const podVersions = await PodVersion.findAll({ where: filters });
        res.json(podVersions);
    } catch (error) {
        console.error('Error al obtener versiones de pods:', error.message);
        res.status(500).json({ message: 'Error al obtener versiones de pods', error: error.message });
    }
};

exports.savePodVersion = async (req, res) => {
    try {
        const entries = Array.isArray(req.body) ? req.body : [req.body];
        
        const records = await Promise.all(entries.map(async (entry) => {
            return await PodVersion.create({
                componentName: entry.componentName,
                container: entry.container,
                image: entry.image,
                tagRollback: entry.tagRollback,
                aplico: entry.aplico
            });
        }));

        res.json({ message: 'Versiones de pods guardadas correctamente', data: records });
    } catch (error) {
        console.error('Error al guardar la versión del pod:', error.message);
        res.status(500).json({ message: 'Error al guardar la versión del pod', error: error.message });
    }
};