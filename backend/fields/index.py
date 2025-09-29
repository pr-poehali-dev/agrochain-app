import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение данных о полях и событиях из базы данных
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с данными полей и событий
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Обработка CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Получение строки подключения к БД
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    try:
        # Подключение к базе данных
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        if method == 'GET':
            # Получение всех полей
            cursor.execute('''
                SELECT id, name, area, crop, status, progress, 
                       plant_date, harvest_date, created_at, updated_at
                FROM fields 
                ORDER BY created_at DESC
            ''')
            
            fields_data = cursor.fetchall()
            fields = []
            for row in fields_data:
                fields.append({
                    'id': row[0],
                    'name': row[1],
                    'area': float(row[2]),
                    'crop': row[3],
                    'status': row[4],
                    'progress': row[5],
                    'plantDate': row[6].isoformat() if row[6] else None,
                    'harvestDate': row[7].isoformat() if row[7] else None,
                    'createdAt': row[8].isoformat() if row[8] else None,
                    'updatedAt': row[9].isoformat() if row[9] else None
                })
            
            # Получение событий
            cursor.execute('''
                SELECT fe.id, fe.field_id, f.name as field_name, fe.action, 
                       fe.event_date, fe.status, fe.notes, fe.created_at
                FROM field_events fe
                JOIN fields f ON fe.field_id = f.id
                WHERE fe.event_date >= CURRENT_DATE
                ORDER BY fe.event_date ASC
            ''')
            
            events_data = cursor.fetchall()
            events = []
            for row in events_data:
                # Вычисление дней до события
                event_date = row[4]
                from datetime import date
                days_until = (event_date - date.today()).days
                
                events.append({
                    'id': row[0],
                    'fieldId': row[1],
                    'field': row[2],
                    'action': row[3],
                    'date': row[4].isoformat(),
                    'days': max(0, days_until),
                    'status': row[5],
                    'notes': row[6]
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'fields': fields,
                    'events': events,
                    'total_area': sum(field['area'] for field in fields),
                    'ready_for_harvest': len([f for f in fields if f['status'] == 'harvest-ready'])
                })
            }
        
        elif method == 'POST':
            # Добавление нового поля
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name')
            area = body_data.get('area')
            crop = body_data.get('crop')
            
            if not all([name, area, crop]):
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields: name, area, crop'})
                }
            
            cursor.execute('''
                INSERT INTO fields (name, area, crop, status, progress)
                VALUES (%s, %s, %s, 'planted', 0)
                RETURNING id, name, area, crop, status, progress
            ''', (name, float(area), crop))
            
            new_field = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'field': {
                        'id': new_field[0],
                        'name': new_field[1],
                        'area': float(new_field[2]),
                        'crop': new_field[3],
                        'status': new_field[4],
                        'progress': new_field[5]
                    }
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }