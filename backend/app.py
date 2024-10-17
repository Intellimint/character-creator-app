from flask import Flask, jsonify, request
from flask_cors import CORS  # Import the CORS library
from app.routes import create_character, get_characters
from app.database import engine, SessionLocal
import app.models as models
from app.models import Character

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Create the database tables (if they don't exist)
models.Base.metadata.create_all(bind=engine)

# Define the routes using decorators
@app.route('/create-character', methods=['POST'])
def create_character_route():
    return create_character()

@app.route('/characters', methods=['GET'])
def get_characters_route():
    return get_characters()

# DELETE route for deleting a character by ID
@app.route('/characters/<int:character_id>', methods=['DELETE'])
def delete_character_route(character_id):
    db = SessionLocal()
    character = db.query(Character).filter(Character.id == character_id).first()
    
    if character:
        db.delete(character)
        db.commit()
        return jsonify({"message": f"Character with id {character_id} deleted successfully."}), 200
    else:
        return jsonify({"error": "Character not found."}), 404

# PATCH route for changing (updating) a character by ID
@app.route('/characters/<int:character_id>', methods=['PATCH'])
def update_character_route(character_id):
    db = SessionLocal()
    character = db.query(Character).filter(Character.id == character_id).first()
    
    if not character:
        return jsonify({"error": "Character not found."}), 404

    # Extract the new data from the request and update the character fields
    character_data = request.get_json()

    if 'name' in character_data:
        character.name = character_data['name']
    if 'avatar_url' in character_data:
        character.avatar_url = character_data['avatar_url']
    if 'gender_identity' in character_data:
        character.gender_identity = character_data['gender_identity']
    if 'sexual_orientation' in character_data:
        character.sexual_orientation = character_data['sexual_orientation']
    if 'description' in character_data:
        character.description = character_data['description']
    if 'persona' in character_data:
        character.persona = character_data['persona']
    if 'first_message' in character_data:
        character.first_message = character_data['first_message']
    if 'nsfw' in character_data:
        character.nsfw = character_data['nsfw']
    if 'tags' in character_data:
        character.tags = ",".join(character_data['tags'])

    db.commit()  # Commit the changes
    db.refresh(character)

    return jsonify({
        'id': character.id,
        'name': character.name,
        'avatar_url': character.avatar_url,
        'gender_identity': character.gender_identity,
        'sexual_orientation': character.sexual_orientation,
        'description': character.description,
        'persona': character.persona,
        'first_message': character.first_message,
        'nsfw': character.nsfw,
        'tags': character.tags.split(',')
    })

if __name__ == '__main__':
    app.run(port=8001, debug=True)
