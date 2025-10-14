from app import db
from sqlalchemy import ForeignKey
from sqlalchemy import JSON
from passlib.apps import custom_app_context as pwd_context

spouse_link = db.Table('spouse_link', 
    db.Column('person_id', db.Integer, db.ForeignKey('person.id')),
    db.Column('spouse_id', db.Integer, db.ForeignKey('person.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(32), nullable=False, index=True, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    family_id = db.Column(db.Integer, db.ForeignKey('family.id'), nullable=True)
    family = db.relationship('Family', backref='users')
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=True)  # ADD THIS
    person = db.relationship('Person', backref='user', uselist=False)
    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)


class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_id = db.Column(db.Integer, db.ForeignKey('family.id'), nullable=False)
    family = db.relationship('Family', backref='members')
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    dob = db.Column(db.DateTime(), nullable=False)
    mother_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=True)
    father_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=True)
    mother = db.relationship('Person', remote_side=[id], foreign_keys=[mother_id], backref='children_from_mother')
    father = db.relationship('Person', remote_side=[id], foreign_keys=[father_id], backref='children_from_father')
    spouses = db.relationship('Person', secondary=spouse_link, primaryjoin=id == spouse_link.c.person_id, secondaryjoin=id == spouse_link.c.spouse_id, backref='partners')
    birth_location = db.Column(db.String(50), nullable=True)
    profession = db.Column(db.String(50), nullable=True)
    early_life_description = db.Column(db.Text, nullable=True)
    young_adult_description = db.Column(db.Text, nullable=True)
    adult_life_description = db.Column(db.Text, nullable=True)
    late_life_description = db.Column(db.Text, nullable=True)
    avatar_img = db.Column(db.String(255), nullable=True)
    images = db.Column(JSON, nullable=True)
    @property
    def children(self):
        children_set = set(self.children_from_mother + self.children_from_father)
        return list(children_set)
    @property
    def siblings(self):
        direct_siblings_set = set()
        mother_siblings_set = set()
        father_siblings_set = set()

        #Find overlapping mother_id and father_id and add to a set to find direct siblings
        if self.mother and self.father:
            direct_siblings_data = set(self.mother.children_from_mother) & set(self.father.children_from_father)
            for sibling in direct_siblings_data:
                if self.id != sibling.id:
                    direct_siblings_set.add(sibling)
        
        #Check for mother then iterate over the children of the mother adding children to 
        # the mother's side siblings set excluding any direct siblings
        if self.mother:
            for sibling in self.mother.children_from_mother:
                if self.id != sibling.id and sibling not in direct_siblings_set:
                    mother_siblings_set.add(sibling)

        #Check for father then iterate over the children of the father adding children to 
        # the father's side siblings set excluding any direct siblings
        if self.father:
            for sibling in self.father.children_from_father:
                if self.id != sibling.id and sibling not in direct_siblings_set:
                    father_siblings_set.add(sibling)
        return {
            'direct_siblings': list(direct_siblings_set),
            'mothers_side_siblings': list(mother_siblings_set),
            'fathers_side_siblings': list(father_siblings_set)
        }



class Family(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
