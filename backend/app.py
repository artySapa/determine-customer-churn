import os
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from models import db, bcrypt, Users
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'csv'}

# Ensure the UPLOAD_FOLDER directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
# cd frontend, npm run dev
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

    # Assuming the last column is the target variable
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    categorical_cols = X.select_dtypes(include = ['object', 'category']).columns

    # Getting rid of unnecessary categorical columns
    max_unique_values = 10
    cols_to_drop = [col for col in categorical_cols if df[col].nunique() > max_unique_values]
    X = X.drop(cols_to_drop, axis = 1)

    # Adjusting the rest categorical columns for our model
    X = pd.get_dummies(X, drop_first = True)

    # In the following, we'll choose the best-performing model
    models = {
        'RandomForest': RandomForestClassifier(),
        #'LogisticRegression': LogisticRegression(),
        #'SVM': SVC(),
        'KNN': KNeighborsClassifier()
    }
    
    best_model = None
    best_score = 0
    
    for name, model in models.items():
        scores = cross_val_score(model, X, y, cv = 5)        
        if scores.mean() > best_score:
            best_score = scores.mean()
            best_model = model
    
    # Splitting data into training and test sets for the following best_model.fit
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 13)
    best_model.fit(X_train, y_train)
    
    y_pred = best_model.predict(X_test)
    analysis_result = classification_report(y_test, y_pred)

    #return analysis_result

    importance = best_model.feature_importances_
    feature_importance = pd.DataFrame({'feature': X.columns, 'importance': importance})
    feature_importance = feature_importance.sort_values(by = 'importance', ascending = False)
    
    ser1 = feature_importance['feature']
    ser1.index = feature_importance['importance'].sort_values(ascending = False)
    return ser1.head().to_dict()


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
