import React, { useState } from 'react';
import './CharacterCreationForm.css';

const CharacterCreationForm = ({ onCharacterCreated }) => {
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [genderIdentity, setGenderIdentity] = useState('');
  const [customGender, setCustomGender] = useState('');
  const [sexualOrientation, setSexualOrientation] = useState('');
  const [customSexualOrientation, setCustomSexualOrientation] = useState('');
  const [description, setDescription] = useState('');
  const [persona, setPersona] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [isNSFW, setIsNSFW] = useState(false);
  const [tags, setTags] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('avatar', avatarFile);
    formData.append('gender_identity', customGender || genderIdentity);
    formData.append('sexual_orientation', customSexualOrientation || sexualOrientation);
    formData.append('description', description);
    formData.append('persona', persona);
    formData.append('first_message', firstMessage);
    formData.append('is_nsfw', isNSFW);
    formData.append('tags', tags);

    try {
      const response = await fetch('http://localhost:8001/create-character', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newCharacter = await response.json();
        onCharacterCreated(newCharacter);
        // Reset form
        setName('');
        setAvatarFile(null);
        setAvatarPreview('');
        setGenderIdentity('');
        setCustomGender('');
        setSexualOrientation('');
        setCustomSexualOrientation('');
        setDescription('');
        setPersona('');
        setFirstMessage('');
        setIsNSFW(false);
        setTags('');
      } else {
        console.error('Failed to create character');
      }
    } catch (error) {
      console.error('Error creating character:', error);
    }
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
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="avatar-preview"
            />
          )}
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