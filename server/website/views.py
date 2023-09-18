from flask import Blueprint, render_template, request, flash, jsonify, json, current_app as app
from flask_login import login_required, current_user
from .models import Concepts, Schools, Subjects, Grades, Subsections, Central_contents, Central_requirements 
from . import db

views = Blueprint('views', __name__)

@views.route('/api/sidebar-data', methods=['GET'])
def get_all_data():
    flat_data = flatten_data()  # Updated the function call
    print(f"Sidebar data: {flat_data}")  # Debugging line
    return jsonify(flat_data)


def flatten_data():
    schools = Schools.query.all()
    flat_data = []
    for school in schools:
        flat_data.append(school.serialize())
        print(f"Current school ID: {school.id}")
        subjects = Subjects.query.filter_by(foreign_id_school=school.id).all()
        print(f"Subjects related to school ID {school.id}: {subjects}")
        for subject in subjects:
            flat_data.append(subject.serialize())
            print(f"Current subject ID: {subject.id}")
            grades = Grades.query.filter_by(foreign_id_subject=subject.id).all()
            print(f"Grades related to subject ID {subject.id}: {grades}")
            for grade in grades:
                flat_data.append(grade.serialize())
                print(f"Current grade ID: {grade.id}")
                subsections = Subsections.query.filter_by(foreign_id_grade=grade.id).all()
                print(f"Subsections related to grade ID {grade.id}: {subsections}")
                central_requirements = Central_requirements.query.filter_by(foreign_id_grade=grade.id).all()
                print(f"Central requirements related to grade ID {grade.id}: {central_requirements}")
                for subsection in subsections:
                    flat_data.append(subsection.serialize())
                    print(f"Current subsection ID: {subsection.id}")
                    central_contents = Central_contents.query.filter_by(foreign_id_subsection=subsection.id).all()
                    print(f"Central contents related to subsection ID {subsection.id}: {central_contents}")
                    for central_content in central_contents:
                        flat_data.append(central_content.serialize())
                for central_requirement in central_requirements:
                    flat_data.append(central_requirement.serialize())
    
    print("Flat data:", flat_data)  # Debugging line
    
    return flat_data

def fetch_related_items(table_name, item_id):
    #print(f"Fetching related items for table: {table_name}, ID: {item_id}")  # Debugging line
    children = []
    if table_name == 'Schools':
        related_subjects = Subjects.query.filter_by(foreign_id_school=item_id).all()
        for subject in related_subjects:
            subject_dict = subject.serialize()
            subject_dict['children'] = fetch_related_items('Subjects', subject.id)
            children.append(subject_dict)
    elif table_name == 'Subjects':
        related_grades = Grades.query.filter_by(foreign_id_subject=item_id).all()
        for grade in related_grades:
            grade_dict = grade.serialize()
            grade_dict['children'] = fetch_related_items('Grades', grade.id)
            children.append(grade_dict)
    elif table_name == 'Grades':
        related_subsections = Subsections.query.filter_by(foreign_id_grade=item_id).all()
        related_central_requirements = Central_requirements.query.filter_by(foreign_id_grade=item_id).all()
        for subsection in related_subsections:
            subsection_dict = subsection.serialize()
            subsection_dict['children'] = fetch_related_items('Subsections', subsection.id)
            children.append(subsection_dict)
        for central_requirement in related_central_requirements:
            children.append(central_requirement.serialize())
    elif table_name == 'Subsections':
        related_central_contents = Central_contents.query.filter_by(foreign_id_subsection=item_id).all()
        for central_content in related_central_contents:
            children.append(central_content.serialize())
    return children

@views.route('/api/test-data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@views.route('/api/sidebar-data', methods=['GET'])
def get_sidebar_data():
    #print("Fetching initial sidebar data...")  # Debugging line
    schools = Schools.query.all()
    school_data = []
    for school in schools:
        print(f"Processing school: {school}")  # Debugging line
        school_dict = school.serialize()
        school_dict['children'] = fetch_related_items('Schools', school.id)
        school_data.append(school_dict)
    #print(f"Final sidebar data: {school_data}")  # Debugging line
    #print("JSON Response:", jsonify(school_data).get_json())  # Add this line
    return jsonify(school_data)

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