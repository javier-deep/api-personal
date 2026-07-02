import fetch from 'node-fetch'; // npm install node-fetch@2

/**
 * Ejemplos de uso de la API Tamagotchi Fit
 * 
 * Para usar estos ejemplos:
 * 1. Asegúrate de que la API está corriendo (npm start)
 * 2. Ejecuta: node examples.js
 */

const API_URL = 'http://localhost:3000/api/v1';

// ========== UTILIDADES ==========

async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}

// ========== EJEMPLOS ==========

async function ejemplo1_HealthCheck() {
  console.log('\n📌 Ejemplo 1: Health Check\n');
  
  const { status, data } = await request('GET', '/health');
  
  console.log(`Status: ${status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
}

async function ejemplo2_RegistrarSensor() {
  console.log('\n📌 Ejemplo 2: Registrar Datos de Sensor\n');
  
  const datos = {
    userId: 'user_12345',
    heartRate: 125.5,
    acceleration: 12.8,
    petState: 'FELIZ',
    timestamp: new Date().toISOString(),
    deviceInfo: {
      model: 'Pixel Watch 3',
      platform: 'Wear OS 5',
    },
  };

  console.log('Enviando:', JSON.stringify(datos, null, 2));
  
  const { status, data } = await request('POST', '/sensor-data', datos);
  
  console.log(`Status: ${status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
}

async function ejemplo3_RegistrarMultiples() {
  console.log('\n📌 Ejemplo 3: Registrar Múltiples Sensores\n');
  
  const usuarios = [
    { userId: 'user_001', heartRate: 72, acceleration: 2.1 },
    { userId: 'user_002', heartRate: 95, acceleration: 5.3 },
    { userId: 'user_003', heartRate: 118, acceleration: 8.9 },
  ];

  for (const usuario of usuarios) {
    const datos = {
      ...usuario,
      petState: 'NORMAL',
      timestamp: new Date().toISOString(),
    };

    const { status, data } = await request('POST', '/sensor-data', datos);
    console.log(`${usuario.userId}: ${status} - ${data.message}`);
  }
}

async function ejemplo4_ObtenerEstadisticas() {
  console.log('\n📌 Ejemplo 4: Obtener Estadísticas de Usuario\n');
  
  const userId = 'user_12345';
  
  const { status, data } = await request('GET', `/stats/${userId}`);
  
  console.log(`Status: ${status}`);
  console.log('Lecturas:', data.data.lecturas.length);
  console.log('Estadísticas:', JSON.stringify(data.data.statistics, null, 2));
  console.log('Paginación:', JSON.stringify(data.data.pagination, null, 2));
}

async function ejemplo5_ObtenerConPaginacion() {
  console.log('\n📌 Ejemplo 5: Obtener con Paginación\n');
  
  const { status, data } = await request(
    'GET',
    `/stats/user_001?limit=10&skip=0&sort=-timestamp`
  );
  
  console.log(`Status: ${status}`);
  console.log('Paginación:', JSON.stringify(data.data.pagination, null, 2));
}

async function ejemplo6_ObtenerOrdenado() {
  console.log('\n📌 Ejemplo 6: Obtener Datos Ordenados\n');
  
  // Por heartRate ascendente
  const { data } = await request('GET', `/stats/user_001?sort=heartRate&limit=5`);
  
  console.log('Top 5 por heartRate (menor a mayor):');
  data.data.lecturas.forEach((lectura, i) => {
    console.log(`  ${i + 1}. ${lectura.heartRate} bpm`);
  });
}

// ========== EJECUTAR EJEMPLOS ==========

async function main() {
  try {
    console.log('════════════════════════════════════════');
    console.log('  Ejemplos de API Tamagotchi Fit');
    console.log('════════════════════════════════════════');

    await ejemplo1_HealthCheck();
    await ejemplo2_RegistrarSensor();
    await ejemplo3_RegistrarMultiples();
    await ejemplo4_ObtenerEstadisticas();
    await ejemplo5_ObtenerConPaginacion();
    await ejemplo6_ObtenerOrdenado();

    console.log('\n════════════════════════════════════════');
    console.log('  ✓ Todos los ejemplos completados');
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
