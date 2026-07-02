# Instrucciones para Desplegar en Render.com

## 📝 Pasos Previos

1. ✅ Tener una cuenta en GitHub con el repositorio
2. ✅ MongoDB Atlas configurado y la URI lista
3. ✅ Cuenta en Render.com

## 🔧 Configurar Variables en Render

Cuando crees el servicio web en Render, agrega estas variables de entorno:

### Variable 1: MONGODB_URI
```
MONGODB_URI=mongodb+srv://gerardomorales23s:217512javier@cluster0.5qp5c.mongodb.net/?appName=Cluster0
```

### Variable 2: NODE_ENV
```
NODE_ENV=production
```

### Variable 3: PORT (OPCIONAL)
No configurar - Render lo asigna automáticamente

## 🚀 Build Command (en Render)
```
npm install
```

## ▶️ Start Command (en Render)
```
npm start
```

## ✅ Verificación Después de Desplegar

Una vez que Render diga "Service is live", prueba:

```bash
curl https://tu-servicio.onrender.com/api/v1/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API Tamagotchi Fit está en funcionamiento",
  "timestamp": "2024-07-01T10:30:00.000Z",
  "environment": "production"
}
```

## 📊 URL de Tu API

Una vez desplegada:
- Base URL: `https://tamagotchi-fit-api.onrender.com`
- Health: `https://tamagotchi-fit-api.onrender.com/api/v1/health`
- POST Sensor: `https://tamagotchi-fit-api.onrender.com/api/v1/sensor-data`
- GET Stats: `https://tamagotchi-fit-api.onrender.com/api/v1/stats/:userId`

## 🔄 Actualizar Despliegue

Cada cambio en main se desplegará automáticamente:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Render detectará y desplegará automáticamente (~2-5 minutos).

## 🆘 Si algo falla

1. Ve al dashboard de Render
2. Abre el servicio
3. Mira la sección "Logs"
4. Busca mensajes de error
5. Problemas comunes:
   - MONGODB_URI incorrecta → Verificar credenciales
   - Módulos no instalados → Verificar package.json
   - Puerto incorrecto → Render asigna automáticamente
   - BD no existe → Crear en MongoDB Atlas

## 📌 Importante

- Los logs se limpian regularmente en Render
- El servicio gratis "duerme" tras 15 minutos sin uso
- Primera petición tras inactividad puede ser lenta (~30 seg)
- Para evitar esto, usar la versión de pago o un uptime monitor

¡Tu API está lista para producción! 🚀
