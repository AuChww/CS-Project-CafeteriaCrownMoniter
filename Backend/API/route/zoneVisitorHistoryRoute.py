from flask import Blueprint, jsonify, request
from Application.Service.feature.zoneVisitorHistoryService import (
    get_all_zone_visitor_histories_service,
    get_visitor_history_by_zone_id_service,
    add_zone_visitor_history_service,
    update_zone_visitor_history_service,
    delete_zone_visitor_history_service,
    get_all_zones_service
)
from Application.Service.feature.zoneService import (
    update_zone_count_service
)

from Application.objroi import get_zone_human_count
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import requests
import pytz 

zone_visitor_history_bp = Blueprint('zone_visitor_history', __name__)

@zone_visitor_history_bp.route('/api/v1/getAllZoneVisitorHistory', methods=['GET'])
def get_all_zone_visitor_histories_endpoint():
    visitor_histories = get_all_zone_visitor_histories_service()
    visitor_histories_dicts = [
        {
            'zone_visitor_history_id': vh.zone_visitor_history_id,
            'date_time': vh.date_time,
            'zone_id': vh.zone_id,
            'visitor_count': vh.visitor_count,
        }
        for vh in visitor_histories
    ]
    return jsonify({'visitor_histories': visitor_histories_dicts})

@zone_visitor_history_bp.route('/api/v1/addZoneVisitorHistory', methods=['POST'])
def add_zone_visitor_history_endpoint():
    data = request.json
    date_time = data.get('date_time')
    zone_id = data.get('zone_id')
    visitor_count = data.get('visitor_count')

    if not date_time or not zone_id or visitor_count is None:
        return jsonify({'message': 'Missing required fields'}), 400

    zone_visitor_history_id = add_zone_visitor_history_service(date_time, zone_id, visitor_count)
    return jsonify({'message': 'Visitor history added successfully', 'zone_visitor_history_id': zone_visitor_history_id}), 201


@zone_visitor_history_bp.route('/api/v1/updateZoneVisitorHistory/<int:zone_visitor_history_id>', methods=['PUT'])
def update_zone_visitor_history_endpoint(zone_visitor_history_id):
    data = request.json
    updated = update_zone_visitor_history_service(zone_visitor_history_id, data)
    if not updated:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history updated successfully'})

@zone_visitor_history_bp.route('/api/v1/deleteZoneVisitorHistory/<int:zone_visitor_history_id>', methods=['DELETE'])
def delete_zone_visitor_history_endpoint(zone_visitor_history_id):
    deleted = delete_zone_visitor_history_service(zone_visitor_history_id)
    if not deleted:
        return jsonify({'message': 'Visitor history not found'}), 404
    return jsonify({'message': 'Visitor history deleted successfully'})
