from app import db, jwt
from flask_restful import Resource
from flask import request, jsonify, abort
from flask_jwt_extended import (jwt_required, create_access_token,
    get_jwt_identity
)
from app.models import Person,User
from dateutil.parser import isoparse
from app.api_functions.get_functions import get_list_family, get_tree, get_public_tree, get_family_member
from app.api_functions.post_functions import (
    error_response,
    validate_required_fields,
    validate_person_data,
    check_duplicate_name,
    set_optional_fields,
    process_avatar_image,
    link_spouses,
    link_children,
    create_person
)
import logging
import os
import re

logger = logging.getLogger(__name__)

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

def error_response(error_type, message, status_code=400):
    return {"error": error_type, "message": message}, status_code


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
        if not person or person.family_id > 10:
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
    
    @jwt_required()
    def delete(self, person_id):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        person = Person.query.get(person_id)
        if not person or not user:
            abort(401)
        if not user.family_id == person.family_id:
            abort(401)
        if person:
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
            return f'Person with ID {person_id} does not exist', 404

class PostFamilyMemberResource(Resource):
    @jwt_required()
    def post(self):
        try:
            # Get user and family_id
            user = User.query.filter_by(email=get_jwt_identity()).first()
            if not user:
                return error_response("user_not_found", "User not found", 401)
            
            family_id = user.family_id
            
            # Get request data
            person_data = request.get_json()
            if not person_data:
                return error_response("invalid_json", "Invalid or missing JSON")
            
            # Validate required fields
            error = validate_required_fields(person_data)
            if error:
                return error
            
            # Validate data quality
            error = validate_person_data(person_data)
            if error:
                return error
            
            # Check for duplicates
            error = check_duplicate_name(person_data, family_id)
            if error:
                return error
            
            # Set optional fields
            set_optional_fields(person_data)
            
            # Process avatar image
            try:
                avatar_path = process_avatar_image(person_data['avatar_img'])
                person_data['avatar_img'] = avatar_path
            except Exception as e:
                logger.error(f"Avatar processing failed: {str(e)}")
                return error_response("image_upload_failed", str(e), 500)
            
            # Create person object
            new_person = create_person(person_data, family_id)
            db.session.add(new_person)
            
            # Link relationships
            error = link_spouses(new_person, person_data['spouses'], family_id)
            if error:
                db.session.rollback()
                return error
            
            error = link_children(new_person, person_data['children'], family_id)
            if error:
                db.session.rollback()
                return error
            
            # Commit to database
            db.session.commit()
            
            logger.info(f"User {user.email} created person {new_person.id}")
            
            return {
                "message": "Family member created successfully",
                "person": {
                    "id": new_person.id,
                    "first_name": new_person.first_name,
                    "last_name": new_person.last_name
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to create person: {str(e)}", exc_info=True)
            return error_response("server_error", "Failed to create family member", 500)

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