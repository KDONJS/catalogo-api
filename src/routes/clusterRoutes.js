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

module.exports = router;