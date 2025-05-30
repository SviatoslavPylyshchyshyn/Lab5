import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import './Auth.css';

const auth = getAuth();

const Login = ({ onToggleForm, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      onClose();
    } catch (error) {
      setError('Помилка входу: ' + error.message);
    }
    setLoading(false);
  };

  const handleContainerClick = (e) => {
    if (e.target.className === 'auth-container') {
      onClose();
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Будь ласка, введіть вашу електронну пошту для скидання паролю.');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(getAuth(), email);
      alert('Лист для скидання паролю надіслано на вашу електронну пошту.');
    } catch (error) {
      alert('Помилка при скиданні паролю: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" onClick={handleContainerClick}>
      <form onSubmit={handleSubmit} className="auth-form">
        <button type="button" className="close-button" onClick={onClose}>×</button>
        <h2>Вхід</h2>
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
        <div className="auth-links">
          <p>
            Ще не зареєстровані?{' '}
            <span className="auth-link" onClick={onToggleForm}>
              Реєстрація
            </span>
          </p>
          <p>
            <span className="auth-link" onClick={handleForgotPassword}>
              Забули пароль?
            </span>
          </p>
        </div>
        <button type="submit" className="cta-button" disabled={loading}>
          {loading ? 'Завантаження...' : 'Увійти'}
        </button>
      </form>
    </div>
  );
};

export default Login; 