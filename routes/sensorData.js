const express = require('express');
const router = express.Router();
const Lectura = require('../models/Lectura');

/**
 * POST /api/v1/sensor-data
 * Recibe datos de sensores del dispositivo
 */
router.post('/sensor-data', async (req, res) => {
  try {
    const { userId, heartRate, acceleration, petState, timestamp, deviceInfo } = req.body;

    // Validar campos requeridos
    if (!userId || heartRate === undefined || acceleration === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: userId, heartRate, acceleration',
      });
    }

    // Crear nueva lectura
    const lectura = new Lectura({
      userId,
      heartRate,
      acceleration,
      petState: petState || 'NORMAL',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      deviceInfo,
    });

    // Guardar en base de datos
    await lectura.save();

    res.status(201).json({
      success: true,
      message: 'Datos de sensor registrados exitosamente',
      data: lectura,
    });
  } catch (error) {
    console.error('Error al registrar datos de sensor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar datos de sensor',
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/stats/:userId
 * Obtiene el historial de un usuario específico
 */
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100, skip = 0, sort = '-timestamp' } = req.query;

    // Validar userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId es requerido',
      });
    }

    // Obtener registros
    const lecturas = await Lectura.find({ userId })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Obtener total de registros
    const total = await Lectura.countDocuments({ userId });

    // Calcular estadísticas
    const stats = await Lectura.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          avgHeartRate: { $avg: '$heartRate' },
          maxHeartRate: { $max: '$heartRate' },
          minHeartRate: { $min: '$heartRate' },
          avgAcceleration: { $avg: '$acceleration' },
          totalRecords: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Historial obtenido exitosamente',
      data: {
        lecturas,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          pages: Math.ceil(total / parseInt(limit)),
        },
        statistics: stats.length > 0 ? stats[0] : null,
      },
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message,
    });
  }
});

module.exports = router;
