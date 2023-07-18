from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from os import path
import os

db = SQLAlchemy()

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

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import Users, Concepts

    create_database(app)

    return app

def create_database(app):
    with app.app_context():
        db.create_all()
        print('Created Database!')



