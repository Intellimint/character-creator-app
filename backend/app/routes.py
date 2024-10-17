from flask import request, jsonify
from app.models import Character
from app.database import SessionLocal

def create_character():
    db = SessionLocal()
    data = request.json

    new_character = Character(
        name=data.get('name'),
        avatar_url=data.get('avatar_url'),
        gender_identity=data.get('gender_identity'),
        sexual_orientation=data.get('sexual_orientation'),
        description=data.get('description'),
        persona=data.get('persona'),
        first_message=data.get('first_message'),
        creator_id=data.get('creator_id')
    )

    db.add(new_character)
    db.commit()
    db.refresh(new_character)

    return jsonify({
        "message": "Character created successfully!",
        "character": {
            "id": new_character.id,
            "name": new_character.name,
            "avatar_url": new_character.avatar_url,
            "gender_identity": new_character.gender_identity,
            "sexual_orientation": new_character.sexual_orientation,
            "description": new_character.description,
            "persona": new_character.persona,
            "first_message": new_character.first_message,
            "creator_id": new_character.creator_id
        }
    })
