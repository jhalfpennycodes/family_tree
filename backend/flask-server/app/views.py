# from flask import render_template, request, redirect, url_for
# from .forms import PersonForm, AddParentForm, AddChildForm

from app import app, db, api
from app.api import ListAllFamilyMembersResource, FamilyMemberProfileResource, Tree3Resource, SignInResource, SignUpResource
from flask import Flask, jsonify, request 
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


# Setup the Flask-JWT-Extended extension



# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.



api.add_resource(SignInResource, '/familyTree/signin')
api.add_resource(SignUpResource, '/familyTree/signup')
api.add_resource(ListAllFamilyMembersResource, '/familyTree/family/<int:family_id>')
api.add_resource(FamilyMemberProfileResource, '/familyTree/profile/<int:person_id>')
api.add_resource(Tree3Resource, "/familyTree/tree/getTree/<int:family_id>")