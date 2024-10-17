import React, { useState, useEffect } from 'react';
import CharacterGrid from './components/CharacterGrid/CharacterGrid';
import CharacterCreationForm from './components/CharacterCreation/CharacterCreationForm';
import './App.css';

const App = () => {
  const [route, setRoute] = useState(window.location.pathname);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    navigate(`/character/${character.id}`);
  };

  const renderCharacterPage = () => {
    if (selectedCharacter) {
      return (
        <div className="character-details">
          <h2>{selectedCharacter.name}</h2>
          <img src={selectedCharacter.avatar_url} alt={selectedCharacter.name} />
          <p>{selectedCharacter.description}</p>
          <p><strong>Gender Identity:</strong> {selectedCharacter.gender_identity}</p>
          <p><strong>Sexual Orientation:</strong> {selectedCharacter.sexual_orientation}</p>
          <p><strong>Persona:</strong> {selectedCharacter.persona}</p>
          <p><strong>First Message:</strong> {selectedCharacter.first_message}</p>
          <p><strong>NSFW:</strong> {selectedCharacter.nsfw ? 'Yes' : 'No'}</p>
          <p><strong>Tags:</strong> {selectedCharacter.tags.join(', ')}</p>
        </div>
      );
    }
    return <p>Character not found</p>;
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><button onClick={() => navigate('/')}>Home (Character Grid)</button></li>
          <li><button onClick={() => navigate('/create-character')}>Create Character</button></li>
        </ul>
      </nav>
      <main className="main-content">
        {route === '/' && (
          <CharacterGrid onCharacterClick={handleCharacterClick} />
        )}
        {route === '/create-character' && <CharacterCreationForm />}
        {route.includes('/character/') && renderCharacterPage()}
      </main>
    </div>
  );
};

export default App;
