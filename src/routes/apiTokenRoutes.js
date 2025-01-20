const express = require('express');
const { createApiToken, getApiTokens, deleteApiToken } = require('../controllers/apiTokenController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, createApiToken);
router.get('/', authenticateToken, getApiTokens);
router.delete('/:id', authenticateToken, deleteApiToken);

module.exports = router;