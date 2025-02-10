require('dotenv').config();
import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import { Client } from "@googlemaps/google-maps-services-js";

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permitir CORS para que el frontend pueda consumir la API
app.use(express.json()); // Habilitar JSON en las peticiones

// Google Maps API Client
const googleMapsClient = new Client({});

// Ruta de prueba para verificar Google Maps API
app.get('/v1/api/google-maps/test', async (req, res) => {
    try {
        const response = await googleMapsClient.geocode({
            params: {
                address: 'Mexico City',
                key: process.env.GOOGLE_MAPS_API_KEY!,
            },
            timeout: 1000, // 1 segundo
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error con Google Maps API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al conectar con Google Maps API' });
    }
});

// Rutas principales
app.use('/v1/api/', routes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log('⚡ Presiona Ctrl + C para detener el servidor');
});