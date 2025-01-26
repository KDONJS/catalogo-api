const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

exports.redirectToAwsSso = (req, res) => {
    const authUrl = `${process.env.AWS_COGNITO_DOMAIN}/oauth2/authorize?client_id=${process.env.AWS_COGNITO_CLIENT_ID}&response_type=code&scope=openid email profile&redirect_uri=${process.env.AWS_REDIRECT_URI}`;

    console.log("🔗 Redirigiendo a Cognito:", authUrl);
    res.redirect(authUrl);
};

exports.handleAwsSsoCallback = async (req, res) => {
    try {
        console.log("🔍 Query Params recibidos:", req.query); // Log para ver los parámetros recibidos

        const { code } = req.query;
        if (!code) {
            console.error("❌ Código de autorización no recibido en callback");
            return res.status(400).json({ message: 'Código de autorización faltante', receivedParams: req.query });
        }

        console.log("✅ Código de autorización recibido:", code);

        const tokenResponse = await axios.post(
            `${process.env.AWS_COGNITO_DOMAIN}/oauth2/token`,
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.AWS_COGNITO_CLIENT_ID,
                client_secret: process.env.AWS_COGNITO_CLIENT_SECRET,
                code,
                redirect_uri: process.env.AWS_REDIRECT_URI,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        console.log("🔑 Respuesta del token:", tokenResponse.data);

        const { access_token, id_token } = tokenResponse.data;
        const userInfo = jwt.decode(id_token);

        res.json({ message: 'Inicio de sesión exitoso', user: userInfo, accessToken: access_token });
    } catch (error) {
        console.error('❌ Error en autenticación con AWS SSO:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error en autenticación con AWS SSO', error: error.message });
    }
};