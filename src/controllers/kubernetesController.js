const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const K8S_API_SERVER = process.env.K8S_API_SERVER || 'https://kubernetes.default.svc';
const K8S_API_TOKEN = fs.readFileSync(process.env.K8S_API_TOKEN || '/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf8');
const K8S_CA_CERT = process.env.K8S_CA_CERT || '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt';

exports.getPods = async (req, res) => {
    try {
        const url = `${K8S_API_SERVER}/api/v1/pods`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${K8S_API_TOKEN.trim()}`
            },
            httpsAgent: new (require('https').Agent)({
                ca: fs.readFileSync(K8S_CA_CERT), // Usa el CA interno de Kubernetes
                rejectUnauthorized: false // Si tienes problemas de TLS, puedes cambiar esto
            })
        });

        const pods = response.data.items.map(pod => ({
            name: pod.metadata.name,
            namespace: pod.metadata.namespace,
            componentName: pod.metadata.labels?.app || 'Desconocido',
            containers: pod.spec.containers.map(container => ({
                name: container.name,
                image: container.image,
                version: container.image.split(':')[1] || 'latest'
            }))
        }));

        res.json(pods);
    } catch (error) {
        console.error('Error al obtener los pods:', error.message);
        res.status(500).json({ message: 'Error al obtener los pods', error: error.message });
    }
};