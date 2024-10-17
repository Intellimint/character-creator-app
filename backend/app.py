from flask import Flask
from app.routes import create_character
from app.database import engine
import app.models as models
from flask_cors import CORS  # Import for enabling CORS

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes to allow requests from the frontend
CORS(app)

# Create the database tables (if they don't exist)
models.Base.metadata.create_all(bind=engine)

# Define the route for creating a character
@app.route('/create-character', methods=['POST'])
def create_character_route():
    return create_character()

if __name__ == '__main__':
    app.run(port=8001, debug=True)
