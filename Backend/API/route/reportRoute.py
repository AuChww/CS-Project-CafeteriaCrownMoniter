from flask import Blueprint, jsonify, request
from Application.Service.feature.reportService import (
    get_all_reports_service,
    get_report_by_id_service,
    add_report_service,
    update_report_service,
    delete_report_service
)

report_bp = Blueprint('reports', __name__)

@report_bp.route('/api/v1/getAllReports', methods=['GET'])
def get_all_reports_endpoint():
    print("get_all_reports_endpoint called")
    reports = get_all_reports_service()  # Use the service function here
    report_list = [
        {
            'report_id': report.report_id,
            'user_id': report.user_id,
            'zone_id': report.zone_id,
            'report_status': report.report_status,
            'report_type': report.report_type,
            'report_message': report.report_message,
            'created_time': report.created_time,
            'report_image': report.report_image
        }
        for report in reports
    ]
    return jsonify({'reports': report_list})

@report_bp.route('/api/v1/getReportById/<int:report_id>', methods=['GET'])
def get_report_by_id_endpoint(report_id):
    report = get_report_by_id_service(report_id)  # Use the service function here
    if not report:
        return jsonify({'message': 'Report not found'}), 404

    return jsonify({
        'report_id': report.report_id,
        'user_id': report.user_id,
        'zone_id': report.zone_id,
        'report_status': report.report_status,
        'report_type': report.report_type,
        'report_message': report.report_message,
        'created_time': report.created_time,
        'report_image': report.report_image
    })

@report_bp.route('/api/v1/addReport', methods=['POST'])
def add_report_endpoint():
    data = request.json
    user_id = data.get('user_id')
    zone_id = data.get('zone_id')
    report_status = data.get('report_status')
    report_type = data.get('report_type')
    report_message = data.get('report_message', '')
    report_image = data.get('report_image', None)

    if not user_id or not zone_id or not report_status or not report_type:
        return jsonify({'message': 'Missing required fields'}), 400

    report_id = add_report_service(user_id, zone_id, report_status, report_type, report_message, report_image)  # Use the service function here
    return jsonify({'message': 'Report added successfully', 'report_id': report_id}), 201

@report_bp.route('/api/v1/updateReport/<int:report_id>', methods=['PUT'])
def update_report_endpoint(report_id):
    data = request.json
    updated = update_report_service(report_id, data)  # Use the service function here
    if not updated:
        return jsonify({'message': 'Report not found'}), 404

    return jsonify({'message': 'Report updated successfully'})

@report_bp.route('/api/v1/deleteReport/<int:report_id>', methods=['DELETE'])
def delete_report_endpoint(report_id):
    deleted = delete_report_service(report_id)  # Use the service function here
    if not deleted:
        return jsonify({'message': 'Report not found'}), 404

    return jsonify({'message': 'Report deleted successfully'})
