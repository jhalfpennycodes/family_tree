from app import app, db
from app.models import Person, spouse_link, Family

# Delete all objects
def delete_all():
    try:
        db.session.query(Person).delete()
        db.session.query(Family).delete()
        db.session.execute(spouse_link.delete())
        db.session.commit()
        print("All Persons and relations deleted successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting person: {str(e)}")

if __name__ == "__main__":
    with app.app_context():
        delete_all()

