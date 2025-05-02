from app import app, db
from app.models import Person

def create_dummy_data():
    # Create some dummy data
    persons = [
        {"first_name": "William", "last_name": "Jones", "gender": True},
        {"first_name": "Anna", "last_name": "Jones", "gender": False},
        {"first_name": "Mike", "last_name": "Stone", "gender": True},
        {"first_name": "Karen", "last_name": "Stone", "gender": False, "mother_id": 2, "father_id": 1},
        {"first_name": "Peter", "last_name": "Jones", "gender": True, "mother_id": 2, "father_id": 1},
        {"first_name": "Susan", "last_name": "Jones", "gender": False},
        {"first_name": "Laura", "last_name": "Stone", "gender": False, "mother_id": 4, "father_id": 3},
        {"first_name": "Lisa", "last_name": "Stone", "gender": False, "mother_id": 4, "father_id": 3},
        {"first_name": "Daniel", "last_name": "Stone", "gender": True, "mother_id": 4, "father_id": 3},
        {"first_name": "Adam", "last_name": "Jones", "gender": True, "mother_id": 6, "father_id": 5},
        {"first_name": "Amy", "last_name": "Jones", "gender": False, "mother_id": 6, "father_id": 5}
    ]

    # Add the dummy data to the database
    for person_data in persons:
        person = Person(**person_data)
        db.session.add(person)

    # Commit the changes
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        create_dummy_data()
        print("Dummy data added successfully!")