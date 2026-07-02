const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const sensorDataRoutes = require('./routes/sensorData');

const app = express();

// ========== MIDDLEWARE ==========

// Seguridad
app.use(helmet());

// CORS
app.use(cors());

// Logs
app.use(morgan('combined'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== BASE DE DATOS ==========

mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log('✓ Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.error('✗ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  });

// ========== RUTAS ==========

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Tamagotchi Fit está en funcionamiento',
    timestamp: new Date(),
    environment: config.nodeEnv,
  });
});

// Rutas de sensor
app.use('/api/v1', sensorDataRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// ========== MANEJO DE ERRORES ==========

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: config.nodeEnv === 'development' ? error.message : undefined,
  });
});

// ========== SERVIDOR ==========

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║   Tamagotchi Fit API               ║
║   Running on port: ${PORT}          ║
║   Environment: ${config.nodeEnv}       ║
╚════════════════════════════════════╝
  `);
});

module.exports = app;
