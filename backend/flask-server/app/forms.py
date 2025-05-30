from flask_wtf import FlaskForm
from wtforms import StringField, DateField, SelectField, TextAreaField, FieldList, FormField, BooleanField
from wtforms_alchemy import QuerySelectMultipleField
from wtforms.validators import DataRequired

class PersonForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    gender = SelectField('Gender', choices=[(1, 'Male'), (0, 'Female')], coerce=int, validators=[DataRequired()])
    mother_id = SelectField('Mother')
    father_id = SelectField('Father')

class AddParentForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    mother_id = SelectField('Mother')
    father_id = SelectField('Father')


class AddChildForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    gender = SelectField('Gender', choices=[(1, 'Male'), (0, 'Female')], coerce=int, validators=[DataRequired()])
    mother_id = SelectField('Mother')
    father_id = SelectField('Father')