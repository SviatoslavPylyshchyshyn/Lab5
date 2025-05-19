import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './CommentForm.css';

const CommentForm = ({ onAddComment }) => {
  const [comment, setComment] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      text: comment,
      userEmail: currentUser.email,
      date: new Date().toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    onAddComment(newComment);
    setComment('');
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className={`comment-input ${!currentUser ? 'disabled' : ''}`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={currentUser ? "Напишіть ваш коментар..." : "Увійдіть, щоб залишити коментар"}
        disabled={!currentUser}
      />
      {!currentUser && (
        <div className="error-message">
          Будь ласка, увійдіть в систему, щоб залишити коментар
        </div>
      )}
      <button 
        type="submit" 
        className={`add-comment ${!currentUser ? 'disabled' : ''}`}
        disabled={!currentUser}
      >
        Додати коментар
      </button>
    </form>
  );
};

export default CommentForm; 