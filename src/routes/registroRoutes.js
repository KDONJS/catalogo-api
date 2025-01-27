const multer = require('multer');
const express = require('express');
const { createRegistro, getRegistros, getRegistroById, updateRegistro, deleteRegistro, uploadExcel } = require('../controllers/registroController');
const { authenticateToken } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/',  createRegistro);
router.get('/', authenticateToken, getRegistros);
router.get('/:id',  getRegistroById);
router.put('/:id',  updateRegistro);
router.delete('/:id',  deleteRegistro);
router.post('/upload', upload.single('file'), uploadExcel);

module.exports = router;