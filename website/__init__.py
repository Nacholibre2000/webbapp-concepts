from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_login import LoginManager
import os

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'

    # Create engine
    engine = create_engine(f'mysql+mysqlconnector://{os.getenv("DB_USER")}:{os.getenv("DB_PASS")}@{os.getenv("DB_HOST")}/{os.getenv("DB_NAME")}')

    # Configure Flask-SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = engine.url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 10, 'max_overflow': 20}
    
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

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



