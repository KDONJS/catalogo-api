const express = require('express');
const { createRegistro, getRegistros, getRegistroById, updateRegistro, deleteRegistro } = require('../controllers/registroController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, createRegistro);
router.get('/', authenticateToken, getRegistros);
router.get('/:id', authenticateToken, getRegistroById);
router.put('/:id', authenticateToken, updateRegistro);
router.delete('/:id', authenticateToken, deleteRegistro);

module.exports = router;