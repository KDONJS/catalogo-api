const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./src/config/database');

// Importación de rutas
const authRoutes = require('./src/routes/authRoutes');
const registroRoutes = require('./src/routes/registroRoutes');
const apiTokenRoutes = require('./src/routes/apiTokenRoutes');
const podVersionRoutes = require('./src/routes/podVersionRoutes');
const awsSsoRoutes = require('./src/routes/awsSsoRoutes');
const clusterRoutes = require('./src/routes/clusterRoutes');
const setupRoutes = require('./src/routes/setupRoutes');

// Cargar variables de entorno y validar que existan
dotenv.config();
const requiredEnvVars = ['PORT'];
const missingVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingVars.length > 0) {
    console.error(`❌ Faltan variables de entorno: ${missingVars.join(', ')}`);
    process.exit(1); // Detiene la ejecución si faltan variables esenciales
}

const app = express();

// 🔹 ✅ CORS con múltiples orígenes dinámicos
const allowedOrigins = ['http://localhost:4200', 'https://miapp.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No autorizado por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas públicas
app.get('/', (req, res) => {
    res.send('¡API funcionando correctamente!');
});

// 🔹 ✅ Define las rutas DESPUÉS de configurar middlewares
app.use('/auth', authRoutes);
app.use('/registros', registroRoutes);
app.use('/api-tokens', apiTokenRoutes);
app.use('/pod-versions', podVersionRoutes);
app.use('/aws-sso', awsSsoRoutes);
app.use('/clusters', clusterRoutes);
app.use('/setup', setupRoutes);

// 🔹 ✅ Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error en el servidor:', err.message, next);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// 🔹 ✅ Conectar a la base de datos y arrancar el servidor
(async () => {
    try {
        console.log('⏳ Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos correctamente.');

        await sequelize.sync();
        console.log('✅ Modelos sincronizados.');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1); // Detener ejecución si hay error en la BD
    }
})();