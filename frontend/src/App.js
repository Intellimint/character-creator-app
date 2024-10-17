import React, { useState, useEffect } from 'react';
import CharacterGrid from './components/CharacterGrid/CharacterGrid';
import CharacterCreationForm from './components/CharacterCreation/CharacterCreationForm';
import './App.css';

const characters = [
  { id: 1, name: 'Thorin', avatar: 'https://example.com/thorin.png', description: 'A mighty warrior' },
  { id: 2, name: 'Elena', avatar: 'https://example.com/elena.png', description: 'A cunning strategist' },
  { id: 3, name: 'Leif', avatar: 'https://example.com/leif.png', description: 'A swift and agile rogue' },
];

function App() {
  const [route, setRoute] = useState(window.location.pathname);

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

  const renderCharacterPage = () => {
    const characterName = route.split('/character/')[1];
    const character = characters.find((c) => c.name.toLowerCase() === characterName);
    if (character) {
      return (
        <div>
          <h2>{character.name}</h2>
          <img src={character.avatar} alt={character.name} />
          <p>{character.description}</p>
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
        {route === '/' && <CharacterGrid navigate={navigate} />}
        {route === '/create-character' && <CharacterCreationForm />}
        {route.includes('/character/') && renderCharacterPage()}
      </main>
    </div>
  );
}

export default App;
