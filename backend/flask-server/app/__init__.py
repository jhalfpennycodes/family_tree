from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

# Try this CORS configuration instead
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

api = Api(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import views, models