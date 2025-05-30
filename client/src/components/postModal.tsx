import React, { useState } from 'react';
import './postModal.css';
import API_BASE_URL from '../config';

interface Props {
  onClose: () => void;
}

const PostModal: React.FC<Props> = ({ onClose }) => {
  //form state for link and description input
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  //function to handle form submission
  const handleSubmit = async () => {
    if (!link) return; //do not allow empty link field

    try {
      setSubmitting(true);
      await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ link, description }),
      });

      //reset input fields and close modal
      setLink('');
      setDescription('');
      onClose();
      window.location.reload();//refresh to show the new post
    } catch (err) {
      console.error("Post failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Share a song</h3>
        <input
          type="text"
          placeholder="Paste Spotify / YouTube / Apple Music link..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <textarea
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose} disabled={submitting}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting || !link}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
