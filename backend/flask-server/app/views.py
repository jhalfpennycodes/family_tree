# from flask import render_template, request, redirect, url_for
# from .forms import PersonForm, AddParentForm, AddChildForm

from app import app, db, api
# from app.models import Person
from app.api import ListAllFamilyMembersResource, FamilyMemberProfileResource, Tree3Resource

api.add_resource(ListAllFamilyMembersResource, '/familyTree/family/<int:family_id>')
api.add_resource(FamilyMemberProfileResource, '/familyTree/profile/<int:person_id>')
api.add_resource(Tree3Resource, "/familyTree/tree/getTree/<int:family_id>")