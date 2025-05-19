import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import './Favorites.css';

const Favorites = () => {
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/favorites/${currentUser.uid}`);
        if (!response.ok) {
          throw new Error('Помилка при завантаженні вподобаних статей');
        }
        const data = await response.json();
        setFavoriteArticles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="favorites-page">
        <h1>Вподобані статті</h1>
        <p className="login-message">Будь ласка, увійдіть в систему, щоб переглядати вподобані статті</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="loading-spinner">Завантаження вподобаних статей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1>Вподобані статті</h1>
      {favoriteArticles.length === 0 ? (
        <p className="no-favorites">У вас ще немає вподобаних статей</p>
      ) : (
        <div className="favorites-grid">
          {favoriteArticles.map(favorite => (
            <ArticleCard
              key={favorite.id}
              article={{
                id: favorite.articleId,
                title: favorite.articleTitle,
                image: favorite.articleImage,
                date: new Date(favorite.createdAt).toLocaleDateString()
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 