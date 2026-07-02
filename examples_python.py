"""
Ejemplos de uso de la API Tamagotchi Fit desde Python

Instalación de dependencias:
  pip install requests

Para ejecutar:
  python examples_python.py
"""

import requests
import json
from datetime import datetime

API_URL = 'http://localhost:3000/api/v1'

# ========== UTILIDADES ==========

def request_api(method, endpoint, body=None):
    """Realiza una petición a la API"""
    url = f'{API_URL}{endpoint}'
    headers = {'Content-Type': 'application/json'}
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, json=body, headers=headers)
        else:
            raise ValueError(f'Método {method} no soportado')
        
        return {
            'status': response.status_code,
            'data': response.json()
        }
    except Exception as error:
        print(f'Error en la petición: {error}')
        return None

# ========== EJEMPLOS ==========

def ejemplo1_health_check():
    print('\n📌 Ejemplo 1: Health Check\n')
    
    result = request_api('GET', '/health')
    
    if result:
        print(f"Status: {result['status']}")
        print(f"Response: {json.dumps(result['data'], indent=2)}")

def ejemplo2_registrar_sensor():
    print('\n📌 Ejemplo 2: Registrar Datos de Sensor\n')
    
    datos = {
        'userId': 'user_12345',
        'heartRate': 125.5,
        'acceleration': 12.8,
        'petState': 'FELIZ',
        'timestamp': datetime.now().isoformat() + 'Z',
        'deviceInfo': {
            'model': 'Pixel Watch 3',
            'platform': 'Wear OS 5'
        }
    }
    
    print(f"Enviando: {json.dumps(datos, indent=2)}")
    
    result = request_api('POST', '/sensor-data', datos)
    
    if result:
        print(f"Status: {result['status']}")
        print(f"Response: {json.dumps(result['data'], indent=2)}")

def ejemplo3_registrar_multiples():
    print('\n📌 Ejemplo 3: Registrar Múltiples Sensores\n')
    
    usuarios = [
        {'userId': 'user_001', 'heartRate': 72, 'acceleration': 2.1},
        {'userId': 'user_002', 'heartRate': 95, 'acceleration': 5.3},
        {'userId': 'user_003', 'heartRate': 118, 'acceleration': 8.9},
    ]
    
    for usuario in usuarios:
        datos = {
            **usuario,
            'petState': 'NORMAL',
            'timestamp': datetime.now().isoformat() + 'Z'
        }
        
        result = request_api('POST', '/sensor-data', datos)
        
        if result:
            print(f"{usuario['userId']}: {result['status']} - {result['data'].get('message', 'OK')}")

def ejemplo4_obtener_estadisticas():
    print('\n📌 Ejemplo 4: Obtener Estadísticas de Usuario\n')
    
    user_id = 'user_12345'
    
    result = request_api('GET', f'/stats/{user_id}')
    
    if result:
        print(f"Status: {result['status']}")
        data = result['data']['data']
        
        print(f"Lecturas registradas: {len(data['lecturas'])}")
        print(f"Estadísticas: {json.dumps(data['statistics'], indent=2)}")
        print(f"Paginación: {json.dumps(data['pagination'], indent=2)}")

def ejemplo5_obtener_con_paginacion():
    print('\n📌 Ejemplo 5: Obtener con Paginación\n')
    
    result = request_api('GET', '/stats/user_001?limit=10&skip=0&sort=-timestamp')
    
    if result:
        pagination = result['data']['data']['pagination']
        print(f"Total de registros: {pagination['total']}")
        print(f"Página 1 de {pagination['pages']}")
        print(f"Mostrando {len(result['data']['data']['lecturas'])} registros")

def ejemplo6_analisis_datos():
    print('\n📌 Ejemplo 6: Análisis de Datos\n')
    
    result = request_api('GET', '/stats/user_001?limit=100')
    
    if result:
        lecturas = result['data']['data']['lecturas']
        stats = result['data']['data']['statistics']
        
        if stats:
            print(f"👤 Usuario: user_001")
            print(f"📊 Total de registros: {stats['totalRecords']}")
            print(f"❤️  Ritmo cardíaco promedio: {stats['avgHeartRate']:.1f} bpm")
            print(f"   - Máximo: {stats['maxHeartRate']:.1f} bpm")
            print(f"   - Mínimo: {stats['minHeartRate']:.1f} bpm")
            print(f"📈 Aceleración promedio: {stats['avgAcceleration']:.2f}")
            
            # Contar estados
            if lecturas:
                estados = {}
                for lectura in lecturas:
                    estado = lectura.get('petState', 'NORMAL')
                    estados[estado] = estados.get(estado, 0) + 1
                
                print(f"\n🎭 Estados del mascota:")
                for estado, count in estados.items():
                    porcentaje = (count / len(lecturas)) * 100
                    print(f"   - {estado}: {count} ({porcentaje:.1f}%)")

def ejemplo7_comparar_usuarios():
    print('\n📌 Ejemplo 7: Comparar Múltiples Usuarios\n')
    
    usuarios = ['user_001', 'user_002', 'user_003']
    
    print(f"{'Usuario':<15} {'Avg HR':<10} {'Max HR':<10} {'Aceleración':<12}")
    print('-' * 50)
    
    for user_id in usuarios:
        result = request_api('GET', f'/stats/{user_id}?limit=1')
        
        if result and result['data']['data']['statistics']:
            stats = result['data']['data']['statistics']
            print(f"{user_id:<15} {stats['avgHeartRate']:<10.1f} {stats['maxHeartRate']:<10.1f} {stats['avgAcceleration']:<12.2f}")

# ========== EJECUTAR EJEMPLOS ==========

def main():
    print('════════════════════════════════════════')
    print('  Ejemplos de API Tamagotchi Fit (Python)')
    print('════════════════════════════════════════')
    
    try:
        ejemplo1_health_check()
        ejemplo2_registrar_sensor()
        ejemplo3_registrar_multiples()
        ejemplo4_obtener_estadisticas()
        ejemplo5_obtener_con_paginacion()
        ejemplo6_analisis_datos()
        ejemplo7_comparar_usuarios()
        
        print('\n════════════════════════════════════════')
        print('  ✓ Todos los ejemplos completados')
        print('════════════════════════════════════════\n')
        
    except Exception as error:
        print(f'Error: {error}')

if __name__ == '__main__':
    main()
