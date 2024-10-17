import React from 'react';

const CharacterCard = ({ name, avatar, description, navigate }) => {
  const handleClick = () => {
    // Navigate to the character's custom URL
    navigate(`/character/${name.toLowerCase()}`);
  };

  return (
    <div className="character-card" onClick={handleClick}>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};

export default CharacterCard;
