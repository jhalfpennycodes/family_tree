from flask import Flask, request
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime, timedelta
from werkzeug.exceptions import HTTPException
import os


app = Flask(__name__)
app.config.from_object(Config)
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config["JWT_SECRET_KEY"] = os.getenv('SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1) 
jwt = JWTManager(app)

CORS(
    app,
    resources={r"/familyTree/*": {"origins": ["http://localhost", "http://127.0.0.1", "http://localhost:5173"]}},
    supports_credentials=True,
)


# Then initialize other extensions
api = Api(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import views, models, api