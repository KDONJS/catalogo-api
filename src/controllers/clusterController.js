const axios = require('axios');
const ClusterSource = require('../models/ClusterSource');
const { Op } = require('sequelize');

/**
 * 🔹 Registrar una nueva fuente de datos en la BD
 */
exports.registerSource = async (req, res) => {
    try {
        const { clusterName, url } = req.body;

        if (!clusterName || !url) {
            return res.status(400).json({ message: "❌ clusterName y url son obligatorios" });
        }

        // Verificar si ya existe
        const existingSource = await ClusterSource.findOne({ where: { clusterName } });
        if (existingSource) {
            return res.status(400).json({ message: "❌ Este cluster ya está registrado" });
        }

        // Guardar en la BD
        await ClusterSource.create({ clusterName, url });

        res.json({ message: `✅ Fuente ${clusterName} registrada correctamente` });
    } catch (error) {
        console.error('❌ Error al registrar la fuente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * 🔹 Obtener todas las fuentes registradas
 */
exports.getSources = async (req, res) => {
    try {
        const sources = await ClusterSource.findAll();
        res.json(sources);
    } catch (error) {
        console.error('❌ Error al obtener las fuentes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};



/**
 * 🔹 Editar una fuente de datos existente en la BD
 */
exports.updateSource = async (req, res) => {
    try {
        const { id } = req.params; // ID de la fuente a actualizar
        const { clusterName, url } = req.body;

        if (!clusterName || !url) {
            return res.status(400).json({ message: "❌ clusterName y url son obligatorios" });
        }

        // Verificar si la fuente existe
        const source = await ClusterSource.findByPk(id);
        if (!source) {
            return res.status(404).json({ message: "❌ Fuente de datos no encontrada" });
        }

        // Verificar si el clusterName ya está en uso por otro registro
        const existingSource = await ClusterSource.findOne({
            where: {
                clusterName,
                id: { [Op.ne]: id } // ✅ Corregido para SQLite
            }
        });

        if (existingSource) {
            return res.status(400).json({ message: "❌ Ya existe una fuente con este nombre de cluster" });
        }

        // Actualizar la fuente en la base de datos
        await source.update({ clusterName, url });

        res.json({ message: `✅ Fuente ${clusterName} actualizada correctamente` });
    } catch (error) {
        console.error('❌ Error al actualizar la fuente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * 🔹 Eliminar una fuente de datos en la BD
 */
exports.deleteSource = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la fuente existe
        const source = await ClusterSource.findByPk(id);
        if (!source) {
            return res.status(404).json({ message: "❌ Fuente de datos no encontrada" });
        }

        // Eliminar la fuente
        await source.destroy();

        res.json({ message: `✅ Fuente ${source.clusterName} eliminada correctamente` });
    } catch (error) {
        console.error('❌ Error al eliminar la fuente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


/**
 * 🔹 Recolectar datos de todas las fuentes registradas con una URL base tomada de la primera fuente
 */
exports.collectData = async (req, res) => {
    try {
        const sources = await ClusterSource.findAll();

        if (!sources.length) {
            return res.status(404).json({ message: "❌ No hay fuentes registradas en la base de datos." });
        }

        console.log(`📌 Se encontraron ${sources.length} fuentes registradas.`);

        // Obtener la URL base de la primera fuente registrada
        const BASE_URL = sources[0].url;
        console.log(`🔗 Usando URL base: ${BASE_URL}`);

        const clusterData = {};

        const clusterPromises = sources.map(async (source) => {
            const requestUrl = `${BASE_URL}/kubernetes/pods`;
            console.log(`🔍 Obteniendo datos del cluster: ${source.clusterName} desde ${requestUrl}`);

            try {
                const response = await axios.get(requestUrl);
                const rawData = response.data;

                console.log(`📌 Datos obtenidos desde ${requestUrl}:`, rawData);

                // Procesar cada clave en la respuesta (cada componente será una clave en el objeto)
                Object.keys(rawData).forEach(componentName => {
                    const replicas = rawData[componentName];

                    if (!Array.isArray(replicas)) {
                        console.warn(`⚠️ La clave ${componentName} no contiene un array de pods.`);
                        return;
                    }

                    if (!clusterData[source.clusterName]) {
                        clusterData[source.clusterName] = [];
                    }

                    clusterData[source.clusterName].push({
                        componentName,
                        replicas: replicas.map(replica => ({
                            name: replica.name,
                            namespace: replica.namespace,
                            status: replica.status,
                            startTime: replica.startTime,
                            conditions: replica.conditions || [],
                            nodeName: replica.nodeName || "No asignado",
                            podIP: replica.podIP || "No asignado",
                            nodeIP: replica.nodeIP || "No asignado",
                            restartCount: replica.restartCount || 0,
                            cpuUsage: replica.cpuUsage || "0 mCPU",
                            memoryUsage: replica.memoryUsage || "0 MiB",
                            containers: (replica.containers || []).map(container => ({
                                name: container.name,
                                image: container.image,
                                version: container.version,
                                resources: {
                                    requests: container.resources?.requests || { cpu: "No definido", memory: "No definido" },
                                    limits: container.resources?.limits || { cpu: "No definido", memory: "No definido" }
                                }
                            })),
                            volumes: (replica.volumes || []).map(volume => ({
                                name: volume.name,
                                persistentVolumeClaim: volume.persistentVolumeClaim || "N/A"
                            })),
                            events: replica.events || []
                        }))
                    });
                });

                console.log(`✅ Datos procesados correctamente para ${source.clusterName}`);

            } catch (error) {
                console.error(`❌ Error al obtener datos de ${source.clusterName}:`, error.message);
            }
        });

        await Promise.all(clusterPromises);

        console.log(`📌 Datos recolectados:`, JSON.stringify(clusterData, null, 2));

        res.json(clusterData);
    } catch (error) {
        console.error('❌ Error al recolectar datos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


/**
 * 🔹 Proxy para obtener datos del cluster sin modificar su estructura, usando la primera URL registrada.
 */
exports.getClusterData = async (req, res) => {
    const { clusterName } = req.params;

    try {
        // Obtener la primera fuente registrada en la base de datos
        const sources = await ClusterSource.findAll();

        if (!sources.length) {
            return res.status(500).json({ message: "❌ No hay fuentes registradas en la base de datos." });
        }

        const BASE_URL = sources[0].url; // ✅ Se usa la primera URL
        console.log(`🔗 Usando URL base: ${BASE_URL}`);

        // Construir la URL del cluster con la base dinámica
        const requestUrl = `${BASE_URL}/kubernetes/pods`;
        console.log(`🔍 Redirigiendo la solicitud a: ${requestUrl}`);

        // Hacer la solicitud a la URL construida
        const response = await axios.get(requestUrl);

        // Enviar la respuesta original sin modificar
        res.json(response.data);
    } catch (error) {
        console.error(`❌ Error al obtener datos de ${clusterName}:`, error.message);
        res.status(500).json({ message: `Error al obtener datos del cluster ${clusterName}` });
    }
};

/**
 * 🔹 Proxy para obtener datos de un componente específico dentro de un cluster, usando la primera URL registrada.
 */
exports.getClusterDataComponente = async (req, res) => {
    const { clusterName, componente } = req.params; // ✅ Capturar los dos parámetros

    try {
        // Obtener la primera fuente registrada en la base de datos
        const sources = await ClusterSource.findAll();

        if (!sources.length) {
            return res.status(500).json({ message: "❌ No hay fuentes registradas en la base de datos." });
        }

        const BASE_URL = sources[0].url; // ✅ Se usa la primera URL
        console.log(`🔗 Usando URL base: ${BASE_URL}`);

        // Construir la URL para obtener los datos del componente dentro del cluster
        const requestUrl = `${BASE_URL}/kubernetes/pods/componentName/${componente}`;
        console.log(`🔍 Redirigiendo la solicitud a: ${requestUrl}`);

        // Hacer la solicitud a la URL construida
        const response = await axios.get(requestUrl);

        // Enviar la respuesta original sin modificar
        res.json(response.data);
    } catch (error) {
        console.error(`❌ Error al obtener datos de ${componente} en el cluster ${clusterName}:`, error.message);
        res.status(500).json({ message: `Error al obtener datos del componente ${componente} en el cluster ${clusterName}` });
    }
};

/**
 * 🔹 Proxy para escalar deployments usando la primera URL registrada.
 */
exports.proxyScaleDeployment = async (req, res) => {
    const { namespace, deploymentName } = req.params;
    const { replicas } = req.body;

    try {
        // Validar el número de réplicas
        if (!replicas || isNaN(replicas) || replicas < 0) {
            return res.status(400).json({
                message: "❌ El número de réplicas debe ser un número entero positivo"
            });
        }

        // Obtener la primera fuente registrada en la base de datos
        const sources = await ClusterSource.findAll();

        if (!sources.length) {
            return res.status(500).json({ message: "❌ No hay fuentes registradas en la base de datos." });
        }

        const BASE_URL = sources[0].url; // ✅ Se usa la primera URL
        console.log(`🔗 Usando URL base: ${BASE_URL}`);

        // Construir la URL para escalar el deployment
        const requestUrl = `${BASE_URL}/kubernetes/deployments/${namespace}/${deploymentName}/scale`;
        console.log(`🔍 Redirigiendo la solicitud a: ${requestUrl}`);

        // Hacer la solicitud a la URL construida
        const response = await axios.patch(requestUrl, { replicas: parseInt(replicas) });

        // Enviar la respuesta original sin modificar
        res.json(response.data);
    } catch (error) {
        console.error(`❌ Error al escalar deployment ${deploymentName} en namespace ${namespace}:`, error.message);
        res.status(500).json({ 
            message: `Error al escalar el deployment ${deploymentName}`, 
            error: error.message 
        });
    }
};

/**
 * 🔹 Proxy para eliminar pods usando la primera URL registrada.
 */
exports.proxyDeletePod = async (req, res) => {
    const { namespace, podName } = req.params;

    try {
        // Obtener la primera fuente registrada en la base de datos
        const sources = await ClusterSource.findAll();

        if (!sources.length) {
            return res.status(500).json({ message: "❌ No hay fuentes registradas en la base de datos." });
        }

        const BASE_URL = sources[0].url; // ✅ Se usa la primera URL
        console.log(`🔗 Usando URL base: ${BASE_URL}`);

        // Construir la URL para eliminar el pod
        const requestUrl = `${BASE_URL}/kubernetes/pods/${namespace}/${podName}`;
        console.log(`🔍 Redirigiendo la solicitud a: ${requestUrl}`);

        // Hacer la solicitud a la URL construida
        const response = await axios.delete(requestUrl);

        // Enviar la respuesta original sin modificar
        res.json(response.data);
    } catch (error) {
        console.error(`❌ Error al eliminar pod ${podName} en namespace ${namespace}:`, error.message);
        res.status(500).json({ 
            message: `Error al eliminar el pod ${podName}`, 
            error: error.message 
        });
    }
};

