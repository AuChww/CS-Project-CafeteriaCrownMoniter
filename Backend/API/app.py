from flask import Flask
from flask_cors import CORS
from API.route.barRoute import bar_bp
from API.route.restaurantRoute import restaurant_bp
from API.route.reviewRoute import review_bp
from API.route.userRoute import user_bp
from API.route.reportRoute import report_bp
from API.route.zoneRoute import zone_bp
from API.route.visitorHistoryRoute import visitor_history_bp


app = Flask(__name__)
app.register_blueprint(bar_bp)
app.register_blueprint(restaurant_bp)
app.register_blueprint(review_bp)
app.register_blueprint(user_bp)
app.register_blueprint(report_bp)
app.register_blueprint(zone_bp)
app.register_blueprint(visitor_history_bp)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

if __name__ == "__main__":
    app.run(port=8000, debug=True)  # Update port to match docker-compose.yml
