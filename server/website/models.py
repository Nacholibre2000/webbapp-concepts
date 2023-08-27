from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    user_concepts = db.relationship('Concepts')

class Concepts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    concept = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Schools(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    school = db.Column(db.String(40))

    def __repr__(self):
        return f'<School {self.name}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'school': self.school
        }

class Subjects(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(60))
    foreign_id_school = (db.Integer)

    def __repr__(self):
        return f'<Subject {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'foreign_id_school': self.foreign_id_school
        }

class Grades(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    grade = db.Column(db.String(120))
    foreign_id_subject = (db.Integer)

    def __repr__(self):
        return f'<Grade {self.name}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'grade': self.grade,
            'foreign_id_subject': self.foreign_id_subject
        }

class Subsections(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subsection = db.Column(db.String(120))
    foreign_id_grade = (db.Integer)

    def __repr__(self):
        return f'<Subsection {self.name}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'subsection': self.subsection,
            'foreign_id_grade': self.foreign_id_grade
        }

class Central_contents(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    central_content = db.Column(db.String(450))
    foreign_id_subsection = (db.Integer)

    def __repr__(self):
        return f'<Central_content {self.name}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'central_content': self.central_content,
            'foreign_id_subsection': self.foreign_id_subsection
        }

class Central_requirements(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    central_requirement = db.Column(db.String(450))
    foreign_id_grade = (db.Integer)

    def __repr__(self):
        return f'<Central_requirement {self.name}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'central_requirement': self.central_requirement,
            'foreign_id_grade': self.foreign_id_grade
        }

