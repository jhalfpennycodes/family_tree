from app import app, db
from app.models import Person

# Delete all objects
def delete_all():
    try:
        db.session.query(Person).delete()
        db.session.commit()
        print("All Persons deleted successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting person: {str(e)}")

if __name__ == "__main__":
    with app.app_context():
        delete_all()

