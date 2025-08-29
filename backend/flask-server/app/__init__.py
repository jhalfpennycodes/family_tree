from flask import Flask, request
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    origins=Config.CORS_ORIGINS or [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)

# Add manual CORS headers as backup
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Then initialize other extensions
api = Api(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import views, models