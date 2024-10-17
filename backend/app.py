import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from app.models import db, Character
from app.routes import character_routes

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///characters.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
logger.info(f"Upload folder created/verified at: {os.path.abspath(app.config['UPLOAD_FOLDER'])}")

# Initialize database
db.init_app(app)
logger.info(f"Database file location: {os.path.abspath(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', ''))}")

# Create tables
with app.app_context():
    db.create_all()
    logger.info("Database tables created successfully")
    # Log existing tables
    inspector = db.inspect(db.engine)
    tables = inspector.get_table_names()
    logger.info(f"Existing tables in the database: {tables}")

# Register routes
app.register_blueprint(character_routes)
logger.info("Character routes registered")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/create-character', methods=['POST'])
def create_character():
    logger.debug("Received request to create character")
    logger.debug(f"Request form data: {request.form}")
    logger.debug(f"Request files: {request.files}")
    logger.debug(f"Request json: {request.json}")

    avatar_url = None

    if request.files and 'avatar' in request.files:
        file = request.files['avatar']
        if file.filename != '':
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                avatar_url = file_path
                logger.info(f"Avatar file saved: {file_path}")
            else:
                logger.warning(f"Invalid file type for avatar: {file.filename}")
                return jsonify({'error': 'Invalid file type for avatar'}), 400
    elif request.json and 'avatar_url' in request.json:
        avatar_url = request.json['avatar_url']
        logger.info(f"Avatar URL provided: {avatar_url}")
    else:
        logger.warning("No avatar file or URL provided in request")
        return jsonify({'error': 'No avatar file or URL provided'}), 400

    try:
        data = request.json if request.is_json else request.form

        new_character = Character(
            name=data.get('name'),
            avatar_url=avatar_url,
            gender_identity=data.get('gender_identity'),
            sexual_orientation=data.get('sexual_orientation'),
            description=data.get('description'),
            persona=data.get('persona'),
            first_message=data.get('first_message'),
            nsfw=data.get('nsfw') == 'true' if isinstance(data.get('nsfw'), str) else data.get('nsfw', False)
        )

        tags = data.get('tags', [])
        if isinstance(tags, str):
            tags = tags.split(',')
        new_character.set_tags(tags)

        logger.debug(f"New character object created: {new_character}")
        logger.debug(f"New character dict: {new_character.to_dict()}")

        db.session.add(new_character)
        db.session.commit()
        logger.info(f"New character created and committed to database: {new_character.name}")
        return jsonify(new_character.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating character: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to create character'}), 500


@app.route('/characters', methods=['GET'])
def get_characters():
    logger.debug("Received request to get all characters")
    try:
        characters = Character.query.all()
        logger.info(f"Retrieved {len(characters)} characters")
        
        if len(characters) == 0:
            logger.warning("No characters found in the database")
        else:
            for character in characters:
                logger.debug(f"Character retrieved: {character.to_dict()}")
        
        result = [character.to_dict() for character in characters]
        logger.debug(f"Returning result: {result}")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error retrieving characters: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to retrieve characters'}), 500

@app.route('/test-logging', methods=['GET'])
def test_logging():
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    return jsonify({"message": "Logging test completed"}), 200

@app.errorhandler(404)
def not_found_error(error):
    logger.warning(f"404 error: {request.url}")
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    logger.error(f"500 error: {str(error)}", exc_info=True)
    return jsonify({'error': 'Internal server error'}), 500

@app.before_request
def log_request_info():
    logger.debug('Headers: %s', request.headers)
    logger.debug('Body: %s', request.get_data())

@app.after_request
def log_response_info(response):
    logger.debug('Response status: %s', response.status)
    logger.debug('Response headers: %s', response.headers)
    return response

if __name__ == '__main__':
    logger.info("Starting the Flask application")
    app.run(debug=True, port=8001)