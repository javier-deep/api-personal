#!/bin/bash

# Script para testing rápido de la API Tamagotchi Fit
# Uso: bash test_api.sh

BASE_URL="http://localhost:3000/api/v1"

echo "════════════════════════════════════════"
echo "  Testing API Tamagotchi Fit"
echo "════════════════════════════════════════"

# Test 1: Health Check
echo ""
echo "📌 Test 1: Health Check"
echo "GET $BASE_URL/health"
curl -s "$BASE_URL/health" | python -m json.tool

# Test 2: Registrar Datos
echo ""
echo ""
echo "📌 Test 2: Registrar Datos de Sensor"
echo "POST $BASE_URL/sensor-data"
curl -s -X POST "$BASE_URL/sensor-data" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "heartRate": 125.5,
    "acceleration": 12.8,
    "petState": "FELIZ",
    "deviceInfo": {
      "model": "Pixel Watch 3",
      "platform": "Wear OS 5"
    }
  }' | python -m json.tool

# Test 3: Registrar múltiples
echo ""
echo ""
echo "📌 Test 3: Registrar Múltiples Sensores"

for i in {1..3}; do
  echo ""
  echo "Registrando usuario user_00$i..."
  curl -s -X POST "$BASE_URL/sensor-data" \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": \"user_00$i\",
      \"heartRate\": $((70 + RANDOM % 50)),
      \"acceleration\": $(echo "scale=1; $RANDOM % 10" | bc),
      \"petState\": \"NORMAL\"
    }" > /dev/null && echo "✓ Registrado"
done

# Test 4: Obtener Estadísticas
echo ""
echo ""
echo "📌 Test 4: Obtener Estadísticas"
echo "GET $BASE_URL/stats/user_12345"
curl -s "$BASE_URL/stats/user_12345" | python -m json.tool

# Test 5: Obtener con Paginación
echo ""
echo ""
echo "📌 Test 5: Obtener con Paginación"
echo "GET $BASE_URL/stats/user_12345?limit=5&skip=0"
curl -s "$BASE_URL/stats/user_12345?limit=5&skip=0" | python -m json.tool

echo ""
echo ""
echo "════════════════════════════════════════"
echo "  ✓ Tests completados"
echo "════════════════════════════════════════"
echo ""
