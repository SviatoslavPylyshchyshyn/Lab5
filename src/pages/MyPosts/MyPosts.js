import React, { useState, useEffect } from 'react';
import './MyPosts.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Завантажуємо публікації з localStorage
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(savedPosts.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  if (posts.length === 0) {
    return (
      <div className="my-posts-page">
        <h1>Мої публікації</h1>
        <p className="no-posts">У вас ще немає публікацій</p>
      </div>
    );
  }

  return (
    <div className="my-posts-page">
      <h1>Мої публікації</h1>
      <div className="posts-grid">
        {posts.map(post => (
          <article key={post.id} className="post-card">
            <h3>{post.title}</h3>
            {post.image && (
              <img src={post.image} alt={post.title} />
            )}
            <p className="content">{post.content}</p>
            <p className="date">
              Дата публікації: {new Date(post.date).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MyPosts; 