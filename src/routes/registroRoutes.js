const multer = require('multer');
const express = require('express');
const { createRegistro, getRegistros, getRegistroById, updateRegistro, deleteRegistro, uploadExcel } = require('../controllers/registroController');
const { authenticateToken } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', authenticateToken,  createRegistro);
router.get('/', authenticateToken, getRegistros);
router.get('/:id', authenticateToken,  getRegistroById);
router.put('/:id', authenticateToken,  updateRegistro);
router.delete('/:id', authenticateToken,  deleteRegistro);
router.post('/upload', authenticateToken, upload.single('file'), uploadExcel);

module.exports = router;