# Introduction

Many students seek accessible study materials for tests, projects, and homework. However, there isn’t a particular place for students to get the resources they need. StudyBase provides a centralized hub for UIUC students to access notes, study guides, and more for each of their classes. Some functionality includes:

1) Account registration and login
2) Dashboard of various users notes
3) Listing of all UIUC courses
4) User-specific course favorites list
5) Uploading + downloading of materials
6) Deleting uploaded materials

For more detailes, view the full project proposal [here](https://docs.google.com/document/d/1KMSjDw_km_WGcc7D8A2eaXPgIu5PZQj2v0zgZOx_Tj8/edit?usp=sharing).

# Technical Architecture

<img width="811" alt="Screenshot 2024-05-07 at 11 12 49 PM" src="https://github.com/CS222-UIUC-SP24/group-project-team-500/assets/42686736/2e2d713b-5991-4101-8222-8fe4cb9a2160">

# Developers

* **Jasmine Liu:** Frontend to backend connection, login, upload, favorites, and registration page design
* **Sneha Dhital:** Home and registration page design, page routing, styling
* **Naomi Lin:** User registration and login, uploading + downloading files, deleting uploaded files
* **Aashvi Busa:** Managing Course Explorer API calls, XML parsing, adding courses to favorites

# Virtual Environment Set-up

Set-up a virtual environment before installing any packages
```
python3 -m venv .venv
...venv/bin/activate
```

# Installations

## Flask Installation
Install Flask to run the flask web framework
```
python3 -m pip install Flask
```
## Requests Installation
Install requests library to send HTTP requests
```
python3 -m pip install requests
```
## React Installation
Install React for frontend rendering. Before installing React, you need to have Node.js installed, which can be done [here](https://nodejs.org/en/).
```
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```
Open developer tools from the terminal
```
react-devtools
```
## Axois Installation
Install Axios for making API requests
```
# Yarn
yarn add axios

# Npm
npm install axios
```

# Project Instructions

## Backend
Create local SQLite database
```
python3
>> from app import app, db
>> app.app_context().push()
>> db.create_all()
```
Execute python script to add courses to database
```
python3 app.py
```
Execute flask app to run the application
```
python3 -m flask run
```

## Frontend
Finally, open a seperate terminal and execute the command below to render the frontend and use the app!
```
npm run dev
```
