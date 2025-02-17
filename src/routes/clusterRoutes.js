const express = require('express');
const router = express.Router();
const clusterController = require('../controllers/clusterController');

router.post('/register-source', clusterController.registerSource);
router.get('/sources', clusterController.getSources);
router.get('/collect-data', clusterController.collectData);
router.get('/data/:clusterName', clusterController.getClusterData);

module.exports = router;