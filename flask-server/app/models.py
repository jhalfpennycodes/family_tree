from app import db


class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.Boolean, nullable=False)
    mother_id = db.Column(db.Integer, nullable=True)
    father_id = db.Column(db.Integer, nullable=True)