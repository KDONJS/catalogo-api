const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const registroRoutes = require('./src/routes/registroRoutes');
const apiTokenRoutes = require('./src/routes/apiTokenRoutes');
// const kubernetesRoutes = require('./src/routes/kubernetesRoutes');
const podVersionRoutes = require('./src/routes/podVersionRoutes');
const awsSsoRoutes = require('./src/routes/awsSsoRoutes');
const cors = require('cors');

dotenv.config();

const app = express(); // ✅ Aquí se inicializa `app`

app.use(cors()); // ✅ Ahora sí podemos usar `app.use(cors());`

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('¡API funcionando correctamente!');
});

// Configuración de CORS más detallada
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Definición de rutas
app.use('/auth', authRoutes);
app.use('/registros', registroRoutes);
app.use('/api-tokens', apiTokenRoutes);
// app.use('/kubernetes', kubernetesRoutes);
app.use('/pod-versions', podVersionRoutes);
app.use('/aws-sso', awsSsoRoutes);

const PORT = process.env.PORT || 3000;

// Conexión a la base de datos y arranque del servidor
sequelize.sync().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => console.error('Error al conectar con la base de datos', err));