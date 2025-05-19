import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Register = ({ onToggleForm, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Паролі не співпадають');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      onClose();
    } catch (error) {
      setError('Помилка реєстрації: ' + error.message);
    }
    setLoading(false);
  };

  const handleContainerClick = (e) => {
    if (e.target.className === 'auth-container') {
      onClose();
    }
  };

  return (
    <div className="auth-container" onClick={handleContainerClick}>
      <form onSubmit={handleSubmit} className="auth-form">
        <button type="button" className="close-button" onClick={onClose}>×</button>
        <h2>Реєстрація</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Електронна пошта</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Підтвердження паролю</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-links">
          <p>
            Вже маєте акаунт?{' '}
            <span className="auth-link" onClick={onToggleForm}>
              Увійти
            </span>
          </p>
        </div>
        <button type="submit" className="cta-button" disabled={loading}>
          {loading ? 'Завантаження...' : 'Зареєструватися'}
        </button>
      </form>
    </div>
  );
};

export default Register; 