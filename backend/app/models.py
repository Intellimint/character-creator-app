from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    avatar_url = db.Column(db.String(255))
    gender_identity = db.Column(db.String(50))
    sexual_orientation = db.Column(db.String(50))
    description = db.Column(db.Text)
    persona = db.Column(db.Text)
    first_message = db.Column(db.Text)
    nsfw = db.Column(db.Boolean, default=False)
    tags = db.Column(db.Text)  # Store as JSON string
    creator_id = db.Column(db.Integer)

    def __repr__(self):
        return f'<Character {self.name}>'

    def set_tags(self, tags_list):
        self.tags = json.dumps(tags_list)

    def get_tags(self):
        return json.loads(self.tags) if self.tags else []

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'avatar_url': self.avatar_url,
            'gender_identity': self.gender_identity,
            'sexual_orientation': self.sexual_orientation,
            'description': self.description,
            'persona': self.persona,
            'first_message': self.first_message,
            'nsfw': self.nsfw,
            'tags': self.get_tags(),
            'creator_id': self.creator_id
        }