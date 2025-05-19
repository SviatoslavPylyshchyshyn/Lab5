import React, { useState } from 'react';
import { addArticlesToFirebase, deleteAllArticles } from '../../services/articles';
import './InitializeArticles.css';

const InitializeArticles = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInitialize = async () => {
    try {
      await addArticlesToFirebase();
      setIsInitialized(true);
      setError(null);
      console.log('Статті успішно ініціалізовано');
    } catch (err) {
      setError('Помилка при ініціалізації статей: ' + err.message);
      console.error('Помилка при ініціалізації статей:', err);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await deleteAllArticles();
      setIsInitialized(false); // Скидаємо стан, щоб показати кнопку ініціалізації
      setError(null);
      console.log('Статті успішно видалено з Firebase');
    } catch (err) {
      setError('Помилка при видаленні статей: ' + err.message);
      console.error('Помилка при видаленні статей:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isInitialized) {
    return (
      <div className="initialize-articles">
        <p className="success-message">Статті успішно ініціалізовано!</p>
        <button onClick={handleDeleteAll} className="delete-button" disabled={isDeleting}>
          {isDeleting ? 'Видалення...' : 'Видалити всі статті'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <div className="initialize-articles">
      <p>Наразі немає статей. Ви можете ініціалізувати їх.</p>
      <button onClick={handleInitialize} className="initialize-button">
        Ініціалізувати статті з картинками
      </button>
      <button onClick={handleDeleteAll} className="delete-button" disabled={isDeleting}>
        {isDeleting ? 'Видалення...' : 'Видалити всі статті'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InitializeArticles;
