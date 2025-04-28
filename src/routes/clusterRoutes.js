const express = require('express');
const router = express.Router();
const clusterController = require('../controllers/clusterController');

router.post('/register-source', clusterController.registerSource);
router.get('/sources', clusterController.getSources);
router.put('/sources/:id', clusterController.updateSource); // Editar fuente
router.delete('/sources/:id', clusterController.deleteSource); // Eliminar fuente

router.get('/collect-data', clusterController.collectData);
router.get('/data/:clusterName', clusterController.getClusterData);
router.get('/data/:clusterName/:componente', clusterController.getClusterDataComponente);

// Rutas para proxy de escalado de deployments y eliminación de pods
router.patch('/deployments/:namespace/:deploymentName/scale', clusterController.proxyScaleDeployment);
router.delete('/pods/:namespace/:podName', clusterController.proxyDeletePod);

module.exports = router;