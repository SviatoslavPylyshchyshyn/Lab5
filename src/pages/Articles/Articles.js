import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import './Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('createdAt', sortOrder === 'newest' ? 'desc' : 'asc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedArticles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date || doc.data().createdAt
        }));
        setArticles(fetchedArticles);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching articles:', error);
        setError('Помилка при завантаженні статей. Спробуйте пізніше.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sortOrder]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };

  if (loading) {
    return (
      <div className="articles-page">
        <div className="loading-spinner">Завантаження статей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="articles-header">
        <h1>Статті про подорожі</h1>
        <div className="sort-controls">
          <label>Сортувати за датою:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Спочатку нові</option>
            <option value="oldest">Спочатку старі</option>
          </select>
        </div>
      </div>
      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard
            key={article.id}
            article={{
              ...article,
              date: formatDate(article.date)
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Articles;