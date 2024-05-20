from flask import Flask, request, render_template, jsonify, send_file, session, current_app
from io import BytesIO
import os
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from flask import send_file
import http.client
import xml.etree.ElementTree as ET

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'

db = SQLAlchemy(app)

favorites = db.Table('favorites',
    db.Column('user_id', db.String(256), db.ForeignKey('users.username')),
    db.Column('course_id', db.String(50), db.ForeignKey('courses.course_number'))     
)
class Upload(db.Model):
    file_id = db.Column(db.String(1024), primary_key =  True)
    course = db.Column(db.String(50))
    data = db.Column(db.String(1024))
    owner_id = db.Column(db.String(1024), db.ForeignKey('users.username'))
    def __repr__(self):
        return '<File_id %r>' % self.file_id

class Users(db.Model):
    username = db.Column(db.String(256), primary_key =  True)
    password = db.Column(db.String(256), nullable = False)
    firstname = db.Column(db.String(256), nullable = False)
    lastname = db.Column(db.String(256), nullable = False)
    email = db.Column(db.String(256), nullable = False, unique = True)
    favorite = db.relationship('Courses', secondary=favorites, backref = 'users')
    notes = db.relationship('Upload', backref='owner')
    def __repr__(self):
        return '<Username %r>' % self.username

# Need to update based on course explorer API
class Courses(db.Model):
    course_number = db.Column(db.String(50), primary_key =  True)
    def __repr__(self):
        return '<Username %r>' % self.username

# JSON 
# "username": naomil4
# "password": 12345
# "firstname": Naomi
# "lastname": Lin
# "email": naomil4@illinois.edu


"""
JSON request body from frontend
await axios.post('/register', {username: '', password: '', firstname: '', lastname: '', email: ''})
=======
"""

@app.route('/register', methods = ['POST'])
def register():
    print("hi")
    # body is a variable that takes in json input from post, and then we parse it to set each of the user properties
    body = request.json
    username = body["username"]
    password = body["password"]
    firstname = body["firstname"]
    lastname = body["lastname"]
    email = body["email"]

    # creating a new user and adding it to the db
    newUser = Users(username=username, password=password, firstname=firstname, lastname=lastname, email=email)
    db.session.add(newUser)
    db.session.commit()
    
    # get info from table corresponding to the username (unique) and print back
    ret = Users.query.get(username)
    return jsonify({"username": ret.username, "password": ret.password, "firstname": ret.firstname, "lastname": ret.lastname, "email": ret.email})

@app.route('/get_pdf/<file_id>', methods=['GET'])
def get_pdf(file_id):
    note = Upload.query.filter_by(file_id=file_id).first()
    if note:
        file_path = note.data
        if file_path.endswith('.pdf'):  # Check if the file is a PDF
            return send_file(file_path, mimetype='application/pdf')
        else:
            return jsonify({"error": "The file is not a PDF."}), 400
    else:
        return jsonify({"error": "Note not found."}), 404
    
@app.route('/get_file_ids/<username>', methods=['GET'])
def get_file_ids(username):
    user = Users.query.filter_by(username=username).first()
    if user:
        file_ids = [note.file_id for note in user.notes]
        return jsonify({"success": True, "file_ids": file_ids})
    else:
        return jsonify({"error": "User not found."}), 404
    
@app.route('/get_favorites/<username>', methods=['GET'])
def get_favorites(username):
    user = Users.query.filter_by(username=username).first()
    if user:
        favorite_courses = [course.course_number for course in user.favorite]
        return jsonify({"success": True, "favorite_courses": favorite_courses})
    else:
        return jsonify({"error": "User not found."}), 404

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        body = request.json
        username = body.get("username")
        password = body.get("password")
        if not username or not password:
            return jsonify({"error": "Username and password are required."}), 400

        user = Users.query.filter_by(username=username).first()
        if user:
            if user.password == password:
                favorites = user.favorite
                notes = []
                for course in favorites:
                    #cannot test because cannot upload
                    course_notes = Upload.query.filter_by(course=course.course_number).all()
                    notes.extend(course_notes)
                notes_data = [{"file": note.file_id, "data": note.data} for note in notes]
                return jsonify({"success": True, "message": "Login successful", "notes": notes_data})
            else:
                return jsonify({"error": "Incorrect password."}), 401
        else:
            return jsonify({"error": "User does not exist."}), 404

    return jsonify({"error": "Method not allowed."}), 405

# SELECT C.course_number, C.professor, C.subject
                # FROM favorites f JOIN Courses C ON C.course_number = E.course_number
                # WHERE E.username = "naomi"

# POST /upload/naomi/cs225

@app.route('/upload/<username>/<course_number>', methods=['POST'])
def upload(username, course_number):
    if request.method == 'POST':
        file = request.files['file_id'] #what is frontend passing in
        dir = os.path.join(current_app.instance_path, 'files')
        os.makedirs(dir, exist_ok=True)
        file_path = os.path.join(dir, file.filename)
        file.save(file_path)
        print(file_path)
        #need users to input into frontend what course these notes are for, then add to this upload statement
        upload = Upload(file_id = file.filename, course = str(course_number), data = file_path, owner_id = str(username))
        db.session.add(upload)
        db.session.commit()
        return f'Uploaded: {upload.file_id}'
    return -1

@app.route('/download/<upload_id>', methods=['GET'])
def download(upload_id):
    print("front")
    upload = Upload.query.filter_by(file_id=upload_id).first()
    print(upload)
    if upload:
        print("here")
        file_path = upload.data  # Retrieve the file path from the Upload object
        print(file_path)
        if os.path.exists(file_path):  # Check if the file exists
            print("inside")
            return send_file(file_path, as_attachment=True)
        else:
            return 'File not found', 404
    else:
        return 'Upload not found', 404


@app.route('/delete/<upload_id>', methods = ['DELETE'])
def delete(upload_id):
    file_to_delete = Upload.query.get_or_404(upload_id)
    try:
        db.session.delete(file_to_delete)
        db.session.commit()
        return f'File Deleted Successfully!'
    except:
        return f'File Deletion Unsuccessful'

@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    if request.method == 'POST':
        data = request.json
        user_id = data.get('user_id')
        course_id = data.get('course_id')

        if not user_id or not course_id:
            return jsonify({"error": "Both user_id and course_id are required."}), 400

        user = Users.query.filter_by(username=user_id).first()
        if user:
            course = Courses.query.get(course_id)
            if course:
                user.favorite.append(course)
                db.session.commit()
                return jsonify({"success": True, "message": "Course added to favorites successfully."}), 200
            else:
                return jsonify({"error": "Course not found."}), 404
        else:
            return jsonify({"error": "User not found."}), 404

    return jsonify({"error": "Method not allowed."}), 405
    
#courses
base_url = "courses.illinois.edu"
 
def add_courses_to_table():
    with app.app_context():
        term_path = "/cisapp/explorer/schedule/2024/spring.xml"
        conn = http.client.HTTPSConnection(base_url)
        conn.request("GET", term_path)
        response = conn.getresponse()

        if response.status != 200:
            print(f"Failed to retrieve data: {response.status} {response.reason}")
            conn.close()
            return

        xml_content = response.read()
        root = ET.fromstring(xml_content)
        subjects = root.findall(".//subject")

        for subject in subjects:
            subject_id = subject.get("id")
            subject_name = subject.text
            subject_url = subject.get("href")
            get_courses(subject_id, subject_name, subject_url)

        conn.close()

# Function to get the list of courses for each subject  
def get_courses(subject_id, subject_name, subject_url):
    #print(f"Retrieving courses for subject: {subject_name} ({subject_id})")

    conn = http.client.HTTPSConnection(base_url)
    conn.request("GET", subject_url)
    response = conn.getresponse()

    #print("after connection")

    if response.status != 200:
        print(f"Failed to retrieve data for {subject_name}: {response.status} {response.reason}")
        conn.close()
        return
    
    #print("before xml read")

    xml_content = response.read()
    #print("xml content" , str(xml_content))
    subject_tree = ET.fromstring(xml_content)
    courses = subject_tree.findall(".//course")

    #print("after xml read")

    for course in courses:
        course_id = course.get("id")
        course_name = course.findtext("label")
        course_number = f"{subject_id} {course_id}"  # Construct course number
        # Check if the course already exists in the database
        existing_course = Courses.query.get(course_number)
        if existing_course:
            print(f"Course {course_number} already exists in the database. Skipping.")
            continue
        # If the course doesn't exist, add it to the database
        new_course = Courses(course_number=course_number)
        db.session.add(new_course)
        db.session.commit()
        print(f"Added course {course_number} to the database")

    conn.close()

#scheduler = BackgroundScheduler()
#scheduler.add_job(func=add_courses_to_table)
#scheduler.start()

if __name__ == '__main__':
    add_courses_to_table()
    print("done")
    app.run(debug=True, port=5000)