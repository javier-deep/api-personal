# Guía de Seguridad y Mejores Prácticas

## 🔒 Seguridad en Producción

### 1. Implementar Autenticación

Para proteger los endpoints, considera implementar autenticación JWT:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = authMiddleware;
```

Usar en rutas:
```javascript
app.use('/api/v1', authMiddleware, sensorDataRoutes);
```

### 2. Rate Limiting

Prevenir abuso de API:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones
  message: 'Demasiadas peticiones, intenta más tarde'
});

app.use('/api/', limiter);
```

### 3. Validación de Entrada

Usar bibliotecas como `joi` o `celebrate`:

```bash
npm install celebrate joi
```

```javascript
const { celebrate, Joi, errors } = require('celebrate');

const validateSensorData = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().max(50),
    heartRate: Joi.number().required().min(0).max(220),
    acceleration: Joi.number().required(),
    petState: Joi.string().valid('FELIZ', 'TRISTE', 'CANSADO', 'ENERGÉTICO', 'NORMAL'),
    timestamp: Joi.date().iso(),
    deviceInfo: Joi.object().keys({
      model: Joi.string().max(100),
      platform: Joi.string().max(100)
    })
  })
});

router.post('/sensor-data', validateSensorData, async (req, res) => {
  // ... código del endpoint
});

app.use(errors());
```

### 4. Encriptación de Datos Sensibles

Para datos como correos o identificadores personales:

```javascript
const crypto = require('crypto');

function encryptField(field, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(field, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptField(encrypted, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 5. CORS Restringido

En lugar de permitir todo:

```javascript
// Actual (menos seguro)
app.use(cors());

// Mejorado
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 6. HTTPS en Producción

Render.com automáticamente proporciona HTTPS. Para desarrollo local:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT);
```

---

## 📊 Monitoreo y Logging

### 1. Logging Centralizado

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'tamagotchi-fit-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 2. Error Tracking

Usar Sentry para producción:

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## 📈 Optimización de Base de Datos

### 1. Índices

Asegurar que los índices están creados:

```javascript
lecturaSchema.index({ userId: 1, timestamp: -1 });
lecturaSchema.index({ userId: 1 });
lecturaSchema.index({ timestamp: -1 });
```

### 2. Paginación

Ya implementada, pero optimizar:

```javascript
const page = req.query.page || 1;
const limit = Math.min(req.query.limit || 100, 1000); // máximo 1000
const skip = (page - 1) * limit;
```

### 3. Caching

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

router.get('/stats/:userId', async (req, res) => {
  const cacheKey = `stats:${req.params.userId}`;
  
  // Intentar desde caché
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Obtener y cachear
  const data = await Lectura.find({ userId: req.params.userId });
  await client.setex(cacheKey, 300, JSON.stringify(data)); // 5 minutos
  
  res.json(data);
});
```

---

## 🧪 Testing

### 1. Tests Unitarios

```bash
npm install --save-dev jest supertest
```

```javascript
// tests/sensor.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /api/v1/sensor-data', () => {
  it('debe registrar datos válidos', async () => {
    const response = await request(app)
      .post('/api/v1/sensor-data')
      .send({
        userId: 'test_user',
        heartRate: 80,
        acceleration: 5
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
  
  it('debe rechazar datos inválidos', async () => {
    const response = await request(app)
      .post('/api/v1/sensor-data')
      .send({
        userId: 'test_user'
        // Falta heartRate
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

Ejecutar:
```bash
npm test
```

---

## 🚀 Performance

### 1. Gzip Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Connection Pooling

MongoDB Mongoose ya lo maneja por defecto:

```javascript
mongoose.connect(mongodbUri, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

### 3. Async/Await vs Callbacks

Mantener código limpio:

```javascript
// ✓ Bueno
async function getData(userId) {
  try {
    const data = await Lectura.find({ userId });
    return data;
  } catch (error) {
    throw error;
  }
}

// ✗ Evitar callbacks anidados
```

---

## ✅ Checklist de Seguridad para Producción

- [ ] Implementar autenticación JWT
- [ ] Configurar rate limiting
- [ ] Validar todas las entradas
- [ ] Usar HTTPS
- [ ] Encriptar datos sensibles
- [ ] Configurar CORS restringido
- [ ] Implementar logging centralizado
- [ ] Monitoreo con Sentry o similar
- [ ] Crear índices en base de datos
- [ ] Implementar caching
- [ ] Tests automatizados
- [ ] Documentación API completa
- [ ] Backup automático de base de datos
- [ ] Plan de recuperación ante desastres

---

## 📚 Recursos Útiles

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Best Practices](https://docs.mongodb.com/manual/security/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
