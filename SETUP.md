# Guía de Configuración - MongoDB Atlas y Render

## 📋 Tabla de Contenidos

1. [Configuración Inicial de MongoDB Atlas](#configuración-inicial-de-mongodb-atlas)
2. [Obtener la URI de Conexión](#obtener-la-uri-de-conexión)
3. [Despliegue en Render.com](#despliegue-en-rendercom)
4. [Verificación y Testing](#verificación-y-testing)

---

## 🗄️ Configuración Inicial de MongoDB Atlas

### Paso 1: Crear una Cuenta

1. Accede a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Haz clic en "Sign Up for Free"
3. Completa el formulario de registro
4. Verifica tu correo electrónico

### Paso 2: Crear un Proyecto

1. Una vez autenticado, haz clic en "Create" o "New Project"
2. Asigna un nombre al proyecto: `app-personal`
3. Haz clic en "Create Project"

### Paso 3: Crear un Cluster

1. En el proyecto, haz clic en "Build a Database"
2. Elige "Shared Clusters" (Gratis)
3. Configura:
   - **Cloud Provider & Region:** AWS / us-east-1 (o tu región preferida)
   - **Cluster Name:** `cluster0`
4. Haz clic en "Create Cluster"

**⏳ Espera 2-3 minutos mientras se crea el cluster**

### Paso 4: Crear Usuario de Base de Datos

1. Ve a "Security" → "Database Access"
2. Haz clic en "Add New Database User"
3. Configura:
   - **Username:** `gerardomorales23s`
   - **Password:** `217512javier` (o tu contraseña)
   - **Authentication Method:** "Password"
4. En **Built-in Role**, selecciona "Atlas admin"
5. Haz clic en "Add User"

### Paso 5: Configurar Network Access

1. Ve a "Security" → "Network Access"
2. Haz clic en "Add IP Address"
3. Opciones:
   - **Desarrollo Local:** Selecciona "Add My Current IP Address"
   - **Producción (Render):** Selecciona "Allow access from anywhere" (0.0.0.0/0)

---

## 🔗 Obtener la URI de Conexión

### Paso 1: Ir a Conexión

1. En tu cluster, haz clic en "Connect"
2. Verifica que tu IP está en el whitelist
3. Selecciona "Connect your application"

### Paso 2: Copiar la URI

1. Elige el driver:
   - **Language:** Node.js
   - **Version:** 4.0 or later
2. Copia la cadena de conexión:

```
mongodb+srv://<username>:<password>@cluster0.5qp5c.mongodb.net/?appName=Cluster0
```

### Paso 3: Reemplazar Variables

Reemplaza en la URI:
- `<username>` → `gerardomorales23s`
- `<password>` → `217512javier`

**Resultado final:**
```
mongodb+srv://gerardomorales23s:217512javier@cluster0.5qp5c.mongodb.net/?appName=Cluster0
```

### Paso 4: Configurar en la Aplicación

1. Abre el archivo `.env` en tu proyecto
2. Actualiza `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://gerardomorales23s:217512javier@cluster0.5qp5c.mongodb.net/?appName=Cluster0
PORT=3000
NODE_ENV=development
```

---

## 🌐 Despliegue en Render.com

### Paso 1: Preparar tu Repositorio Git

```bash
# Inicializar git si no está hecho
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit - Tamagotchi Fit API"

# Empujar a repositorio remoto (GitHub, GitLab, etc.)
git push origin main
```

### Paso 2: Crear Cuenta en Render

1. Accede a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "Sign up"
3. Elige "Sign up with GitHub" para facilitar la integración
4. Autoriza a Render para acceder a tus repositorios

### Paso 3: Crear Nuevo Servicio Web

1. En el dashboard, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio:
   - Elige el repositorio que contiene tu proyecto
   - Haz clic en "Connect"

### Paso 4: Configurar el Servicio

En la página de creación del servicio, configura:

| Campo | Valor |
|-------|-------|
| **Name** | tamagotchi-fit-api |
| **Environment** | Node |
| **Region** | Oregon (u otra cercana) |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### Paso 5: Agregar Variables de Entorno

1. Desplázate hasta la sección "Environment"
2. Haz clic en "Add Environment Variable"
3. Agrega las siguientes variables:

```
MONGODB_URI = mongodb+srv://gerardomorales23s:217512javier@cluster0.5qp5c.mongodb.net/?appName=Cluster0
NODE_ENV = production
```

**Nota:** No agregues `PORT` - Render lo asigna automáticamente

### Paso 6: Desplegar

1. Haz clic en "Create Web Service"
2. Render comenzará el proceso de construcción e implementación
3. Espera a que veas el mensaje "Service is live" (5-10 minutos)

### Paso 7: Obtener URL de tu API

Una vez desplegada, verás una URL como:
```
https://tamagotchi-fit-api.onrender.com
```

Esta es tu URL de producción.

---

## 🧪 Verificación y Testing

### Test 1: Verificar Conexión a la API

```bash
curl https://tamagotchi-fit-api.onrender.com/api/v1/health
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "API Tamagotchi Fit está en funcionamiento",
  "timestamp": "2024-07-01T10:30:00.000Z",
  "environment": "production"
}
```

### Test 2: Registrar Datos de Sensor

```bash
curl -X POST https://tamagotchi-fit-api.onrender.com/api/v1/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_001",
    "heartRate": 95.5,
    "acceleration": 8.2,
    "petState": "FELIZ",
    "deviceInfo": {
      "model": "Test Device",
      "platform": "Testing"
    }
  }'
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "message": "Datos de sensor registrados exitosamente",
  "data": {
    "_id": "...",
    "userId": "test_user_001",
    "heartRate": 95.5,
    "acceleration": 8.2,
    "petState": "FELIZ",
    "timestamp": "2024-07-01T10:30:00.000Z",
    "deviceInfo": {
      "model": "Test Device",
      "platform": "Testing"
    }
  }
}
```

### Test 3: Obtener Estadísticas

```bash
curl https://tamagotchi-fit-api.onrender.com/api/v1/stats/test_user_001
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Historial obtenido exitosamente",
  "data": {
    "lecturas": [...],
    "pagination": {
      "total": 1,
      "limit": 100,
      "skip": 0,
      "pages": 1
    },
    "statistics": {
      "_id": null,
      "avgHeartRate": 95.5,
      "maxHeartRate": 95.5,
      "minHeartRate": 95.5,
      "avgAcceleration": 8.2,
      "totalRecords": 1
    }
  }
}
```

---

## 🔄 Actualizar Despliegue

Cada vez que hagas cambios en tu código:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Render detectará automáticamente los cambios y desplegará la nueva versión.

---

## 🆘 Solución de Problemas

### Problema: "Build failed"

**Solución:**
1. Ve a "Logs" en Render para ver el error exacto
2. Asegúrate de que `npm install` es el build command
3. Verifica que package.json tiene todas las dependencias

### Problema: "Cannot connect to database"

**Solución:**
1. Verifica que `MONGODB_URI` está correctamente configurada
2. Verifica que el whitelist de MongoDB incluye `0.0.0.0/0` (for production)
3. Reinicia el servicio en Render

### Problema: "Service is continuously restarting"

**Solución:**
1. Abre "Logs" para ver el error
2. Puede ser que falte la variable `NODE_ENV`
3. Asegúrate de que el puerto se obtiene de `process.env.PORT`

---

## ✅ Checklist Final

- [ ] Cuenta de MongoDB Atlas creada
- [ ] Cluster creado y usuario de base de datos configurado
- [ ] URI de conexión obtenida y probada localmente
- [ ] Repositorio Git configurado
- [ ] Cuenta de Render creada
- [ ] Servicio web creado en Render
- [ ] Variables de entorno configuradas
- [ ] Primera implementación exitosa
- [ ] Tests ejecutados exitosamente

¡Listo para usar! 🚀
