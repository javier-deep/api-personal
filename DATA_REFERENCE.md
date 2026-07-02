# Referencia de Datos - API Tamagotchi Fit

## 📊 Modelo de Datos

### Lectura de Sensor

Estructura almacenada en MongoDB:

```json
{
  "_id": "ObjectId",
  "userId": "string (requerido)",
  "timestamp": "Date (ISO 8601)",
  "heartRate": "Number (requerido)",
  "acceleration": "Number (requerido)",
  "petState": "string (enum)",
  "deviceInfo": {
    "model": "string",
    "platform": "string"
  }
}
```

---

## 🔍 Campos Detallados

### userId
- **Tipo:** String
- **Requerido:** Sí
- **Max caracteres:** Sin límite
- **Descripción:** Identificador único del usuario
- **Ejemplos:**
  - `user_12345`
  - `john_doe_001`
  - `device_sensor_001`

### heartRate
- **Tipo:** Number
- **Requerido:** Sí
- **Rango válido:** 0 - 220 BPM
- **Descripción:** Ritmo cardíaco en latidos por minuto
- **Ejemplos válidos:**
  - `72`
  - `125.5`
  - `98.3`
- **Ejemplos inválidos:**
  - `-50` (negativo)
  - `250` (demasiado alto)
  - `"80"` (debe ser number, no string)

### acceleration
- **Tipo:** Number
- **Requerido:** Sí
- **Rango típico:** 0 - 20 (sin límite teórico)
- **Descripción:** Aceleración del dispositivo (m/s²)
- **Ejemplos válidos:**
  - `0`
  - `5.3`
  - `12.8`
  - `15.999`

### timestamp
- **Tipo:** Date (ISO 8601)
- **Requerido:** No
- **Default:** Fecha y hora actual del servidor
- **Formato:** `YYYY-MM-DDTHH:mm:ssZ`
- **Ejemplos válidos:**
  - `2024-07-01T10:30:00Z`
  - `2024-07-01T10:30:00.123Z`
  - `2024-07-01T15:45:32.567Z`
- **Si no se proporciona:** Se usa `new Date()`

### petState
- **Tipo:** String (Enum)
- **Requerido:** No
- **Default:** `NORMAL`
- **Valores permitidos:**
  - `FELIZ` - Estado positivo, actividad alta
  - `TRISTE` - Estado bajo, inactividad
  - `CANSADO` - Fatiga detectada
  - `ENERGÉTICO` - Mucha actividad
  - `NORMAL` - Estado neutro/estable
- **Ejemplo:**
  ```json
  {
    "petState": "FELIZ"
  }
  ```

### deviceInfo (Objeto anidado)
- **Tipo:** Object
- **Requerido:** No
- **Descripción:** Información del dispositivo que envía datos

#### deviceInfo.model
- **Tipo:** String
- **Requerido:** No
- **Max caracteres:** Sin límite
- **Ejemplos:**
  - `Pixel Watch 3`
  - `Apple Watch Series 8`
  - `Fitbit Charge 6`

#### deviceInfo.platform
- **Tipo:** String
- **Requerido:** No
- **Ejemplos:**
  - `Wear OS 5`
  - `watchOS 10`
  - `Android 14`

---

## 📨 Ejemplos de Request

### Ejemplo Mínimo (campos requeridos)

```json
{
  "userId": "user_001",
  "heartRate": 80,
  "acceleration": 5
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Datos de sensor registrados exitosamente",
  "data": {
    "_id": "66a5d81e34000cc8b6ec1675",
    "userId": "user_001",
    "heartRate": 80,
    "acceleration": 5,
    "petState": "NORMAL",
    "timestamp": "2024-07-01T10:30:00.000Z",
    "deviceInfo": null
  }
}
```

### Ejemplo Completo

```json
{
  "userId": "user_12345",
  "heartRate": 125.5,
  "acceleration": 12.8,
  "petState": "FELIZ",
  "timestamp": "2024-07-01T10:30:00Z",
  "deviceInfo": {
    "model": "Pixel Watch 3",
    "platform": "Wear OS 5"
  }
}
```

### Ejemplo con Timestamp Manual

```json
{
  "userId": "historical_user",
  "heartRate": 95,
  "acceleration": 7.2,
  "petState": "CANSADO",
  "timestamp": "2024-06-30T15:45:32Z"
}
```

---

## 📊 Ejemplos de Response

### GET /api/v1/stats/:userId - Respuesta

```json
{
  "success": true,
  "message": "Historial obtenido exitosamente",
  "data": {
    "lecturas": [
      {
        "_id": "66a5d81e34000cc8b6ec1675",
        "userId": "user_001",
        "timestamp": "2024-07-01T10:30:00.000Z",
        "heartRate": 125.5,
        "acceleration": 12.8,
        "petState": "FELIZ",
        "deviceInfo": {
          "model": "Pixel Watch 3",
          "platform": "Wear OS 5"
        }
      },
      {
        "_id": "66a5d81e34000cc8b6ec1676",
        "userId": "user_001",
        "timestamp": "2024-07-01T09:15:00.000Z",
        "heartRate": 98.3,
        "acceleration": 5.1,
        "petState": "NORMAL",
        "deviceInfo": null
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 100,
      "skip": 0,
      "pages": 1
    },
    "statistics": {
      "_id": null,
      "avgHeartRate": 98.5,
      "maxHeartRate": 145.2,
      "minHeartRate": 72.1,
      "avgAcceleration": 5.3,
      "totalRecords": 45
    }
  }
}
```

---

## ❌ Validación y Errores

### Error 400 - Campos Faltantes

```json
{
  "success": false,
  "message": "Faltan campos requeridos: userId, heartRate, acceleration"
}
```

**Causas:**
- userId no proporcionado
- heartRate no proporcionado
- acceleration no proporcionado

### Error 400 - heartRate Fuera de Rango

```json
{
  "success": false,
  "message": "Validation failed: heartRate must be between 0 and 220"
}
```

**Soluciones:**
- Verificar que heartRate esté entre 0-220
- Usar valor numérico, no string

### Error 500 - Error del Servidor

```json
{
  "success": false,
  "message": "Error al registrar datos de sensor",
  "error": "Connection refused to MongoDB"
}
```

**Causas:**
- MongoDB no está disponible
- URI de conexión es incorrecta
- Base de datos no existe

---

## 📈 Interpretación de Estadísticas

### avgHeartRate
- **Promedio:** Ritmo cardíaco promedio del usuario
- **Interpretación:**
  - < 60: Bradicardia (muy bajo)
  - 60-100: Normal en reposo
  - 100-120: Actividad moderada
  - > 120: Actividad intensa

### maxHeartRate / minHeartRate
- **Máximo:** Pico más alto registrado
- **Mínimo:** Punto más bajo registrado
- **Utilidad:** Detectar variabilidad cardíaca

### avgAcceleration
- **Promedio de movimiento del dispositivo**
- **Interpretación:**
  - < 2: Inactividad (sedentarismo)
  - 2-10: Actividad moderada
  - > 10: Alta actividad/ejercicio

---

## 🔄 Parámetros de Query

### GET /api/v1/stats/:userId?limit=X&skip=Y&sort=FIELD

#### limit
- **Tipo:** Number
- **Default:** 100
- **Min:** 1
- **Max:** Sin límite (recomendado: 1000)
- **Uso:** Limitar cantidad de registros
- **Ejemplo:** `?limit=20`

#### skip
- **Tipo:** Number
- **Default:** 0
- **Min:** 0
- **Uso:** Saltar registros (para paginación)
- **Ejemplo:** `?skip=20`

#### sort
- **Tipo:** String
- **Default:** `-timestamp` (descendente por fecha)
- **Formato:** `fieldName` (ascendente) o `-fieldName` (descendente)
- **Campos válidos:**
  - `timestamp`
  - `heartRate`
  - `acceleration`
  - `petState`
- **Ejemplos:**
  - `?sort=heartRate` (menor a mayor)
  - `?sort=-heartRate` (mayor a menor)
  - `?sort=-timestamp` (más reciente primero)

---

## 🎯 Casos de Uso Típicos

### 1. Registrar lectura en tiempo real

```bash
curl -X POST http://localhost:3000/api/v1/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "heartRate": 85,
    "acceleration": 4.2
  }'
```

### 2. Obtener últimas 10 lecturas

```bash
curl "http://localhost:3000/api/v1/stats/user_001?limit=10&sort=-timestamp"
```

### 3. Obtener lecturas ordenadas por actividad

```bash
curl "http://localhost:3000/api/v1/stats/user_001?sort=-acceleration"
```

### 4. Paginación: Primera página de 20 resultados

```bash
curl "http://localhost:3000/api/v1/stats/user_001?limit=20&skip=0"
```

### 5. Paginación: Segunda página de 20 resultados

```bash
curl "http://localhost:3000/api/v1/stats/user_001?limit=20&skip=20"
```

---

## 📌 Notas Importantes

✅ heartRate siempre debe ser un número válido  
✅ userId es único por usuario pero puede repetirse en múltiples lecturas  
✅ timestamp es importante para análisis históricos  
✅ petState ayuda a entrenar modelos de IA  
✅ deviceInfo es opcional pero útil para debugging  
✅ Todos los campos excepto userId se pueden omitir (excepto heartRate y acceleration)  

---

## 🔗 Relaciones

```
Usuario (userId)
    ├── Lectura 1 (timestamp: 10:30)
    ├── Lectura 2 (timestamp: 10:45)
    ├── Lectura 3 (timestamp: 11:00)
    └── Lectura N (timestamp: XX:XX)

Estadísticas (agregadas de todas las lecturas del usuario)
    ├── avgHeartRate
    ├── maxHeartRate
    ├── minHeartRate
    ├── avgAcceleration
    └── totalRecords
```
