from flask import Blueprint, request, jsonify
from app.models import db, Character
import os

character_routes = Blueprint('character_routes', __name__)

@character_routes.route('/characters', methods=['GET'])
def get_characters():
    characters = Character.query.all()
    return jsonify([character.to_dict() for character in characters])

@character_routes.route('/character/<int:character_id>', methods=['GET'])
def get_character(character_id):
    character = Character.query.get_or_404(character_id)
    return jsonify(character.to_dict())

@character_routes.route('/character/<int:character_id>', methods=['PATCH'])
def update_character(character_id):
    character = Character.query.get_or_404(character_id)
    data = request.json

    for key, value in data.items():
        if hasattr(character, key):
            setattr(character, key, value)

    db.session.commit()
    return jsonify(character.to_dict())

@character_routes.route('/character/<int:character_id>', methods=['DELETE'])
def delete_character(character_id):
    character = Character.query.get_or_404(character_id)
    
    # Delete the associated avatar file if it exists
    if character.avatar_url and os.path.exists(character.avatar_url):
        os.remove(character.avatar_url)
    
    db.session.delete(character)
    db.session.commit()
    return '', 204

# The create_character route is now in app.py to handle file uploads