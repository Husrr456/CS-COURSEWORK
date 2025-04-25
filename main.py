from flask import Flask, render_template, request, jsonify # Import Flask Class and render HTML template
from passlib.hash import sha256_crypt # Import sha256_crypt for password hashing 
import sqlite3  # Import SQLite3 to connect to the database
import os  # Import OS to check if the database file exists

current_directory = os.path.dirname(os.path.abspath(__file__))  # Get the current directory
print(f"Database is being created in: {current_directory}")

app = Flask(__name__, template_folder='templates')  # Create an instance and sets the template folder
app.secret_key = "your_secret_key" # Set a secret key for session management
con = sqlite3.connect(f"{current_directory}/users.db")  # Connect to the database
cur = con.cursor()  # Create a cursor object to interact with the database

def initialise_database():
    with sqlite3.connect(os.path.join(current_directory, 'users.db')):
     cur = con.cursor()
# Ensure the 'users' table exists
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
    ''')
    # Create calculations table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS calculations (
            calculationId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            expression TEXT,
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(userId)
        )
    ''') 

    # Create graphs table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS graphs (
            graphId INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            graphData TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(userId)
        )
    ''')
    con.commit()  # Commit the changes to the database
initialise_database()  # Call the function to create the database and tables

# Route for the index page (Calculator page)
@app.route('/')
def index():
    return render_template('calculator.html')  # Render the calculator.html template

# Route for Sign-Up (handling the POST request)
@app.route("/signUp", methods=["POST"])
def sign_up():
    email = request.form["email"]
    password = sha256_crypt.encrypt((str(request.form["password"])))
    print("Form submitted!")  # This should appear in your terminal when you click sign-up

    # Connect to the database
    connection = sqlite3.connect(os.path.join(current_directory, 'users.db'))
    cursor = connection.cursor()

    try:
     cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
     existing_user = cursor.fetchone()

     if existing_user:
       return jsonify ({"success": False, "message": "ERROR: Email already exists!"}) # Uses jsonify to return a JSON response and sets the success key to False
     # Handle the case where email is already in use
     else:
        # Insert user details into the database
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        connection.commit()
        return jsonify({"success": True, "message": "User registered successfully!"}) # Uses jsonify to return a JSON response and sets the success key to True
    except sqlite3.Error as e:
         return jsonify({"success": False, "message": f"Database error: {e}"}) # Uses jsonify to return a JSON response and sets the success key to False
    finally:
        connection.close()
    # Insert user details into the database (try-except to avoid duplicate emails)
    

@app.route("/signIn", methods=["POST"])
def sign_in():
    if request.method == "POST":
       email = request.form["email"]
       password = request.form["password"]

        # Connect to the database
       connection = sqlite3.connect(os.path.join(current_directory, 'users.db'))
       cursor = connection.cursor()
        
       try:
        # Retrieve the stored hashed password for the given email
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "ERROR: Email does not exist!"}) # Uses jsonify to return a JSON response and sets the success key to False

        stored_hashed_password = user[2]  
       
        # Checking the hashed password with the password provided by the user
        if sha256_crypt.verify(password, stored_hashed_password):
            return jsonify({        # Uses jsonify to return a JSON response and sets the success key to True
                "success": True,
                "message": "Login successful!",
                "user": {"email": user[1]}
            })
        else:
            return jsonify({"success": False, "message": "ERROR: Incorrect password!"}) # Uses jsonify to return a JSON response and sets the success key to False
       except sqlite3.Error as e:
          return jsonify({"success": False, "message": f"Database error: {e}"}) # Uses jsonify to return a JSON response and sets the success key to False
       finally:
            connection.close()

# Flask app runner
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
