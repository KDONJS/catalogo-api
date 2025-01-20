const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const registroRoutes = require('./src/routes/registroRoutes');
const apiTokenRoutes = require('./src/routes/apiTokenRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/registros', registroRoutes);
app.use('/api-tokens', apiTokenRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => console.error('Error al conectar con la base de datos', err));