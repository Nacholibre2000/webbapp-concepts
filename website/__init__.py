import os
from flask import Flask, render_template

def create_app():
  app = Flask(__name__)
  app.config['SECRET KEY'] = os.getenv("SECRET_KEY")

  from .views import views
  from .auth import auth

  app.register_blueprint(views, url_prefix='/')
  app.register_blueprint(auth, url_prefix='/')

  return app

# CONCEPTS = [
#   {
#     'id': 1,
#     'concept': 'Utbud',
#     'explanation':
#     'Är den samlade mängd varor och tjänster som säljare bjuder ut till försäljning vid ett visst pris',
#     'course_requirement': 1,
#   },
#   {
#     'id': 2,
#     'concept': 'Efterfrågan',
#     'explanation':
#     'Är den samlade mängd varor och tjänster som köpare vill köpa vid ett visst pris',
#     'course_requirement': 4,
#   },
# ]



