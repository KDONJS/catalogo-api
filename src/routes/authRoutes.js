const express = require('express');
const { register, login, session, logout, getUsuarios, getUsuarioById, updateUsuario, deleteUsuario, toggleEstadoUsuario } = require('../controllers/authController');
const router = express.Router();
const { authenticateToken, conditionalAuthMiddleware } = require('../middleware/authMiddleware');

// Usamos el middleware condicional para el registro
router.post('/register', conditionalAuthMiddleware, register);
router.post('/login', login);
router.get('/session', session);
router.post('/logout', logout);

// 📌 Rutas nuevas para CRUD de usuarios
router.get('/usuarios', authenticateToken, getUsuarios); // Listar usuarios
router.get('/usuarios/:id', authenticateToken, getUsuarioById); // Obtener usuario por ID
router.put('/usuarios/:id', authenticateToken, updateUsuario); // Editar usuario
router.delete('/usuarios/:id', authenticateToken, deleteUsuario); // Eliminar usuario
router.patch('/usuarios/:id/estado', authenticateToken, toggleEstadoUsuario); // Activar/Desactivar usuario

module.exports = router;