from app import app, db
from app.models import Person, User
import json
from datetime import datetime


def create_dummy_data(family):
  try:
    path = "/Users/jkrip/Desktop/family_tree/backend/flask-server/json_families/"
    with open(path + family) as f:
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
  except Exception as e:
    print(f"Failed to populate with {family} file.")
    print("Error: ", e)


  db.session.commit()

def spousify(person1_id, person2_id):
    person1 = db.session.get(Person, person1_id)
    person2 = db.session.get(Person, person2_id)
    person1.spouses.append(person2)
    person2.spouses.append(person1)

      
def link_rockerfeller_spouses():
  try:
    spousify(1, 2)
  except Exception as e:
    print("Rockerfeller spouses failed")
    print("Error: ", e)


def link_windsor_spouses():
    try:
      # Queen Elizabeth II (16) and Prince Philip (21)
      spousify(16, 21)

      # King George VI (18) and Queen Elizabeth Bowes-Lyon (17)
      spousify(18, 17)

      # King George V (19) and Queen Mary of Teck (20)
      spousify(19, 20)

      # King Charles III (22) and Princess Diana (23)
      spousify(22, 23)

      # (Optional) Uncomment if you later add these people:
      # Prince William (27) and Catherine Middleton (Kate)
      # spousify(27, <CATHERINE_ID>)

      # Prince Harry (28) and Meghan Markle
      # spousify(28, <MEGHAN_ID>)

      # Prince Andrew (25) and Sarah Ferguson
      # spousify(25, <SARAH_ID>)

      # Prince Edward (26) and Sophie Rhys-Jones
      # spousify(26, <SOPHIE_ID>)

      db.session.commit()



    except Exception as e:
      print("Windsor spouses failed")
      print("Error: ", e)

def create_dummy_users():
  try:
    path = "/Users/jkrip/Desktop/family_tree/backend/flask-server/json_families/user_mock.json"
    with open(path) as f:
      json_data = json.load(f)
    for user_data in json_data:
      user = User(
        id = user_data["id"],
        first_name = user_data["first_name"],
        last_name = user_data["last_name"],
        email = user_data["email"],
        password_hash = "$6$rounds=656000$bsyw6Zg8tJKqaWZF$n/fqP0Gppc.SrRbF0HIAyH0D7kBbM5JdUIiuX8owf/6qtcsgo7QQSgwhGRaG4l.j1lbB0XYU52B0riIfxOTK9/",
        family_id = user_data["family_id"]
      )
      db.session.add(user)
    db.session.commit()
  except Exception as e:
    print(f"Failed to populate with user_mock file.")
    print("Error: ", e)

    
      


if __name__ == '__main__':
    with app.app_context():
        try:
          create_dummy_data("rockerfeller.json")
          link_rockerfeller_spouses()
          create_dummy_data("windsor.json")
          link_windsor_spouses()
          create_dummy_data("kardashin.json")
          create_dummy_users()
          print("Dummy data added successfully!")
        except Exception as e:
          print("Dummy data failed!")
          print("Error:", e)