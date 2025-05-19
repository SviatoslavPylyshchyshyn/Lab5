import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './ArticleManager.css';

const ArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const articlesRef = collection(db, 'articles');
      const snapshot = await getDocs(articlesRef);
      const articlesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticles(articlesList);
      setLoading(false);
    } catch (error) {
      console.error('Error loading articles:', error);
      setError('Помилка при завантаженні статей');
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю статтю?')) {
      try {
        const articleRef = doc(db, 'articles', articleId);
        await deleteDoc(articleRef);
        setArticles(articles.filter(article => article.id !== articleId));
        alert('Статтю успішно видалено');
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Помилка при видаленні статті');
      }
    }
  };

  if (loading) {
    return <div className="loading">Завантаження статей...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="article-manager">
      <h2>Управління статтями</h2>
      <div className="articles-list">
        {articles.map(article => (
          <div key={article.id} className="article-item">
            <div className="article-info">
              <h3>{article.title}</h3>
              <p className="article-date">
                Дата: {new Date(article.date).toLocaleDateString()}
              </p>
              <p className="article-content">
                {article.content.substring(0, 100)}...
              </p>
            </div>
            <div className="article-actions">
              <button 
                className="delete-button"
                onClick={() => handleDelete(article.id)}
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleManager; 