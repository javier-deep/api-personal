# Tamagotchi Fit API

API REST para la aplicación de salud **Tamagotchi Fit** que permite registrar y consultar datos de sensores de salud.

## 🚀 Características

- ✅ Registrar datos de sensores (ritmo cardíaco, aceleración, estado)
- ✅ Obtener historial de datos por usuario
- ✅ Estadísticas agregadas (promedio, máximo, mínimo)
- ✅ Seguridad con Helmet y CORS
- ✅ Logs detallados con Morgan
- ✅ Listo para desplegar en Render.com
- ✅ Integración con MongoDB Atlas

## 📋 Requisitos Previos

- Node.js 14.0+
- npm o yarn
- Cuenta en MongoDB Atlas (con base de datos creada)
- Cuenta en Render.com (para despliegue)

## 🔧 Instalación Local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd app-personal
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?appName=<app-name>
PORT=3000
NODE_ENV=development
```

### 4. Ejecutar la API

**Desarrollo (con nodemon):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

La API estará disponible en `http://localhost:3000`

## 📚 Documentación de Endpoints

### 1. Health Check
```
GET /api/v1/health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "API Tamagotchi Fit está en funcionamiento",
  "timestamp": "2024-07-01T10:30:00.000Z",
  "environment": "development"
}
```

### 2. Registrar Datos de Sensor
```
POST /api/v1/sensor-data
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

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Datos de sensor registrados exitosamente",
  "data": {
    "_id": "6a45d81e34000cc8b6ec1675",
    "userId": "user_12345",
    "heartRate": 125.5,
    "acceleration": 12.8,
    "petState": "FELIZ",
    "timestamp": "2024-07-01T10:30:00.000Z",
    "deviceInfo": {
      "model": "Pixel Watch 3",
      "platform": "Wear OS 5"
    }
  }
}
```

**Campos requeridos:** `userId`, `heartRate`, `acceleration`  
**Campos opcionales:** `petState`, `timestamp`, `deviceInfo`

### 3. Obtener Estadísticas de Usuario
```
GET /api/v1/stats/:userId?limit=100&skip=0&sort=-timestamp
```

**Parámetros de ruta:**
- `userId`: ID único del usuario (requerido)

**Parámetros de query:**
- `limit`: Cantidad de registros a retornar (default: 100)
- `skip`: Cantidad de registros a saltar (default: 0)
- `sort`: Campo para ordenar (default: `-timestamp`, use `-` para descendente)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Historial obtenido exitosamente",
  "data": {
    "lecturas": [
      {
        "_id": "6a45d81e34000cc8b6ec1675",
        "userId": "user_12345",
        "timestamp": "2024-07-01T10:30:00.000Z",
        "heartRate": 125.5,
        "acceleration": 12.8,
        "petState": "FELIZ",
        "deviceInfo": {
          "model": "Pixel Watch 3",
          "platform": "Wear OS 5"
        }
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

## 🗄️ Configuración de MongoDB Atlas

### Paso 1: Crear Cluster

1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Iniciar sesión o crear cuenta
3. Crear un nuevo proyecto
4. Hacer clic en "Create Cluster" y elegir opciones gratuitas
5. Seleccionar región (recomendado: cercana a tu ubicación)
6. Completar la creación

### Paso 2: Crear Base de Datos

1. En el cluster, ir a "Collections"
2. Hacer clic en "Add My Own Data"
3. Crear base de datos: `app-personal`
4. Crear colección: `lecturas`

### Paso 3: Obtener URI de Conexión

1. En el cluster, hacer clic en "Connect"
2. Elegir "Drivers"
3. Seleccionar Node.js como driver
4. Copiar la cadena de conexión (URI)
5. Reemplazar `<username>` y `<password>` con las credenciales del usuario
6. Pegar en `.env` bajo `MONGODB_URI`

### Paso 4: Configurar Whitelist (IP Address)

1. En el cluster, ir a "Network Access"
2. Hacer clic en "Add IP Address"
3. Seleccionar "Allow access from anywhere" (0.0.0.0/0) para desarrollo
4. Para producción, especificar las IPs de Render.com

## 🌐 Despliegue en Render.com

### Paso 1: Preparar Repositorio

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Paso 2: Crear Servicio en Render

1. Ir a [Render Dashboard](https://dashboard.render.com)
2. Hacer clic en "New +" → "Web Service"
3. Conectar tu repositorio de GitHub
4. Configurar:
   - **Name:** tamagotchi-fit-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (o el que prefieras)

### Paso 3: Configurar Variables de Entorno

1. En la página del servicio, ir a "Environment"
2. Agregar las siguientes variables:
   - `MONGODB_URI`: Tu URI de MongoDB Atlas
   - `NODE_ENV`: `production`
   - `PORT`: Dejar vacío (Render lo asigna automáticamente)

### Paso 4: Deploy

1. Hacer clic en "Create Web Service"
2. Render desplegará automáticamente
3. La URL estará disponible en el dashboard

## 📝 Ejemplos de Uso

### Registrar datos con curl

```bash
curl -X POST http://localhost:3000/api/v1/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "heartRate": 125.5,
    "acceleration": 12.8,
    "petState": "FELIZ"
  }'
```

### Obtener estadísticas con curl

```bash
curl -X GET http://localhost:3000/api/v1/stats/user_12345?limit=20
```

### Registrar datos con JavaScript

```javascript
const response = await fetch('http://localhost:3000/api/v1/sensor-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_12345',
    heartRate: 125.5,
    acceleration: 12.8,
    petState: 'FELIZ'
  })
});

const data = await response.json();
console.log(data);
```

## 🧪 Testing

Para probar los endpoints, puedes usar:

- **Postman:** [descargar](https://www.postman.com/downloads/)
- **Thunder Client:** Extensión de VS Code
- **curl:** Línea de comandos

## 📊 Estructura del Proyecto

```
app-personal/
├── config.js              # Configuración centralizada
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── Procfile               # Configuración para Render
├── .env                   # Variables de entorno (gitignored)
├── .env.example           # Ejemplo de variables
├── .gitignore             # Archivos a ignorar en git
├── models/
│   └── Lectura.js         # Modelo de Mongoose
└── routes/
    └── sensorData.js      # Endpoints de sensores
```

## 🔒 Seguridad

- **Helmet:** Protege contra vulnerabilidades comunes
- **CORS:** Controla acceso desde otros dominios
- **Mongoose Validation:** Validación de datos a nivel de esquema
- **Environment Variables:** Credenciales separadas del código

Para producción, considera:
- Usar variables de entorno para todas las credenciales
- Implementar autenticación (JWT, API Keys)
- Agregar rate limiting
- Validar y sanitizar inputs adicionales

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

1. Verificar que `MONGODB_URI` está correctamente configurada
2. Verificar que el whitelist de IP incluye tu dirección IP (o 0.0.0.0/0)
3. Verificar credenciales en la URI

### Error: "Port already in use"

```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.

## 📄 Licencia

MIT
