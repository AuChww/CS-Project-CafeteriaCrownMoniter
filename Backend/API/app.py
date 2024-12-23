from flask import Flask
from API.route.barRoute import bar_bp
from API.route.restaurantRoute import restaurant_bp
from API.route.reviewRoute import review_bp
from API.route.userRoute import user_bp

app = Flask(__name__)

app.register_blueprint(bar_bp)
app.register_blueprint(restaurant_bp)
app.register_blueprint(review_bp)
app.register_blueprint(user_bp)

if __name__ == "__main__":
    app.run(port=8000, debug=True)  # Update port to match docker-compose.yml
