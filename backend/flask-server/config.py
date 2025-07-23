import os
import secrets

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Use DATABASE_URL env var if set (e.g. for Postgres), else fallback to /tmp/db.sqlite3 on Render
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:////tmp/db.sqlite3'  # note 4 slashes for absolute path
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(16))
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
