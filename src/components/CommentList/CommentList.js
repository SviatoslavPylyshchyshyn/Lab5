import React from 'react';
import './CommentList.css';

const CommentList = ({ comments }) => {
  if (comments.length === 0) {
    return <div className="no-comments">Поки що немає коментарів. Будьте першим!</div>;
  }

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <p>{comment.text}</p>
          <div className="comment-meta">
            <div className="comment-author">
              <span className="user-name">{comment.userName}</span>
              <span className="user-email">({comment.userEmail})</span>
            </div>
            <small className="comment-date">{comment.date}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList; 
