from app import db
from sqlalchemy import ForeignKey
from sqlalchemy import JSON

spouse_link = db.Table('spouse_link', 
    db.Column('person_id', db.Integer, db.ForeignKey('person.id')),
    db.Column('spouse_id', db.Integer, db.ForeignKey('person.id'))
)


class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.Integer, db.ForeignKey('family.id'))
    family = db.relationship('Family', backref='members')
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    dob = db.Column(db.DateTime(), nullable=False)
    mother_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=True)
    father_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=True)
    spouses = db.relationship('Person', secondary=spouse_link,
                                primaryjoin=id == spouse_link.c.person_id,
                                secondaryjoin=id == spouse_link.c.spouse_id,
                                backref='partners'
                               )
    birth_location = db.Column(db.String(50), nullable=True)
    profession = db.Column(db.String(50), nullable=True)
    early_life_description = db.Column(db.Text, nullable=True)
    young_adult_description = db.Column(db.Text, nullable=True)
    adult_life_description = db.Column(db.Text, nullable=True)
    late_life_description = db.Column(db.Text, nullable=True)
    avatar_img = db.Column(db.String(255), nullable=True)
    images = db.Column(JSON, nullable=True)



    def __str__(self):
        return f"{self.first_name} {self.last_name} (ID: {self.id}, DOB: {self.dob.strftime('%Y-%m-%d')})"


class Family(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
