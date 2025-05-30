from flask import render_template, request, redirect, url_for
from .forms import PersonForm, AddParentForm, AddChildForm

from app import app, db, api
from app.models import Person
from app.api import PersonListResource, PersonResource


api.add_resource(PersonListResource, '/api/people')
api.add_resource(PersonResource, '/api/people/<int:person_id>')


@app.route('/')
def index():
    return render_template('tree.html')


@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/tree', methods=['GET'] )
def tree():
    return render_template('tree.html')


@app.route('/people', methods=["GET"])
def list_people():
    people = Person.query.all()
    return render_template('people.html', people=people, model=Person)


@app.route('/add_person', methods=['GET', 'POST'])
def add_person():
    form = PersonForm()

    mother_choices = [(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=0).all()]
    father_choices = [(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=1).all()]
    mother_choices.insert(0, (None, 'Unknown'))
    father_choices.insert(0, (None, 'Unknown'))
    form.mother_id.choices = mother_choices
    form.father_id.choices = father_choices
    
    if form.validate_on_submit():
        # Create a new person instance with form data
        person = Person(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            gender=form.gender.data,
            mother_id=form.mother_id.data,
            father_id=form.father_id.data
        )
        
        db.session.add(person)
        db.session.commit()

        return redirect(url_for('list_people'))
    
    return render_template('add_person.html', form=form)


@app.route('/add_mother/<id>', methods=['GET', 'POST'])
def add_mother(id):
    child = Person.query.get(id)
    form = AddParentForm()

    mother_choices = [(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=0).all()]
    father_choices = [(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=1).all()]
    mother_choices.insert(0, (None, 'Unknown'))
    father_choices.insert(0, (None, 'Unknown'))
    form.mother_id.choices = mother_choices
    form.father_id.choices = father_choices

    print("View hit")

    if form.validate_on_submit():
        parent = Person(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            gender=0,
            mother_id=form.mother_id.data,
            father_id=form.father_id.data
        )
        db.session.add(parent)
        db.session.commit()
        child.mother_id = parent.id
        db.session.commit()
        return redirect(url_for('list_people'))
    else:
        print(form.errors)    
    return render_template('add_mother.html', form=form, child=child)


@app.route('/add_father/<id>', methods=['GET', 'POST'])
def add_father(id):
    child = Person.query.get(id)
    form = AddParentForm()

    mother_choices = [(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=0).all()]
    father_choices = [(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=1).all()]
    mother_choices.insert(0, (None, 'Unknown'))
    father_choices.insert(0, (None, 'Unknown'))
    form.mother_id.choices = mother_choices
    form.father_id.choices = father_choices

    if form.validate_on_submit():
        parent = Person(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            gender=1,
            mother_id=form.mother_id.data,
            father_id=form.father_id.data
        )
        db.session.add(parent)
        db.session.commit()
        child.father_id = parent.id
        db.session.commit()
        return redirect(url_for('list_people'))
    return render_template('add_father.html', form=form, child=child)


@app.route('/add_child/<id>', methods=['GET', 'POST'])
def add_child(id):
    curr_person = Person.query.get(id)
    form = AddChildForm()

    mother_choices = []
    father_choices = []

    # If current person is male
    if curr_person.gender == 1:
        father_choices = [f"{curr_person.first_name} {curr_person.last_name}"]
        mother_choices.append((None, 'Unknown'))
        mother_choices.extend([(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=0).all()])

    # If current person is female
    elif curr_person.gender == 0:
        mother_choices = [f"{curr_person.first_name} {curr_person.last_name}"]
        father_choices.append((None, 'Unknown'))
        father_choices.extend([(person.id, f"{person.first_name} {person.last_name}") for person in Person.query.filter_by(gender=1).all()])

    form.mother_id.choices = mother_choices
    form.father_id.choices = father_choices

    if form.validate_on_submit():
        child = Person(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            gender=form.gender.data,
            mother_id=form.mother_id.data,
            father_id=form.father_id.data
        )
        db.session.add(child)
        db.session.commit()
        return redirect(url_for('list_people'))
    return render_template('add_child.html', form=form, curr_person=curr_person)

@app.route('/test')
def test():
    return {"members": ["Member1", "Member2 ", "Member3"] }