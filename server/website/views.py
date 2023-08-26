from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Concepts, Subjects
from . import db
import json

views = Blueprint('views', __name__)

@views.route('/api/sidebar-data', methods=['GET'])
def get_sidebar_data():
    # Query the database to get the data
    sidebar_data = db.session.query(Subjects).all()  # Replace YourModel with the actual model class

    # Convert the data to a JSON-serializable format
    json_data = [{"subject": item.subject} for item in sidebar_data]  # Replace 'name' with the actual field you want to use

    return jsonify(json_data)


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