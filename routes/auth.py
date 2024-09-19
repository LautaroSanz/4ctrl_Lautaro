from flask import Blueprint, request, jsonify, render_template, url_for
from flask_login import login_user, logout_user, login_required, current_user
from models.user import User
from utils.db import db
from utils.auth import login_manager

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()  # Obtener datos en formato JSON
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'message': 'Missing username or password'}), 400
        
        username = data.get('username')
        password = data.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            next_page = request.args.get('next') or url_for('products.home')
            return jsonify({'redirect_url': next_page})
        else:
            return jsonify({'message': 'Usuario o Contraseña errónea, Por favor intente nuevamente'}), 400
    
    # Manejo para GET (mostrar el formulario de login)
    return render_template('login.html')


@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Obtener datos en formato JSON
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Missing username or password'}), 400
    
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'message': 'Username already exists'}), 400
    else:
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201


@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
