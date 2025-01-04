from flask import Blueprint, jsonify, request
from Application.Service.feature.visitorHistoryService import (
    get_all_visitor_histories_service,
    get_visitor_history_by_id_service,
    add_visitor_history_service,
    update_visitor_history_service,
    delete_visitor_history_service
)

visitor_history_bp = Blueprint('visitor_history', __name__)

@visitor_history_bp.route('/api/v1/getAllVisitorHistories', methods=['GET'])
def get_all_visitor_histories_endpoint():
    visitor_histories = get_all_visitor_histories_service()
    return jsonify({'visitor_histories': visitor_histories})

@visitor_history_bp.route('/api/v1/getVisitorHistoryById/<int:visitor_history_id>', methods=['GET'])
def get_visitor_history_by_id_endpoint(visitor_history_id):
    visitor_history = get_visitor_history_by_id_service(visitor_history_id)
    if not visitor_history:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({
        'date_time': visitor_history.date_time,
        'zone_id': visitor_history.zone_id,
        'visitor_count': visitor_history.visitor_count
    })

@visitor_history_bp.route('/api/v1/addVisitorHistory', methods=['POST'])
def add_visitor_history_endpoint():
    data = request.json
    date_time = data.get('date_time')
    zone_id = data.get('zone_id')
    visitor_count = data.get('visitor_count')

    if not date_time or not zone_id or visitor_count is None:
        return jsonify({'message': 'Missing required fields'}), 400

    visitor_history_id = add_visitor_history_service(date_time, zone_id, visitor_count)
    return jsonify({'message': 'Visitor history added successfully', 'visitor_history_id': visitor_history_id}), 201

@visitor_history_bp.route('/api/v1/updateVisitorHistory/<int:visitor_history_id>', methods=['PUT'])
def update_visitor_history_endpoint(visitor_history_id):
    data = request.json
    updated = update_visitor_history_service(visitor_history_id, data)
    if not updated:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history updated successfully'})

@visitor_history_bp.route('/api/v1/deleteVisitorHistory/<int:visitor_history_id>', methods=['DELETE'])
def delete_visitor_history_endpoint(visitor_history_id):
    deleted = delete_visitor_history_service(visitor_history_id)
    if not deleted:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history deleted successfully'})
