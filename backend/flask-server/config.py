import os
import secrets

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:////tmp/db.sqlite3'  # fallback to tmp folder
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(16))
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
