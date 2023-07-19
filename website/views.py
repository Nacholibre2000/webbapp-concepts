from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user
from .models import Concepts
from . import db

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
  if request.method == 'POST':
    concept = request.form.get('concept')

    if len(concept) < 1:
      flash('Concept is too short!', category='error')
    else:
      new_concept = Concepts(concept=concept, user_id=current_user.id)
      db.session.add(new_concept)
      db.session.commit()
      flash('Concept added!', category='success')
      
  return render_template("home.html", user=current_user)