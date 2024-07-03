import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx'}

# Ensure the UPLOAD_FOLDER directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_file(filepath):
    # Load the Excel file into a DataFrame
    df = pd.read_excel(filepath, engine='xlrd')
    
    # Perform analysis
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
        
        # Perform analysis on the uploaded file
        analysis_result = analyze_file(filepath)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename,
            'analysis': analysis_result
        })
    else:
        return jsonify({'error': 'File type not allowed'})

if __name__ == '__main__':
    app.run(debug=True)
