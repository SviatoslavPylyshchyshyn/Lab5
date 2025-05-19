import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config';
import CommentForm from '../CommentForm/CommentForm';
import CommentList from '../CommentList/CommentList';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [comments, setComments] = useState([]);
  const [favoriteId, setFavoriteId] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkIfLiked = async () => {
      if (currentUser) {
        try {
          const response = await fetch(`${API_URL}/favorites/${currentUser.uid}`);
          if (response.ok) {
            const favorites = await response.json();
            const favorite = favorites.find(fav => fav.articleId === article.id);
            if (favorite) {
              setIsLiked(true);
              setFavoriteId(favorite.id);
            }
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    checkIfLiked();
  }, [currentUser, article.id]);

  const handleLike = async () => {
    if (!currentUser) {
      alert('Будь ласка, увійдіть в систему, щоб додавати статті до вподобаних');
      return;
    }

    try {
      if (isLiked) {
        // Видалення з вподобаних
        const response = await fetch(`${API_URL}/favorites/${favoriteId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setIsLiked(false);
          setFavoriteId(null);
        } else {
          throw new Error('Помилка при видаленні з вподобаних');
        }
      } else {
        // Додавання до вподобаних
        const response = await fetch(`${API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUser.uid,
            articleId: article.id,
            articleTitle: article.title,
            articleImage: article.image
          })
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(true);
          setFavoriteId(data.id);
        } else {
          const error = await response.json();
          if (error.error === 'Стаття вже додана до вподобаних') {
            setIsLiked(true);
          } else {
            throw new Error('Помилка при додаванні до вподобаних');
          }
        }
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert(error.message);
    }
  };

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  const handleAddComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  // Формуємо текст для відображення: або базовий контент, або контент + додатковий
  const displayContent = showMore 
    ? article.content + ' ' + article.moreContent 
    : article.content;

  return (
    <div className={`article-card ${isLiked ? 'liked' : ''}`}>
      <h3>{article.title}</h3>
      {article.image && (
        <img src={article.image} alt={article.title} />
      )}
      <div className="date">
        <span>Опубліковано: {article.date}</span>
      </div>
      <div className="content">
        <p>{displayContent}</p>
        {article.moreContent && (
          <button className="read-more" onClick={handleReadMore}>
            {showMore ? 'Згорнути' : 'Читати далі'}
          </button>
        )}
      </div>
      <div className="interactions">
        <button 
          className={`like-button ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} {isLiked ? 'Вподобано' : 'Вподобати'}
        </button>
      </div>
      <div className="comments-section">
        <h4>Коментарі</h4>
        <CommentForm onAddComment={handleAddComment} />
        <CommentList comments={comments} />
      </div>
    </div>
  );
};

export default ArticleCard; 