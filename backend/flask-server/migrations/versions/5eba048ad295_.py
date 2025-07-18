"""empty message

Revision ID: 5eba048ad295
Revises: 
Create Date: 2025-06-11 12:14:37.066576

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5eba048ad295'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('family',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('person',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('family_id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.String(length=50), nullable=False),
    sa.Column('gender', sa.String(length=10), nullable=False),
    sa.Column('dob', sa.DateTime(), nullable=False),
    sa.Column('mother_id', sa.Integer(), nullable=True),
    sa.Column('father_id', sa.Integer(), nullable=True),
    sa.Column('birth_location', sa.String(length=50), nullable=True),
    sa.Column('profession', sa.String(length=50), nullable=True),
    sa.Column('early_life_description', sa.Text(), nullable=True),
    sa.Column('young_adult_description', sa.Text(), nullable=True),
    sa.Column('adult_life_description', sa.Text(), nullable=True),
    sa.Column('late_life_description', sa.Text(), nullable=True),
    sa.Column('avatar_img', sa.String(length=255), nullable=True),
    sa.Column('images', sa.JSON(), nullable=True),
    sa.ForeignKeyConstraint(['family_id'], ['family.id'], ),
    sa.ForeignKeyConstraint(['father_id'], ['person.id'], ),
    sa.ForeignKeyConstraint(['mother_id'], ['person.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('spouse_link',
    sa.Column('person_id', sa.Integer(), nullable=True),
    sa.Column('spouse_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['person_id'], ['person.id'], ),
    sa.ForeignKeyConstraint(['spouse_id'], ['person.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('spouse_link')
    op.drop_table('person')
    op.drop_table('family')
    # ### end Alembic commands ###
