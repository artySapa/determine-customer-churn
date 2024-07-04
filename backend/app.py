import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from models import db, bcrypt, Users
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx'}

# Ensure the UPLOAD_FOLDER directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://artyom:19991999a@localhost/customer_ick'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
bcrypt.init_app(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_file(filepath):
    df = pd.read_excel(filepath)
    average_age = df['age'].mean()
    gender_distribution = df['gender'].value_counts().to_dict()

    analysis_result = {
        'average_age': average_age,
        'gender_distribution': gender_distribution
    }

    return analysis_result

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        analysis_result = analyze_file(filepath)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename,
            'analysis': analysis_result
        })
    else:
        return jsonify({'error': 'File type not allowed'})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'error': 'Please provide username, email, and password'}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = Users(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = Users.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Login successful'})
    return jsonify({'error': 'Invalid email or password'}), 401


if __name__ == '__main__':
    app.run(debug=True)
