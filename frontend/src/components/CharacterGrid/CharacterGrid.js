import React from 'react';
import CharacterCard from './CharacterCard';

const CharacterGrid = ({ navigate }) => {
  const characters = [
    { id: 1, name: 'Thorin', avatar: 'https://example.com/thorin.png', description: 'A mighty warrior' },
    { id: 2, name: 'Elena', avatar: 'https://example.com/elena.png', description: 'A cunning strategist' },
    { id: 3, name: 'Leif', avatar: 'https://example.com/leif.png', description: 'A swift and agile rogue' },
  ];

  return (
    <div className="character-grid">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          name={character.name}
          avatar={character.avatar}
          description={character.description}
          navigate={navigate}
        />
      ))}
    </div>
  );
};

export default CharacterGrid;
