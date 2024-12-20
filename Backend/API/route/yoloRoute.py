from flask import Blueprint, request, jsonify
from Application.Service.feature.yoloService import YoloService

yolo_bp = Blueprint("yolo", __name__)
yolo_service = YoloService()

@yolo_bp.route("/count_people", methods=["POST"])
def count_people():
    data = request.json
    video_path = data.get("video_path")
    zone = data.get("zone")  # List of points for polyline
    if not video_path or not zone:
        return jsonify({"error": "Missing required parameters"}), 400

    result = yolo_service.count_people(video_path, zone)
    return jsonify(result)
