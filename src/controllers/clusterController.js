const axios = require('axios');
const ClusterSource = require('../models/ClusterSource');

// 📌 Objeto en memoria para almacenar los datos recolectados
//const collectedData = {};

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
 * 🔹 Recolectar datos de todas las fuentes registradas
 */

exports.collectData = async (req, res) => {
    try {
        const sources = await ClusterSource.findAll();

        if (!sources.length) {
            return res.status(404).json({ message: "❌ No hay fuentes registradas en la base de datos." });
        }

        console.log(`📌 Se encontraron ${sources.length} fuentes registradas.`);
        const clusterData = {};

        const clusterPromises = sources.map(async (source) => {
            console.log(`🔍 Obteniendo datos del cluster: ${source.clusterName} desde ${source.url}`);

            try {
                const response = await axios.get(source.url);
                const rawData = response.data;

                console.log(`📌 Datos obtenidos desde ${source.url}:`, rawData);

                // Extraer la clave correspondiente (Ejemplo: "clusterGCP", "clusterAWS", "clusterAzure")
                const clusterKey = Object.keys(rawData)[0]; // Se asume que hay solo una clave en la respuesta
                const clusterComponents = rawData[clusterKey];

                if (!Array.isArray(clusterComponents)) {
                    console.warn(`⚠️ La clave ${clusterKey} no contiene un array de componentes.`);
                    return;
                }

                clusterData[source.clusterName] = clusterComponents.map(component => ({
                    componentName: component.componentName,
                    replicas: component.replicas.map(replica => ({
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
                }));

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
 * 🔹 Proxy para obtener datos del cluster sin modificar su estructura.
 */
exports.getClusterData = async (req, res) => {
    const { clusterName } = req.params;

    try {
        // Buscar la URL del cluster en la base de datos
        const source = await ClusterSource.findOne({ where: { clusterName } });

        if (!source) {
            return res.status(404).json({ message: `❌ No se encontró la URL para el cluster ${clusterName}` });
        }

        console.log(`🔍 Redirigiendo la solicitud a: ${source.url}`);

        // Hacer la solicitud a la URL registrada
        const response = await axios.get(source.url);

        // Enviar la respuesta original sin modificar
        res.json(response.data);
    } catch (error) {
        console.error(`❌ Error al obtener datos de ${clusterName}:`, error.message);
        res.status(500).json({ message: `Error al obtener datos del cluster ${clusterName}` });
    }
};