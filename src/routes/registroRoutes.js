const express = require('express');
const { createRegistro, getRegistros, getRegistroById, updateRegistro, deleteRegistro } = require('../controllers/registroController');
// const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/',  createRegistro);
router.get('/',  getRegistros);
router.get('/:id',  getRegistroById);
router.put('/:id',  updateRegistro);
router.delete('/:id',  deleteRegistro);

module.exports = router;