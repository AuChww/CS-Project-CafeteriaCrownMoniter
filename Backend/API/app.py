from flask import Flask
from API.route.barRoute import bar_bp

app = Flask(__name__)

app.register_blueprint(bar_bp)

if __name__ == "__main__":
    app.run(port=8000, debug=True)  # Update port to match docker-compose.yml
