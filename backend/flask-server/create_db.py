from app import app, db
from app.models import Person
import json
from datetime import datetime



def create_dummy_data():
  try:
      l = len(Person.query.all())
      if l > 0:
          print("Already seeded")
          return
  except AttributeError:
    pass

  with open('rockerfeller.json') as f:
    json_data = json.load(f)
  for person_data in json_data:
    dob = datetime.strptime(person_data['dob'], "%Y-%m-%d")
    person = Person(
      id=person_data['id'],
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
    db.session.add(person)
  db.session.commit()

  #Example of adding a spouse:
  person1 = db.session.get(Person, 1)
  person2 = db.session.get(Person, 2)
  person1.spouses.append(person2)
  person2.spouses.append(person1)

  db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        try:
          create_dummy_data()
          print("Dummy data added successfully!")
        except Exception as e:
           print("Dummy data failed!")
           print("Error:", e)