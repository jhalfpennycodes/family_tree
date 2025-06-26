from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from app.models import Person
from app import db, api, app
from sqlalchemy.orm import joinedload
from datetime import datetime
from dateutil.parser import isoparse

app = Flask(__name__)
api = Api(app)

#Lists all the family members with a particular family ID
class ListAllFamilyMembersResource(Resource):
    def get(self, family_id):
        family = Person.query.options(
            joinedload(Person.mother),
            joinedload(Person.father),
            joinedload(Person.children_from_mother),
            joinedload(Person.children_from_father)
        ).filter_by(family_id=family_id).all()
        
        result = []
        for person in family:
            children = (person.children_from_mother or []) + (person.children_from_father or [])
            children_data = [{
                'id': child.id,
                'first_name': child.first_name,
                'last_name': child.last_name,
                'gender': child.gender
            } for child in children]

            result.append({
                'id': person.id,
                'first_name': person.first_name,
                'last_name': person.last_name,
                'gender': person.gender,
                'dob':  person.dob.strftime('%m/%d/%Y'),
                'mother': f'{person.mother.first_name} {person.mother.last_name}' if person.mother else None,
                'father': f'{person.father.first_name} {person.father.last_name}' if person.father else None,
                'children': children_data,
                'profession': person.profession,
                'avatar_img': person.avatar_img,
            })

        return result
    
    def post(self, family_id):
        person_data = request.get_json()
        if not person_data:
            return jsonify({'error': 'Invalid or missing JSON'}), 400
        required_fields = ['first_name', 'last_name', 'gender', 'dob']
        if not all(field in person_data for field in required_fields):
            return 'Please provide all data (first name, last name, gender, date of birth)', 400

        family = Person.query.filter_by(family_id=family_id).all()

        #Check for duplicate names in family
        for person in family:
            if person_data['first_name'] == person.first_name and person_data['last_name'] == person.last_name:
                return f'A person with the name {person.first_name} {person.last_name} already exists in this family', 400
        
        optional_keys = ["mother_id", "father_id", "spouses", "birth_location", "profession", "early_life_description", "young_adult_description", "adult_life_description", "late_life_description", "avatar_img", "images"]
        for key in optional_keys:
            if key not in person_data:
                person_data[key] = None
        dob = isoparse(person_data['dob'])
        new_person = Person(
            family_id= family_id,
            first_name = person_data['first_name'],
            last_name = person_data['last_name'],
            gender = person_data['gender'],
            dob = dob,
            mother_id = person_data['mother_id'],
            father_id = person_data['father_id'],
            birth_location = person_data['birth_location'],
            profession = person_data['profession'],
            early_life_description = person_data['early_life_description'],
            young_adult_description = person_data['young_adult_description'],
            adult_life_description = person_data['adult_life_description'],
            late_life_description = person_data['late_life_description'],
            avatar_img = person_data['avatar_img'],
            images = person_data['images']
        )
        db.session.add(new_person)

        #Spouse data must be sent as an array of ids
        if person_data['spouses'] != None:
            if not isinstance(person_data['spouses'], list):
                return "Please provide spouses in list format"
            else:
                try:
                    spouses = Person.query.filter(Person.id.in_(person_data['spouses'])).all()
                    for spouse in spouses:
                        new_person.spouses.append(spouse)
                        spouse.spouses.append(new_person)
                except:
                    return "The spouse ID you provided cannot be found.", 400

        db.session.commit()

        return 200

#Converts data into correct fromat for avatar nodes and computes the edges between each person
class Tree2Resource(Resource):
    def get(self, family_id):
        family = Person.query.options(
            joinedload(Person.mother),
            joinedload(Person.father),
        ).filter_by(family_id=family_id).all()
        nodes = []
        for person in family:
            nodes.append({
                'id': person.id,
                'type': 'avatar',
                'data': {
                    'id': person.id,
                    'avatar_img': person.avatar_img,
                    'first_name': person.first_name,
                    'last_name': person.last_name,
                    'gender': person.gender,
                    'dob': person.dob.strftime('%m/%d/%Y'),
                    'mother': f'{person.mother.first_name} {person.mother.last_name}' if person.mother else None,
                'father': f'{person.father.first_name} {person.father.last_name}' if person.father else None,
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
    
class FamilyMemberProfileResource(Resource):
    def get(self, person_id):
        person = Person.query.options(
            joinedload(Person.mother),
            joinedload(Person.father),
            joinedload(Person.children_from_mother),
            joinedload(Person.children_from_father)
        ).filter_by(id=person_id).first()
        if not person:
            return "Person not found, please try again with a valid ID"
        result = []
        dob = person.dob.strftime("%Y/%m/%d")
        result.append({
            'id': person.id,
            'first_name': person.first_name,
            'last_name': person.last_name,
            'gender': person.gender,
            'dob': dob,
            'mother': f'{person.mother.first_name} {person.mother.last_name}' if person.mother else None,
            'father':f'{person.father.first_name} {person.father.last_name}' if person.father else None,
            'spouses': [
                {
                    'id': partner.id,
                    'first_name': partner.first_name,
                    'last_name': partner.last_name,
                } for partner in person.partners
            ],
            'children': [
                {
                    'id': child.id,
                    'first_name': child.first_name,
                    'last_name': child.last_name,
                } for child in person.children
            ],
            'siblings' : [
                {
                    'direct_siblings': [
                        {
                            'id': sibling.id,
                            'first_name': sibling.first_name,
                            'last_name': sibling.last_name,
                        } for sibling in person.siblings["direct_siblings"]
                    ],
                    'mothers_side_siblings': [
                        {
                            'id': sibling.id,
                            'first_name': sibling.first_name,
                            'last_name': sibling.last_name,
                        } for sibling in person.siblings["mothers_side_siblings"]
                    ],
                    'father_side_siblings':[
                        {
                            'id': sibling.id,
                            'first_name': sibling.first_name,
                            'last_name': sibling.last_name,
                        } for sibling in person.siblings["fathers_side_siblings"]
                    ]
                }
            ],
            'avatar_img': person.avatar_img
            }
        )
        return result
    
    #No option to patch spouses, siblings or children
    def patch(self, person_id):
        try:
            person = Person.query.get(person_id)
            if not person:
                return f'Person with ID {person_id} does not exist', 400
            patch_data = request.get_json()
            if 'spouses' in patch_data or 'siblings' in patch_data:
                return 'You cannot edit spouses, children or siblings for now.', 400
            for key, value in patch_data.items():
                if hasattr(person, key):
                    if key == "dob":
                        value = datetime.strptime(value, "%Y-%m-%d")
                    setattr(person, key, value)
                else:
                    return "You can't edit this attribute!", 400
            db.session.commit()
            return 200
        except:
            return "The request body was incorrect.", 400
    
    def delete(self, person_id):
        person = Person.query.get(person_id)
        if person:
            #If current person is a parent then set their childrens mother or father IDs to null then delete current person
            if person.children_from_mother:
                for child in person.children_from_mother:
                    child.mother_id = None
            if person.children_from_father:
                for child in person.children_from_father:
                    child.father_id = None
            db.session.delete(person)
            db.session.commit()
            return f'Person {person.id} ({person.first_name} {person.last_name}), deleted successfully', 200
        else:
            return f'Person with ID {person_id} does not exist'

class AddFamilyMember(Resource):
    def post(self):
        person_data = request.get_json()
        if not person_data:
            return jsonify({'error': 'Invalid or missing JSON'}), 400
        required_fields = ['first_name', 'last_name', 'gender', 'dob']
        if not all(field in person_data for field in required_fields):
            return 'Please provide all data (first name, last name, gender, date of birth)', 400

        family = Person.query.filter_by(family_id=person_data['family_id']).all()

        #Check for duplicate names in family
        for person in family:
            if person_data['first_name'] == person.first_name and person_data['last_name'] == person.last_name:
                return f'A person with the name {person.first_name} {person.last_name} already exists in this family', 400
        
        dob = datetime.strptime(person_data['dob'], "%Y-%m-%dT%H:%M:%S.%fZ")
        new_person = Person(
            family_id= person_data['family_id'],
            first_name = person_data['first_name'],
            last_name = person_data['last_name'],
            gender = person_data['gender'],
            dob = dob,
            mother_id = person_data['mother_id'],
            father_id = person_data['father_id'],
            birth_location = person_data['birth_location'],
            profession = person_data['profession'],
            early_life_description = person_data['early_life_description'],
            young_adult_description = person_data['young_adult_description'],
            adult_life_description = person_data['adult_life_description'],
            late_life_description = person_data['late_life_description'],
            avatar_img = person_data['avatar_img'],
            images = person_data['images']
        )
        db.session.add(new_person)

        #Spouse data must be sent as an array of ids
        spouses = Person.query.filter(Person.id.in_(person_data['spouses'])).all()
        for spouse in spouses:
            new_person.spouses.append(spouse)
            spouse.spouses.append(new_person)

        db.session.commit()

        return 200

