import React, { useEffect, useState } from 'react';
import './CharacterGrid.css';

const CharacterGrid = ({ onCharacterClick }) => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    // Fetch characters from the backend API
    fetch('http://localhost:8001/characters')
      .then(response => response.json())
      .then(data => {
        // Log the data to ensure we aren't getting duplicates from the API
        console.log('Fetched characters:', data);
        setCharacters(data);
      })
      .catch(error => console.error('Error fetching characters:', error));
  }, []);  // Ensure useEffect is run only once on component mount

  return (
    <div className="character-grid">
      {characters.length > 0 ? (
        characters.map(character => (
          <div
            key={character.id}
            className="character-card"
            onClick={() => onCharacterClick(character)}  // Add click event to each card
          >
            <h3>{character.name}</h3>
            <img src={character.avatar_url} alt={character.name} className="character-avatar" />
            <p><strong>{character.name}</strong></p>
            <p>{character.description}</p>
          </div>
        ))
      ) : (
        <p>No characters found. Create one!</p>
      )}
    </div>
  );
};

export default CharacterGrid;
