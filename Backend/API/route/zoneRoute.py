from flask import Blueprint, jsonify, request
from Application.Service.feature.zoneService import (
    get_all_zones_service,
    get_zone_by_id_service,
    get_visitor_history_by_zone_id_service,
    get_restaurant_by_zone_id_service,
    get_all_report_by_zone_id_service,
    add_zone_service,
    update_zone_service,
    delete_zone_service
)

zone_bp = Blueprint('zones', __name__)

@zone_bp.route('/api/v1/getAllZones', methods=['GET'])
def get_all_zones_endpoint():
    zones = get_all_zones_service()  # Use the service function here
    zone_list = [
        {
            'zone_id': z.zone_id,
            'bar_id': z.bar_id,
            'zone_name': z.zone_name,
            'zone_detail': z.zone_detail,
            'max_people_in_zone': z.max_people_in_zone,
            'current_visitor_count': z.current_visitor_count,
            'update_date_time': z.update_date_time,
            'zone_time': z.zone_time
        }
        for z in zones
    ]
    return jsonify({'zones': zone_list})

@zone_bp.route('/api/v1/getZoneById/<int:zone_id>', methods=['GET'])
def get_zone_by_id_endpoint(zone_id):
    zone = get_zone_by_id_service(zone_id)  # Use the service function here
    if not zone:
        return jsonify({'message': 'Zone not found'}), 404

    return jsonify({
        'zone_id': zone.zone_id,
        'bar_id': zone.bar_id,
        'zone_name': zone.zone_name,
        'zone_detail': zone.zone_detail,
        'max_people_in_zone': zone.max_people_in_zone,
        'current_visitor_count': zone.current_visitor_count,
        'update_date_time': zone.update_date_time,
        'zone_time': zone.zone_time
    })

@zone_bp.route('/api/v1/getVisitorHistoryByZoneId/<int:zone_id>', methods=['GET'])
def get_visitor_history_by_zone_id_endpoint(zone_id):
    visitor_histories = get_visitor_history_by_zone_id_service(zone_id)
    if not visitor_histories:
        return jsonify({'message': 'No visitor history found for the given zone ID'}), 404
    return jsonify([
        {
            'date_time': history.date_time,
            'zone_id': history.zone_id,
            'visitor_count': history.visitor_count
        }
        for history in visitor_histories
    ])

@zone_bp.route('/api/v1/getRestaurantByZoneId/<int:zone_id>', methods=['GET'])
def get_restaurant_by_zone_id_endpoint(zone_id):
    restaurants = get_restaurant_by_zone_id_service(zone_id)  # Use the service function here
    if not restaurants:
        return jsonify({'message': 'No restaurants found for this zone'}), 404

    return jsonify({'restaurants': restaurants})

@zone_bp.route('/api/v1/getAllReportByZoneId/<int:zone_id>', methods=['GET'])
def get_all_report_by_zone_id_endpoint(zone_id):
    reports = get_all_report_by_zone_id_service(zone_id)  # Use the service function here
    if not reports:
        return jsonify({'message': 'No reports found for this zone'}), 404

    return jsonify({'reports': reports})

@zone_bp.route('/api/v1/addZone', methods=['POST'])
def add_zone_endpoint():
    data = request.json
    bar_id = data.get('bar_id')
    zone_name = data.get('zone_name')
    zone_detail = data.get('zone_detail', '')
    max_people_in_zone = data.get('max_people_in_zone', 0)
    current_visitor_count = data.get('current_visitor_count', 0)
    zone_time = data.get('zone_time', None)

    if not bar_id or not zone_name:
        return jsonify({'message': 'Missing required fields'}), 400

    zone_id = add_zone_service(bar_id, zone_name, zone_detail, max_people_in_zone, current_visitor_count, zone_time)  # Use the service function here
    return jsonify({'message': 'Zone added successfully', 'zone_id': zone_id}), 201

@zone_bp.route('/api/v1/updateZone/<int:zone_id>', methods=['PUT'])
def update_zone_endpoint(zone_id):
    data = request.json
    updated = update_zone_service(zone_id, data)  # Use the service function here
    if not updated:
        return jsonify({'message': 'Zone not found'}), 404

    return jsonify({'message': 'Zone updated successfully'})

@zone_bp.route('/api/v1/deleteZone/<int:zone_id>', methods=['DELETE'])
def delete_zone_endpoint(zone_id):
    deleted = delete_zone_service(zone_id)  # Use the service function here
    if not deleted:
        return jsonify({'message': 'Zone not found'}), 404

    return jsonify({'message': 'Zone deleted successfully'})
