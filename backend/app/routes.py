from flask import jsonify, request
from app.models import Character
from app.database import SessionLocal

# Helper function to serialize Character objects
def serialize_character(character):
    return {
        'id': character.id,
        'name': character.name,
        'avatar_url': character.avatar_url,
        'gender_identity': character.gender_identity,
        'sexual_orientation': character.sexual_orientation,
        'description': character.description,
        'persona': character.persona,
        'first_message': character.first_message,
        'nsfw': character.nsfw,  # Boolean field
        'tags': character.tags.split(',')  # Convert comma-separated tags back to a list
    }

# Existing route for creating a character
def create_character():
    db = SessionLocal()
    character_data = request.get_json()

    new_character = Character(
        name=character_data['name'],
        avatar_url=character_data['avatar_url'],
        gender_identity=character_data['gender_identity'],
        sexual_orientation=character_data['sexual_orientation'],
        description=character_data['description'],
        persona=character_data['persona'],
        first_message=character_data['first_message'],
        nsfw=character_data['nsfw'],  # Use the corrected field name
        tags=",".join(character_data['tags'])  # Store tags as comma-separated values
    )

    db.add(new_character)
    db.commit()
    db.refresh(new_character)

    return jsonify(serialize_character(new_character))  # Use the helper function to serialize

# Route for fetching all characters
def get_characters():
    db = SessionLocal()
    characters = db.query(Character).all()
    return jsonify([serialize_character(character) for character in characters])  # Serialize each character
