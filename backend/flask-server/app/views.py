from app import app, db, api
from app.api import ListAllFamilyMembersResource, FamilyMemberProfileResource, Tree3Resource, SignInResource, SignUpResource, PublicListFamilyResource, PublicTree3Resource, PublicFamilyMemberResource, PostFamilyMemberResource


api.add_resource(SignInResource, '/familyTree/signin')
api.add_resource(SignUpResource, '/familyTree/signup')
api.add_resource(PublicFamilyMemberResource, '/familyTree/publicProfile/<int:person_id>')
api.add_resource(PublicListFamilyResource, '/familyTree/publicFamily/<int:family_id>')
api.add_resource(PublicTree3Resource, '/familyTree/tree/getPublicTree/<int:family_id>')
api.add_resource(ListAllFamilyMembersResource, '/familyTree/listFamily')
api.add_resource(FamilyMemberProfileResource, '/familyTree/profile/<int:person_id>')
api.add_resource(PostFamilyMemberResource, '/familyTree/profileAdd')
api.add_resource(Tree3Resource, "/familyTree/tree/getTree")
