const express = require('express');
const passport = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para iniciar sesión con Azure AD
router.get('/login', passport.authenticate('openidconnect'));

// Callback después de la autenticación
router.get('/callback',
    passport.authenticate('openidconnect', { failureRedirect: '/' }),
    (req, res) => {
        res.json({ message: 'Inicio de sesión exitoso', user: req.user });
    }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;