from flask import Flask, request
from flask_restful import Resource, Api
from app.models import Person
from app import db, api, app


# app = Flask(__name__)
# api = Api(app)

class PersonListResource(Resource):
    def get(self):
        people = Person.query.all()
        return [{'id': person.id, 'first_name': person.first_name, 
            'last_name': person.last_name, 'gender': person.gender, 'mother_id': 
            person.mother_id, 'father_id': person.father_id} for person in people]

    def post(self):
        data = request.get_json()
        person = Person(
            first_name=data['first_name'],
            last_name=data['last_name'],
            gender=data['gender'],
            mother_id=data.get('mother_id'),
            father_id=data.get('father_id')
        )
        db.session.add(person)
        db.session.commit()
        return {'id': person.id, 'first_name': person.first_name, 
'last_name': person.last_name, 'gender': person.gender, 'mother_id': 
person.mother_id, 'father_id': person.father_id}, 201


class PersonResource(Resource):
    def get(self, person_id):
        person = Person.query.get_or_404(person_id)
        return {'id': person.id, 'first_name': person.first_name, 
'last_name': person.last_name, 'gender': person.gender, 'mother_id': 
person.mother_id, 'father_id': person.father_id}

    def delete(self, person_id):
        person = Person.query.get_or_404(person_id)
        db.session.delete(person)
        db.session.commit()
        return '', 204

    def put(self, person_id):
        person = Person.query.get_or_404(person_id)
        data = request.get_json()

        if 'first_name' in data:
            person.first_name = data['first_name']
        if 'last_name' in data:
            person.last_name = data['last_name']
        if 'gender' in data:
            person.gender = data['gender']
        if 'mother_id' in data:
            person.mother_id = data['mother_id']
        if 'father_id' in data:
            person.father_id = data['father_id']

        db.session.commit()

        return {
            'id': person.id,
            'first_name': person.first_name,
            'last_name': person.last_name,
            'gender': person.gender,
            'mother_id': person.mother_id,
            'father_id': person.father_id
        }



