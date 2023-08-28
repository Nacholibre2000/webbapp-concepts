from flask import Blueprint, render_template, request, flash, jsonify, json, current_app as app
from flask_login import login_required, current_user
from .models import Concepts, Schools, Subjects, Grades, Subsections, Central_contents, Central_requirements 
from . import db

views = Blueprint('views', __name__)

# Fetch initial data (schools)
@views.route('/api/sidebar-data', methods=['GET'])
def get_sidebar_data():
    schools = Schools.query.all()
    return jsonify([school.serialize() for school in schools])

# Fetch related items based on table name and item ID
@views.route('/api/related_items/<string:table_name>/<int:item_id>', methods=['GET'])
def get_related_items(table_name, item_id):
    if table_name == 'Schools':  
        print("Executing query for related subjects with school ID:", item_id)  # Debugging line
        related_subjects = Subjects.query.filter_by(foreign_id_school=item_id).all()
        print("Query results:", related_subjects)  # Debugging line
        related_subjects = Subjects.query.filter_by(foreign_id_school=item_id).all()
        return jsonify([subject.serialize() for subject in related_subjects])
    elif table_name == 'Subjects': 
        print("Executing query for related subjects with subject ID:", item_id)  # Debugging line
        related_grades = Grades.query.filter_by(foreign_id_subject=item_id).all()
        print("Query results:", related_grades)  # Debugging line
        related_grades = Grades.query.filter_by(foreign_id_subject=item_id).all()
        return jsonify([grade.serialize() for grade in related_grades])
    elif table_name == 'Grades':
        related_subsections = Subsections.query.filter_by(foreign_id_grade=item_id).all()
        related_central_requirements = Central_requirements.query.filter_by(foreign_id_grade=item_id).all()  # Changed the foreign key
        combined = {
            'subsections': [subsection.serialize() for subsection in related_subsections],
            'central_requirements': [central_requirement.serialize() for central_requirement in related_central_requirements]
        }
        return jsonify(combined)
    elif table_name == 'Subsections':
        related_central_contents = Central_contents.query.filter_by(foreign_id_subsection=item_id).all()
        return jsonify([central_content.serialize() for central_content in related_central_contents])

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST': 
        concept = request.form.get('concept')#Gets the note from the HTML 

        if len(concept) < 1:
            flash('Concept is too short!', category='error') 
        else:
            new_concept = Concepts(concept=concept, user_id=current_user.id)  #providing the schema for the concept 
            db.session.add(new_concept) #adding the note to the database 
            db.session.commit()
            flash('Concept added!', category='success')

    return render_template("home.html", user=current_user)


@views.route('/delete-concept', methods=['POST'])
def delete_concept():  
    concept = json.loads(request.data) # this function expects a JSON from the INDEX.js file 
    conceptId = concept['conceptId']
    concept = Concepts.query.get(conceptId)
    if concept:
        if concept.user_id == current_user.id:
            db.session.delete(concept)
            db.session.commit()

    return jsonify({})