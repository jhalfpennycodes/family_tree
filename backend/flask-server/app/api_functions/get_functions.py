from app.models import Person,User
from sqlalchemy.orm import joinedload
import re

def get_list_family(family_id):
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

def get_public_tree(family_id):
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
        else:
            avatar_image_file_path = person.avatar_img
            f = open(avatar_image_file_path)
            avatar_img = f.read()
            
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

    tree_data = [{
        'nodes': nodes,
        'edges': edges
    }]
    return tree_data

def get_tree(family_id):
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
        else:
            avatar_image_file_path = person.avatar_img
            f = open(avatar_image_file_path)
            avatar_img = f.read()
            
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
    if family_id > 10:
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

def get_family_member(person_id):
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
    else:
        avatar_image_file_path = person.avatar_img
        f = open(avatar_image_file_path)
        avatar_img = f.read()

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
        'life_description': [
            {
                'early_life': person.early_life_description,
                'young_adult': person.young_adult_description,
                'adult_life': person.adult_life_description,
                'late_life': person.late_life_description
            }
        ],
        'avatar_img': avatar_img
        }

    )
    return result
