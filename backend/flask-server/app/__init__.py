from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, 
     resources={r"/*": {"origins": "*"}},
     methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
     supports_credentials=True,
     max_age=100000  # Cache preflight for 1 hour
)
api = Api(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import views, models