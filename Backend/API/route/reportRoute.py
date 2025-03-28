from flask import Blueprint, jsonify, request,  send_from_directory
import os
from Application.Service.feature.reportService import (
    get_all_reports_service,
    get_report_by_id_service,
    add_report_service,
    update_report_image_service,
    update_report_service,
    delete_report_service
)

report_bp = Blueprint('reports', __name__)

@report_bp.route('/api/v1/getAllReports', methods=['GET'])
def get_all_reports_endpoint():
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
    data = request.form
    user_id = data.get('user_id')
    zone_id = data.get('zone_id')
    report_status = data.get('report_status')
    report_type = data.get('report_type')
    report_message = data.get('report_message', '')
    report_image = request.files.get('report_image') 

    report_id = add_report_service(user_id, zone_id, report_status, report_type, report_message)  # Use the service function here

    if report_image:
        file_path = f'public/image/reportImages/report{report_id}.png'
        file_name = f'report{report_id}.png'
        report_image.save(file_path)
        print(f"Image saved to {file_path}")
        update_report_image_service(report_id, file_name)  
    else:
        file_name = None

    if not user_id or not zone_id or not report_status or not report_type:
        return jsonify({'message': 'Missing required fields'}), 400

    return jsonify({'message': 'Report added successfully', 'report_id': report_id}), 201

@report_bp.route('/api/v1/updateReport/<int:report_id>', methods=['PUT'])
def update_report_endpoint(report_id):
    data = request.json
    if data:
        return jsonify(data)
    
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


IMAGE_FOLDER = 'public/image/reportImages'

@report_bp.route('/api/v1/getReportImage/<string:file_name>', methods=['GET'])
def get_image_url(file_name):
    file_path = os.path.join(IMAGE_FOLDER, file_name)
    
    
    if not os.path.isfile(file_path):
        return jsonify({"url": None}), 200 

    image_url = f"http://localhost:8000/public/image/reportImages/{file_name}"
    return jsonify({"url": image_url})  

@report_bp.route('/public/image/reportImages/<path:file_name>')
def serve_actual_image(file_name):
    image_directory = os.path.join(os.getcwd(), "public", "image", "reportImages")
    return send_from_directory(image_directory, file_name)
