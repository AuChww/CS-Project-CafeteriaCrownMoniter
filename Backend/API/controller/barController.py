from flask import jsonify, request
from Infrastructure.Repository.barRepository import BarRepository
from Domain.entity.barEntity import BarEntity

bar_repo = BarRepository()

from Infrastructure.db_connection import session  # Assuming session is configured for database interaction

def get_all_bars():
    bars = session.query(BarEntity).all()
    return jsonify([bar.to_dict() for bar in bars]), 200

def get_bar_by_id(bar_id):
    bar = bar_repo.get_by_id(bar_id)
    if bar:
        return jsonify(bar.to_dict()), 200
    return jsonify({"error": "Bar not found"}), 404

def create_bar():
    data = request.json
    new_bar = BarEntity(
        bar_name=data["bar_name"],
        bar_location=data["bar_location"],
        bar_detail=data.get("bar_detail"),
    )
    bar_repo.create(new_bar)
    return jsonify(new_bar.to_dict()), 201

def update_bar(bar_id):
    data = request.json
    bar = bar_repo.get_by_id(bar_id)
    if not bar:
        return jsonify({"error": "Bar not found"}), 404
    bar.bar_name = data["bar_name"]
    bar.bar_location = data["bar_location"]
    bar.bar_detail = data.get("bar_detail")
    bar_repo.update(bar)
    return jsonify(bar.to_dict()), 200

def delete_bar(bar_id):
    success = bar_repo.delete(bar_id)
    if success:
        return jsonify({"message": "Bar deleted successfully"}), 200
    return jsonify({"error": "Bar not found"}), 404
