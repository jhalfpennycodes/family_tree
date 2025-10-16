from app import db, jwt
from flask_restful import Resource
from flask import request, jsonify, abort
from flask_jwt_extended import (jwt_required, create_access_token,
    get_jwt_identity
)
from app.models import Person,User
from dateutil.parser import isoparse
from app.api_functions.get_functions import get_list_family, get_tree, get_public_tree, get_family_member

import os
import re

# Register error handlers using the correct signature
@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return {
        'error': 'token_expired',
        'message': 'The token has expired'
    }, 401

@jwt.invalid_token_loader
def my_invalid_token_callback(error_string):
    return {
        'error': 'invalid_token',
        'message': error_string
    }, 401

@jwt.unauthorized_loader
def my_unauthorized_callback(error_string):
    return {
        'error': 'authorization_required',
        'message': error_string
    }, 401

# HELPER FUNCTIONS
def check_family_id(family_id):
    user = User.query.filter_by(email=get_jwt_identity()).first()
    if user.family_id != family_id:
        return False
    return True


# PUBLIC RESOURCES
class PublicListFamilyResource(Resource):
    def get(self, family_id):
        if family_id < 10:
            return get_list_family(family_id), 200
        else:
            return 401
        
class PublicTree3Resource(Resource):
    def get(self, family_id):
        if family_id < 10:
            return get_public_tree(family_id=family_id)
        else:
            return 401

class PublicFamilyMemberResource(Resource):
    def get(self, person_id):
        person = Person.query.filter_by(id=person_id).first()
        if person.family_id > 10:
            return 401
        return get_family_member(person_id=person_id)



# AUTHORIZATION RESOURCES
#Lists all the family members with a particular family ID
class ListAllFamilyMembersResource(Resource):
    @jwt_required()
    def get(self):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        print(get_list_family(family_id=user.family_id))
        return get_list_family(family_id=user.family_id)

#Converts data into correct fromat for avatar nodes and computes the edges between each person
class Tree3Resource(Resource):
    @jwt_required()
    def get(self):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        return get_tree(family_id=user.family_id)
    
class FamilyMemberProfileResource(Resource):
    @jwt_required()
    def get(self, person_id):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        person = Person.query.filter_by(id=person_id).first()
        if not person or not user:
            abort(401)
        if not user.family_id == person.family_id:
            abort(401)
        return get_family_member(person_id=person_id)
    
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
            return f'Person {person.id} ({person.first_name} {person.last_name}), deleted successfully', 202
        else:
            return f'Person with ID {person_id} does not exist'

class PostFamilyMemberResource(Resource):
    @jwt_required()
    def post(self):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        family_id = user.family_id
        print(user)
        print(user.family_id)
        person_data = request.get_json()
        if not person_data:
            return {'Invalid or missing JSON'}, 400
        required_fields = ['first_name', 'last_name', 'gender', 'dob']
        if not all(field in person_data for field in required_fields):
            return 'Please provide all data (first name, last name, gender, date of birth)', 400

        family = Person.query.filter_by(family_id=family_id).all()

        #Check for duplicate names in family
        for person in family:
            if person_data['first_name'] == person.first_name and person_data['last_name'] == person.last_name:
                return f'A person those names already exists in this family', 400
        
        optional_keys = ["mother_id", "father_id", "spouses", "birth_location", "profession", "early_life_description", "young_adult_description", "adult_life_description", "late_life_description", "avatar_img", "images"]
        for key in optional_keys:
            if key not in person_data:
                person_data[key] = None

        #Parse string date to iso format
        dob = isoparse(person_data['dob'])
        if person_data['avatar_img']:
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
        else:
            avatar_image_file_path = None
        new_person = Person(
            family_id = family_id,
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
                    return "The spouse you provided cannot be found.", 400
        
        if person_data['children'] != None:
            if not isinstance(person_data['children'], list):
                return "Please provide children in list format", 400
            else:
                try:
                    children = Person.query.filter(Person.id.in_(person_data['children'])).all()
                    for child in children:
                        if new_person.gender == 'Male':
                            if not child.father_id:
                                child.father_id = new_person.id
                            else:
                                return f"{child.first_name} {child.last_name} already has a father", 400
                        elif new_person.gender == 'Female':
                            if not child.mother_id:
                                child.mother_id = new_person.id
                            else:
                                return f"{child.first_name} {child.last_name} already has a mother", 400
                        else:
                            return "Please select gender at birth", 400
                except:
                    return "The child you have provided cannot be found", 400

        db.session.commit()

        return "Success", 201

# AUTHENTICATION RESOURCES
class SignInResource(Resource):
    def post(self):
        data_in = request.get_json()
        email = data_in.get("email")
        password = data_in.get("password")
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return {"msg": "Bad username or password"}, 401
        if not user.verify_password(password):
            return {"msg": "Bad username or password"}, 401

        access_token = create_access_token(identity=email)
        return {"access_token" : access_token}, 200

class SignUpResource(Resource):
    def post(self):
        data_in = request.get_json()
        first_name = data_in.get("first_name")
        last_name = data_in.get("last_name")
        email = data_in.get("email")
        password = data_in.get("password")
        if email is None or password is None:
            return {"message": "Provide all data."}, 400
        if User.query.filter_by(email=email).first() is not None:
            return {"message": "Email already registered."}, 400
        last_user = User.query.order_by(User.id.desc()).first()
        user = User(first_name=first_name, last_name=last_name, email=email, family_id=last_user.family_id+1)
        user.hash_password(password)
        db.session.add(user)
        db.session.commit()
        user = User.query.filter_by(email=email).first()
        if not user:
            return {"msg": "Bad username or password"}, 401
        if not user.verify_password(password):
            return {"msg": "Bad username or password"}, 401

        access_token = create_access_token(identity=email)
        return {"access_token" : access_token}, 200