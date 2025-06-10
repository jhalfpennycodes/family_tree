from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from app.models import Person
from app import db, api, app


app = Flask(__name__)
api = Api(app)

class TreeResource(Resource):
    def get(self, family_id):
        family = Person.query.filter_by(family_id=family_id).all()
        nodes = []
        for person in family:
            if person.father_id:
                father = Person.query.get_or_404(person.father_id)
                father_name = father.first_name + father.last_name
            else:
                father_name = "Unknown"
            if person.mother_id:
                mother = Person.query.get_or_404(person.mother_id)
                mother_name = mother.first_name + mother.last_name
            else:
                mother_name = "Unknown"

            nodes.append({
                'id': person.id,
                'type': 'avatar',
                'data': {
                    'avatar_img': person.avatar_img,
                    'first_name': person.first_name,
                    'last_name': person.last_name,
                    'gender': person.gender,
                    'dob': person.dob.isoformat(),
                    'father': father_name,
                    'mother': mother_name,
                    'profession': person.profession
                    } 
            })
        edges = []
        for person in family:
            if person.father_id:
                edges.append({
                    'id': f'{person.father_id}->{person.id}',
                    'source': person.father_id,
                    'target': person.id
                })
            if person.mother_id:
                edges.append({
                    'id': f'{person.mother_id}->{person.id}',
                    'source': person.mother_id,
                    'target': person.id
                })
        tree_data = [{
            'nodes': nodes,
            'edges': edges
        }]
        return tree_data


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
        curr_person = Person.query.get_or_404(person_id)
        people = Person.query.all()
        siblings = []
        children = []
        for person in people:
            if curr_person.id == person.father_id or curr_person.id == person.mother_id:
                children.append({
                    'id': person.id,
                    'first_name': person.first_name,
                    'last_name': person.last_name,
                    'gender': person.gender
                })
            if person.mother_id == None or person.father_id == None or person.id == curr_person.id:
                continue
            if person.mother_id == curr_person.mother_id and person.father_id == curr_person.father_id:
                siblings.append({
                    'id': person.id,
                    'first_name': person.first_name,
                    'last_name': person.last_name,
                    'gender': person.gender
                })
        return {
            'id': curr_person.id, 
            'first_name': curr_person.first_name, 
            'last_name': curr_person.last_name, 
            'gender': curr_person.gender, 
            'mother_id': curr_person.mother_id, 
            'father_id': curr_person.father_id, 
            'children': children,
            'siblings': siblings
        }

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



