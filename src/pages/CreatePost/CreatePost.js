import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PostForm from '../../components/PostForm/PostForm';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (postData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Початок створення публікації...', { title: postData.title });

      const currentDate = new Date().toISOString();
      const articleData = {
        title: postData.title,
        content: postData.content,
        moreContent: postData.content,
        date: currentDate,
        createdAt: currentDate,
        image: postData.imageData,
        comments: []
      };

      console.log('Збереження статті в Firestore...');
      
      const docRef = await addDoc(collection(db, 'articles'), articleData);
      console.log('Статтю збережено в Firestore з ID:', docRef.id);

      // Зберігаємо в localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.push({
        ...articleData,
        id: docRef.id,
      });
      localStorage.setItem('posts', JSON.stringify(posts));
      console.log('Статтю збережено в localStorage');

      setLoading(false);
      navigate('/articles');
    } catch (err) {
      console.error('Помилка створення публікації:', err);
      setError(`Помилка: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <h1>Створити нову публікацію</h1>
      {error && <div className="error-message">{error}</div>}
      <PostForm onSubmit={handleSubmit} disabled={loading} />
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">Створення публікації...</div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;