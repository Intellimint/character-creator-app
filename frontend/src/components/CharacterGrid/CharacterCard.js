import React from 'react';

const CharacterCard = ({ name, avatar, description, isNSFW, tags }) => {
  return (
    <div className="character-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      {isNSFW && <p style={{ color: 'red' }}>NSFW</p>}
      <p>{description}</p>
      <p>Tags: {tags.join(', ')}</p>
    </div>
  );
};

export default CharacterCard;
