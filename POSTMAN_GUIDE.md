# Guía de Testing con Postman

## 🚀 Importar Colección en Postman

### Opción 1: Importar archivo JSON

1. Abre Postman
2. Haz clic en "Import" (arriba a la izquierda)
3. Selecciona "Upload Files"
4. Elige el archivo `Tamagotchi_Fit_API.postman_collection.json`
5. Haz clic en "Import"

### Opción 2: Copiar y pegar

1. Abre el archivo `Tamagotchi_Fit_API.postman_collection.json`
2. Copia todo el contenido
3. En Postman, ve a "Import" → "Raw text"
4. Pega el contenido
5. Haz clic en "Continue" e "Import"

---

## 🔧 Configurar Variables de Entorno

### Para Local

1. En Postman, haz clic en el ícono "Environments" (a la izquierda)
2. Haz clic en "Create New" o "+"
3. Nombra el environment: `Tamagotchi Local`
4. Agrega la variable:
   - **Variable:** `base_url`
   - **Value:** `http://localhost:3000`
5. Haz clic en "Save"

### Para Producción (Render)

1. Crea un nuevo environment: `Tamagotchi Production`
2. Agrega la variable:
   - **Variable:** `base_url`
   - **Value:** `https://tamagotchi-fit-api.onrender.com`
3. Haz clic en "Save"

---

## 📝 Ejemplos de Uso

### 1. Health Check

**Método:** GET  
**URL:** `{{base_url}}/api/v1/health`

**Qué hace:** Verifica que la API está en funcionamiento

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "API Tamagotchi Fit está en funcionamiento",
  "timestamp": "2024-07-01T10:30:00.000Z",
  "environment": "development"
}
```

### 2. Registrar Datos de Sensor

**Método:** POST  
**URL:** `{{base_url}}/api/v1/sensor-data`

**Headers:**
```
Content-Type: application/json
```

**Body:**
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

**Qué hace:** Registra nuevos datos de sensores para un usuario

**Tips:**
- `userId` es requerido
- `heartRate` debe estar entre 0-220
- `petState` puede ser: FELIZ, TRISTE, CANSADO, ENERGÉTICO, NORMAL
- `timestamp` es opcional (por defecto usa la fecha actual)
- `deviceInfo` es completamente opcional

### 3. Obtener Estadísticas

**Método:** GET  
**URL:** `{{base_url}}/api/v1/stats/user_12345`

**Parámetros (opcionales):**
- `limit=100`: Cantidad de registros a retornar
- `skip=0`: Cantidad de registros a saltar
- `sort=-timestamp`: Campo para ordenar (use `-` para descendente)

**Ejemplos de URL:**
```
{{base_url}}/api/v1/stats/user_12345
{{base_url}}/api/v1/stats/user_12345?limit=10&skip=0
{{base_url}}/api/v1/stats/user_12345?limit=5&sort=heartRate
{{base_url}}/api/v1/stats/user_12345?sort=-acceleration
```

**Qué hace:** Obtiene el historial y estadísticas de un usuario

**Respuesta incluye:**
- `lecturas`: Array con todos los registros
- `pagination`: Información sobre paginación
- `statistics`: Estadísticas agregadas (promedio, máximo, mínimo)

---

## 🧪 Casos de Prueba

### Test Básico

1. Ejecutar "Health Check" ✓
2. Ejecutar "Registrar Datos de Sensor" ✓
3. Ejecutar "Obtener Estadísticas - Usuario 12345" ✓

### Test de Múltiples Usuarios

1. Ejecutar "Registrar Sensor - Usuario 1" ✓
2. Ejecutar "Registrar Sensor - Usuario 2" ✓
3. Ejecutar "Registrar Sensor - Usuario 3" ✓
4. Ejecutar "Obtener Estadísticas - Usuario 1" ✓
5. Ejecutar "Obtener Estadísticas - Usuario 2" ✓
6. Ejecutar "Obtener Estadísticas - Usuario 3" ✓

### Test de Paginación

1. Registrar múltiples datos (ejecutar varias veces el endpoint POST)
2. Ejecutar "Obtener Estadísticas con Paginación"
3. Cambiar parámetros: `limit=5&skip=0`, `limit=5&skip=5`, etc.
4. Verificar que `pagination.total` es consistente

### Test de Ordenamiento

1. Ejecutar "Obtener Estadísticas - Ordenado por Heart Rate"
2. Verificar que los datos están ordenados por `heartRate` (ascendente)
3. Cambiar `sort` a `-heartRate` para descendente

---

## 💾 Guardar Respuestas

Postman permite guardar respuestas como ejemplos:

1. Ejecuta una petición exitosa
2. Haz clic en "Save as Example"
3. Dale un nombre descriptivo
4. La respuesta se guardará en la colección

---

## 🔍 Debugging

### Ver Detalles de la Petición

Postman muestra automáticamente:
- **Status Code:** Código de respuesta HTTP
- **Response Time:** Tiempo de respuesta
- **Response Size:** Tamaño de la respuesta

### Ver Logs

Haz clic en "Console" (abajo a la izquierda) para ver logs detallados de las peticiones

### Common Issues

**Error 404 - Not Found**
- Verificar que la URL es correcta
- Verificar que `base_url` está configurado
- Verificar que el servidor está ejecutándose

**Error 500 - Internal Server Error**
- Ver los logs del servidor
- Verificar que `MONGODB_URI` es válido
- Verificar que la conexión a MongoDB está activa

**Error 400 - Bad Request**
- Verificar que el body JSON es válido
- Verificar que los campos requeridos están presentes
- Verificar que los valores son del tipo correcto

---

## 📊 Análisis de Datos

### Comparar Usuarios

1. Obtener estadísticas de User 1, 2 y 3
2. Comparar en una hoja de cálculo:
   - Ritmo cardíaco promedio
   - Máximo y mínimo
   - Aceleración promedio

### Exportar Datos

Postman permite exportar respuestas como CSV o JSON:

1. En la respuesta, haz clic en los tres puntos (...) 
2. Elige "Export" → formato deseado
3. Los datos se descargarán

---

## 🚀 Automatización con Scripts Pre/Post

### Pre-request Script

Ejecutar antes de cada petición:

```javascript
// Establecer timestamp dinámico
const now = new Date().toISOString();
pm.environment.set("timestamp", now);

// Log
console.log("Petición enviada:", pm.request.name);
```

### Post-request Script

Ejecutar después de cada petición:

```javascript
// Verificar status
if (pm.response.code === 201 || pm.response.code === 200) {
  console.log("✓ Éxito");
} else {
  console.log("✗ Error:", pm.response.code);
}

// Guardar variables de respuesta
const jsonData = pm.response.json();
pm.environment.set("lastUserId", jsonData.data.userId);
```

---

## 📚 Recursos Adicionales

- [Documentación de Postman](https://learning.postman.com/)
- [Colección de API en GitHub](https://github.com/TuUsuario/tamagotchi-fit-api)
- [Testing Best Practices](https://www.postman.com/api-testing-best-practices/)

¡Listo para empezar a testear! 🚀
