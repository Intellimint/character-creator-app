import React, { useState } from 'react';
import './CharacterCreationForm.css';

const CharacterCreationForm = ({ onCharacterCreated }) => {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [genderIdentity, setGenderIdentity] = useState('');
  const [customGender, setCustomGender] = useState('');
  const [sexualOrientation, setSexualOrientation] = useState('');
  const [customSexualOrientation, setCustomSexualOrientation] = useState('');
  const [description, setDescription] = useState('');
  const [persona, setPersona] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [isNSFW, setIsNSFW] = useState(false); // NSFW field
  const [tags, setTags] = useState('');  // Tags field

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCharacter = {
      name,
      avatar_url: avatarUrl,
      gender_identity: customGender || genderIdentity,
      sexual_orientation: customSexualOrientation || sexualOrientation,
      description,
      persona,
      first_message: firstMessage,
      is_nsfw: isNSFW,  // Capture NSFW status
      tags: tags.split(',').map(tag => tag.trim()),  // Convert tags to array
      creator_id: 1,  // This would typically be dynamic (e.g., based on logged-in user)
    };
    onCharacterCreated(newCharacter);
    // Reset form
    setName('');
    setAvatarUrl('');
    setGenderIdentity('');
    setCustomGender('');
    setSexualOrientation('');
    setCustomSexualOrientation('');
    setDescription('');
    setPersona('');
    setFirstMessage('');
    setIsNSFW(false);
    setTags('');
  };

  return (
    <div className="character-form-container">
      <h2>Create a New Character</h2>
      <form onSubmit={handleSubmit} className="character-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter character name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatarUrl">Upload Avatar:</label>
          <input
            type="file"
            id="avatarUrl"
            // For now, handle this as a placeholder; later we will manage the actual file upload
            onChange={(e) => setAvatarUrl(e.target.files[0]?.name)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="genderIdentity">Gender Identity:</label>
          <select
            id="genderIdentity"
            value={genderIdentity}
            onChange={(e) => setGenderIdentity(e.target.value)}
          >
            <option value="" disabled>Select gender identity</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Nonbinary">Nonbinary</option>
            <option value="Intersex">Intersex</option>
            <option value="Other">Other</option>
          </select>
          {genderIdentity === 'Other' && (
            <input
              type="text"
              id="customGender"
              value={customGender}
              onChange={(e) => setCustomGender(e.target.value)}
              placeholder="Enter custom gender identity"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="sexualOrientation">Sexual Orientation:</label>
          <select
            id="sexualOrientation"
            value={sexualOrientation}
            onChange={(e) => setSexualOrientation(e.target.value)}
          >
            <option value="" disabled>Select sexual orientation</option>
            <option value="Straight">Straight</option>
            <option value="Gay">Gay</option>
            <option value="Lesbian">Lesbian</option>
            <option value="Bisexual">Bisexual</option>
            <option value="Pansexual">Pansexual</option>
            <option value="Other">Other</option>
          </select>
          {sexualOrientation === 'Other' && (
            <input
              type="text"
              id="customSexualOrientation"
              value={customSexualOrientation}
              onChange={(e) => setCustomSexualOrientation(e.target.value)}
              placeholder="Enter custom sexual orientation"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter character description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="persona">Persona:</label>
          <textarea
            id="persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Describe the character's persona"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstMessage">First Message:</label>
          <textarea
            id="firstMessage"
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            placeholder="Enter character's first message"
            required
          />
        </div>

        {/* NSFW Checkbox */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isNSFW}
              onChange={(e) => setIsNSFW(e.target.checked)}
            />
            Mark as NSFW
          </label>
        </div>

        {/* Tags Input */}
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (e.g., warrior, healer, mage)"
          />
        </div>

        <button type="submit" className="submit-btn">Create Character</button>
      </form>
    </div>
  );
};

export default CharacterCreationForm;
