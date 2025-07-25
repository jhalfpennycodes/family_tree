import os
import secrets

# Get the absolute path to the backend/flask-server directory
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///' + os.path.join(basedir, 'db.sqlite3')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(16))
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
