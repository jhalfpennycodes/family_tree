from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from app.models import Person
from app import db, api, app
from sqlalchemy.orm import joinedload
from datetime import datetime
from dateutil.parser import isoparse
import os
import re

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

        #Parse string date to iso format
        dob = isoparse(person_data['dob'])

        #Store image upload on server and then create string path to upload to database
        avatar_image_data = person_data['avatar_img']
        person_highest_id = Person.query.order_by(Person.id.desc()).first()
        highest_id = person_highest_id.id

        #Extract the header from the image data
        match = re.match(r"data:image/(?P<ext>[^;]+);base64,(?P<data>.+)", avatar_image_data)
        if not match:
            raise ValueError("Invalid image data URI format")

        #Extract the image file type
        ext = match.group("ext")

        #Extract the image base64 data
        base64_data = match.group("data")

        #Extract the file path and append the file type to the path
        avatar_image_file_path = f"{os.path.abspath(os.getcwd())}/app/static/uploads/avatar_img_profile_{highest_id+1}.{ext}"
        with open(avatar_image_file_path, "w") as f:
            f.write(avatar_image_data)

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
            avatar_img = avatar_image_file_path,
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
        
        if person_data['children'] != None:
            if not isinstance(person_data['children'], list):
                return "Please provide children in list format"
            else:
                try:
                    children = Person.query.filter(Person.id.in_(person_data['children'])).all()
                    for child in children:
                        if new_person.gender == 'Male':
                            if not child.father_id:
                                child.father_id = new_person.id
                            else:
                                return f"{child.first_name} {child.last_name} already has a father"
                        elif new_person.gender == 'Female':
                            if not child.mother_id:
                                child.mother_id = new_person.id
                            else:
                                return f"{child.first_name} {child.last_name} already has a mother"
                        else:
                            return "Please select gender at birth"
                except:
                    return "The children ID you have provided cannot be found", 400

        db.session.commit()

        return 200

#Converts data into correct fromat for avatar nodes and computes the edges between each person
class Tree3Resource(Resource):
    def get(self, family_id):
        family = Person.query.options(
            joinedload(Person.mother),
            joinedload(Person.father),
        ).filter_by(family_id=family_id).all()
        nodes = []
        edges = []
        parent_store = []
        child_store = []
        pattern = r'https?://\S+|www\.\S+'
        for person in family:
            if not person.avatar_img:
                avatar_img = None
            elif re.findall(pattern, person.avatar_img):
                re.findall(pattern, person.avatar_img)
                avatar_img = person.avatar_img
                print("URL here")
            else:
                avatar_image_file_path = person.avatar_img
                f = open(avatar_image_file_path)
                avatar_img = f.read()
                print(avatar_img)
                
            nodes.append({
                'id': person.id,
                'type': 'avatar',
                'data': {
                    'id': person.id,
                    'avatar_img': avatar_img,
                    'first_name': person.first_name,
                    'last_name': person.last_name,
                    'gender': person.gender,
                    'dob': person.dob.strftime('%m/%d/%Y'),
                    'mother': f'{person.mother.first_name} {person.mother.last_name}' if person.mother else None,
                'father': f'{person.father.first_name} {person.father.last_name}' if person.father else None,
                    'profession': person.profession
                    } 
            })
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
            if not person.mother and not person.father:
                parent_store.append(person.id)
            if not person.children:
                child_store.append(person.id)

        #Retrieve highest ID to ensure no current 'avatarNodes' clash with the creation of new 'addNode'
        person_highest_id = Person.query.order_by(Person.id.desc()).first()
        highest_id = person_highest_id.id

        # Create "add" nodes for avatar nodes with no parents
        for index in range(len(parent_store)):
            nodes.append({
                'id': highest_id+1,
                'type': 'add',
                'data': {
                    'id': highest_id +1,
                    'child_id': parent_store[index]
                }
            })
            edges.append({
                'id': f'{highest_id+1}->{parent_store[index]}',
                'source': highest_id+1,
                'target': parent_store[index]
            })
            highest_id = highest_id+1

        # Create "add" nodes for avatar nodes with no children
        for index in range(len(child_store)):
            nodes.append({
                'id': highest_id+1,
                'type': 'add',
                'data': {
                    'id': highest_id +1,
                    'parent_id': child_store[index]
                }
            })
            edges.append({
                'id': f'{child_store[index]}->{highest_id+1}',
                'source': child_store[index],
                'target': highest_id+1
            })
            highest_id = highest_id+1

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

        pattern = r'https?://\S+|www\.\S+'
        if not person.avatar_img:
            avatar_img = None
        elif re.findall(pattern, person.avatar_img):
            re.findall(pattern, person.avatar_img)
            avatar_img = person.avatar_img
            print("URL here")
        else:
            avatar_image_file_path = person.avatar_img
            f = open(avatar_image_file_path)
            avatar_img = f.read()
            print(avatar_img)

        result.append({
            'id': person.id,
            'first_name': person.first_name,
            'last_name': person.last_name,
            'gender': person.gender,
            'dob': dob,
            'mother': {
                    'id': person.mother.id,
                    'first_name': person.mother.first_name,
                    'last_name': person.mother.last_name,
                    'avatar_img': person.mother.avatar_img,
                }if person.mother else {'id': None},
            'father': {
                    'id': person.father.id,
                    'first_name': person.father.first_name,
                    'last_name': person.father.last_name,
                    'avatar_img': person.father.avatar_img,
                } if person.father else {'id': None},
            'spouses': [
                {
                    'id': partner.id,
                    'first_name': partner.first_name,
                    'last_name': partner.last_name,
                    'avatar_img': partner.avatar_img,
                } for partner in person.partners
            ],
            'children': [
                {
                    'id': child.id,
                    'first_name': child.first_name,
                    'last_name': child.last_name,
                    'avatar_img': child.avatar_img,
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
            'avatar_img': avatar_img
            }
        )
        return result
    
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
