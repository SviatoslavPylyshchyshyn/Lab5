import React, { useState } from 'react';
import './PostForm.css';

const PostForm = ({ onSubmit, disabled }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Функція для стиснення зображення
  const compressImage = (imageData, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Зменшуємо розміри, зберігаючи пропорції
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертуємо в JPEG з якістю 0.7 (70%)
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            imageData: reader.result
          }));
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Створити нову публікацію</h2>
      
      <div className="form-group">
        <label htmlFor="title">Заголовок:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Текст:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Зображення:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Попередній перегляд" />
          </div>
        )}
      </div>

      <button type="submit" disabled={disabled}>
        {disabled ? 'Створення...' : 'Опублікувати'}
      </button>
    </form>
  );
};

export default PostForm;