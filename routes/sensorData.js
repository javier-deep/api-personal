const express = require('express');
const router = express.Router();
const Lectura = require('../models/Lectura');

/**
 * POST /api/v1/sensor-data
 * Recibe datos de sensores del dispositivo
 */
router.post('/sensor-data', async (req, res) => {
  try {
    console.log('🔴 [SENSOR-DATA] POST RECIBIDO');
    console.log('  Headers:', req.headers);
    console.log('  Body:', JSON.stringify(req.body, null, 2));
    console.log('  Timestamp:', new Date().toISOString());
    
    const { userId, heartRate, acceleration, petState, timestamp, deviceInfo } = req.body;

    // Validar campos requeridos
    if (!userId || heartRate === undefined || acceleration === undefined) {
      console.log('  ❌ Validación fallida - campos faltantes');
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

    console.log('📝 Documento creado:', JSON.stringify(lectura, null, 2));

    // Guardar en base de datos
    const saved = await lectura.save();
    
    console.log('✅ Guardado en BD:', saved._id);
    
    // Verificar que realmente se guardó
    const verificar = await Lectura.findById(saved._id);
    if (!verificar) {
      console.error('⚠️  ADVERTENCIA: Documento guardado pero no se puede recuperar!');
    }
    
    const count = await Lectura.countDocuments({ userId });
    console.log(`📊 Total de registros para userId "${userId}": ${count}`);

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
 * GET /api/v1/sensor-data/:userId
 * Obtiene los últimos 20 registros de sensores de un usuario
 * Formato compatible con modelo Kotlin SensorDataRequest
 */
router.get('/sensor-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    // Validar userId
    if (!userId || userId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'userId es requerido y no puede estar vacío',
      });
    }

    console.log(`📖 [GET SENSOR-DATA] Consultando userId: "${userId}" - Límite: ${limit}`);

    // Obtener registros ordenados por timestamp descendente (más recientes primero)
    const registros = await Lectura.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean(); // lean() para mejor rendimiento

    console.log(`✅ Se encontraron ${registros.length} registros`);

    // Mapear al formato exacto que Kotlin espera
    const sensorDataArray = registros.map((doc) => ({
      userId: doc.userId,
      heartRate: doc.heartRate,
      acceleration: doc.acceleration,
      petState: doc.petState,
      timestamp: doc.timestamp ? doc.timestamp.getTime() : new Date(doc.timestamp).getTime(), // Convertir a milisegundos
    }));

    // Responder directamente con el array (sin wrapper de success)
    res.status(200).json(sensorDataArray);
  } catch (error) {
    console.error('❌ Error al obtener datos de sensor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de sensor',
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

/**
 * GET /api/v1/latest
 * Obtiene los últimos registros creados en la BD
 */
router.get('/latest', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const latest = await Lectura.find()
      .sort({ _id: -1 })
      .limit(parseInt(limit))
      .lean();

    const stats = {
      totalRecords: await Lectura.countDocuments(),
      uniqueUsers: await Lectura.distinct('userId').then(arr => arr.length),
      latestRecord: latest.length > 0 ? latest[0] : null,
      oldestRecord: await Lectura.findOne().sort({ _id: 1 }).lean(),
    };

    res.status(200).json({
      success: true,
      message: 'Últimos registros obtenidos',
      stats,
      latest: latest.slice(0, 5),
    });
  } catch (error) {
    console.error('Error al obtener últimos registros:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener últimos registros',
      error: error.message,
    });
  }
});

module.exports = router;
