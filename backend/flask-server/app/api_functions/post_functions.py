"""
Business logic for creating family members.
Handles validation, relationship linking, and data processing.
"""

import os
import re
import base64
from datetime import datetime
from dateutil.parser import isoparse
from app.models import Person
from app import db


def error_response(error_type, message, status_code=400):
    """Standardized error response format."""
    return {"error": error_type, "message": message}, status_code


def validate_required_fields(person_data):
    """Validate that all required fields are present."""
    required_fields = ['first_name', 'last_name', 'gender', 'dob']
    
    if not all(field in person_data for field in required_fields):
        return error_response(
            "missing_fields",
            "Please provide all required fields: first_name, last_name, gender, dob"
        )
    return None


def validate_person_data(person_data):
    """Validate and sanitize input data."""
    errors = []
    
    # Validate names
    if not person_data['first_name'] or len(person_data['first_name']) > 50:
        errors.append("First name must be 1-50 characters")
    
    if not person_data['last_name'] or len(person_data['last_name']) > 50:
        errors.append("Last name must be 1-50 characters")
    
    # Validate gender
    valid_genders = ['Male', 'Female', 'Non-binary', 'Other']
    if person_data['gender'] not in valid_genders:
        errors.append(f"Gender must be one of: {', '.join(valid_genders)}")
    
    # Validate date
    try:
        dob = isoparse(person_data['dob'])
        if dob > datetime.now():
            errors.append("Date of birth cannot be in the future")
    except Exception:
        errors.append("Invalid date format. Use ISO 8601 format (e.g., '1990-01-15T00:00:00')")
    
    if errors:
        return error_response("validation_error", "; ".join(errors))
    
    return None


def check_duplicate_name(person_data, family_id):
    """Check if a person with the same name already exists in the family."""
    family = Person.query.filter_by(family_id=family_id).all()
    
    first_name_normalized = person_data['first_name'].strip().lower()
    last_name_normalized = person_data['last_name'].strip().lower()
    
    for person in family:
        if (person.first_name.strip().lower() == first_name_normalized and 
            person.last_name.strip().lower() == last_name_normalized):
            return error_response(
                "duplicate_name",
                f"A person named {person_data['first_name']} {person_data['last_name']} already exists in this family"
            )
    
    return None


def set_optional_fields(person_data):
    """Set optional fields to None if not provided."""
    optional_keys = [
        "mother_id", "father_id", "spouses", "children",
        "birth_location", "profession", 
        "early_life_description", "young_adult_description",
        "adult_life_description", "late_life_description",
        "avatar_img", "images"
    ]
    
    for key in optional_keys:
        if key not in person_data:
            person_data[key] = None


def process_avatar_image(avatar_image_data):
    """
    Process and save avatar image from base64 data URI.
    
    Args:
        avatar_image_data: Base64 data URI string
        
    Returns:
        str: File path to saved image, or None on error
    """
    if not avatar_image_data:
        return None
    
    try:
        # Validate and parse data URI
        match = re.match(r"data:image/(?P<ext>[^;]+);base64,(?P<data>.+)", avatar_image_data)
        if not match:
            raise ValueError("Invalid image data URI format")
        
        ext = match.group("ext")
        base64_data = match.group("data")
        
        # Get next available ID
        person_highest_id = Person.query.order_by(Person.id.desc()).first()
        highest_id = person_highest_id.id if person_highest_id else 0
        
        # Generate file path
        filename = f"avatar_img_profile_{highest_id + 1}.{ext}"
        avatar_image_file_path = os.path.join(
            os.path.abspath(os.getcwd()),
            "app", "static", "uploads",
            filename
        )
        
        # Decode and write binary data
        with open(avatar_image_file_path, "wb") as f:
            f.write(base64.b64decode(base64_data))
        
        # TODO: Implement S3 upload
        # s3_upload(avatar_image_file_path, filename)
        
        return avatar_image_file_path
        
    except Exception as e:
        raise Exception(f"Failed to process avatar image: {str(e)}")


def link_spouses(new_person, spouse_ids, family_id):
    """
    Link spouse relationships bidirectionally.
    
    Args:
        new_person: The newly created Person object
        spouse_ids: List of spouse IDs to link
        family_id: Family ID for validation
        
    Returns:
        Error response tuple or None on success
    """
    if not spouse_ids:
        return None
    
    if not isinstance(spouse_ids, list):
        return error_response("invalid_format", "Please provide spouses in list format")
    
    try:
        # Fetch spouses with family validation
        spouses = Person.query.filter(
            Person.id.in_(spouse_ids),
            Person.family_id == family_id
        ).all()
        
        if len(spouses) != len(spouse_ids):
            return error_response(
                "spouse_not_found",
                "One or more spouses could not be found in your family tree"
            )
        
        # Create bidirectional relationships
        for spouse in spouses:
            new_person.spouses.append(spouse)
            spouse.spouses.append(new_person)
        
        return None
        
    except Exception as e:
        return error_response("spouse_link_failed", str(e))


def link_children(new_person, child_ids, family_id):
    """
    Link children to new person as parent.
    
    Args:
        new_person: The newly created Person object
        child_ids: List of child IDs to link
        family_id: Family ID for validation
        
    Returns:
        Error response tuple or None on success
    """
    if not child_ids:
        return None
    
    if not isinstance(child_ids, list):
        return error_response("invalid_format", "Please provide children in list format")
    
    if new_person.gender not in ['Male', 'Female']:
        return error_response(
            "invalid_gender",
            "Gender must be 'Male' or 'Female' to link as parent"
        )
    
    try:
        # Fetch children with family validation
        children = Person.query.filter(
            Person.id.in_(child_ids),
            Person.family_id == family_id
        ).all()
        
        if len(children) != len(child_ids):
            return error_response(
                "child_not_found",
                "One or more children could not be found in your family tree"
            )
        
        # Assign parent based on gender
        for child in children:
            if new_person.gender == 'Male':
                if child.father_id:
                    return error_response(
                        "parent_exists",
                        f"{child.first_name} {child.last_name} already has a father"
                    )
                child.father_id = new_person.id
            else:  # Female
                if child.mother_id:
                    return error_response(
                        "parent_exists",
                        f"{child.first_name} {child.last_name} already has a mother"
                    )
                child.mother_id = new_person.id
        
        return None
        
    except Exception as e:
        return error_response("child_link_failed", str(e))


def create_person(person_data, family_id):
    """
    Create a new Person object from validated data.
    
    Args:
        person_data: Dictionary containing person information
        family_id: Family ID to assign to the person
        
    Returns:
        Person: New Person object (not yet committed to database)
    """
    dob = isoparse(person_data['dob'])
    
    new_person = Person(
        family_id=family_id,
        first_name=person_data['first_name'],
        last_name=person_data['last_name'],
        gender=person_data['gender'],
        dob=dob,
        mother_id=person_data['mother_id'],
        father_id=person_data['father_id'],
        birth_location=person_data['birth_location'],
        profession=person_data['profession'],
        early_life_description=person_data['early_life_description'],
        young_adult_description=person_data['young_adult_description'],
        adult_life_description=person_data['adult_life_description'],
        late_life_description=person_data['late_life_description'],
        avatar_img=person_data['avatar_img'],
        images=person_data['images']
    )
    
    return new_person