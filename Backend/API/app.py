from flask import Flask
from API.route.yoloRoute import yolo_bp

app = Flask(__name__)

# Register blueprint
app.register_blueprint(yolo_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
