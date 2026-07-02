# 🚀 Quick Start - Guía Rápida de Inicio

## ⚡ Iniciar en 5 Minutos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Ejecutar API
```bash
npm run dev
```

Deberías ver:
```
╔════════════════════════════════════╗
║   Tamagotchi Fit API               ║
║   Running on port: 3000            ║
║   Environment: development         ║
╚════════════════════════════════════╝
```

### 3. Probar en Otra Terminal

**Test Health Check:**
```bash
curl http://localhost:3000/api/v1/health
```

**Registrar Dato:**
```bash
curl -X POST http://localhost:3000/api/v1/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_test",
    "heartRate": 80,
    "acceleration": 5
  }'
```

**Obtener Estadísticas:**
```bash
curl http://localhost:3000/api/v1/stats/user_test
```

✅ ¡Listo!

---

## 📋 Estructura del Proyecto

```
app-personal/
├── server.js                    # Servidor principal
├── config.js                    # Configuración
├── .env                        # Variables de entorno (PRIVADO)
├── package.json                # Dependencias
├── Procfile                    # Para Render
│
├── models/
│   └── Lectura.js             # Esquema MongoDB
│
├── routes/
│   └── sensorData.js          # Endpoints
│
├── README.md                   # Documentación completa
├── SETUP.md                    # Configuración de BD y Render
├── SECURITY.md                 # Seguridad y mejores prácticas
├── POSTMAN_GUIDE.md           # Testing con Postman
│
├── examples.js                 # Ejemplos en Node.js
├── examples_python.py         # Ejemplos en Python
├── test_api.sh                # Script de testing
└── Tamagotchi_Fit_API.postman_collection.json
```

---

## 🔄 Flujo Básico

```
Sensor (dispositivo)
    ↓
POST /api/v1/sensor-data
    ↓
MongoDB (guardará)
    ↓
GET /api/v1/stats/:userId
    ↓
Datos históricos + estadísticas
    ↓
App (display)
```

---

## 📚 Documentos Importantes

| Archivo | Propósito |
|---------|-----------|
| **README.md** | Documentación completa de la API |
| **SETUP.md** | Configuración de MongoDB Atlas y Render |
| **SECURITY.md** | Seguridad y mejores prácticas |
| **POSTMAN_GUIDE.md** | Testing con Postman |
| **examples.js** | Ejemplos en Node.js |
| **examples_python.py** | Ejemplos en Python |

---

## 🎯 Próximos Pasos

### Para Desarrollo
1. ✅ Instalar dependencias
2. ✅ Ejecutar servidor
3. ✅ Probar endpoints
4. ✅ Leer README.md para más detalles

### Para Despliegue
1. Seguir pasos en **SETUP.md**
2. Configurar MongoDB Atlas
3. Configurar Render.com
4. Hacer push a GitHub
5. Render desplegará automáticamente

### Para Producción
1. Leer **SECURITY.md**
2. Implementar autenticación
3. Agregar rate limiting
4. Configurar monitoreo
5. Hacer backup de BD

---

## 🐛 Troubleshooting Rápido

### ❌ Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### ❌ Error: "Port already in use"
```bash
# Cambiar en .env
PORT=3001
```

### ❌ Error: "Cannot connect to MongoDB"
- Verificar MONGODB_URI en .env
- Verificar que BD existe en Atlas
- Verificar whitelist de IP

### ❌ La API no responde
- Verificar que está en puerto 3000
- Revisar logs de error
- Asegurarse de que npm start/dev se ejecutó

---

## 🔗 URLs Útiles

**Local:**
- API: http://localhost:3000
- Health Check: http://localhost:3000/api/v1/health

**Producción (después de desplegar):**
- API: https://tamagotchi-fit-api.onrender.com

---

## 💡 Tips

✅ Usar archivos de ejemplo para entender la estructura  
✅ Usar Postman para testing visual  
✅ Leer README.md completo antes de desplegar  
✅ Revisar logs regularmente en producción  
✅ Hacer backup de MongoDB frecuentemente  

---

## 📞 Ayuda

Ver documentos específicos para más detalles:
```bash
# Documentación completa
cat README.md

# Configuración de BD
cat SETUP.md

# Seguridad
cat SECURITY.md

# Testing
cat POSTMAN_GUIDE.md
```

¡Bienvenido! 🎉 Comienza con `npm run dev`
