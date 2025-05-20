import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = ({ onToggleForm, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithFacebook, resetPassword } = useAuth();

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

  const handleFacebookLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithFacebook();
      onClose();
    } catch (error) {
      setError('Помилка входу через Facebook: ' + error.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Будь ласка, введіть вашу електронну пошту');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      alert('Лист для скидання пароля надіслано на вашу пошту');
    } catch (error) {
      setError('Помилка при скиданні пароля: ' + error.message);
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
      <div className="auth-form">
        <h2>Вхід</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>
        <button onClick={handleFacebookLogin} disabled={loading}>
          Увійти через Facebook
        </button>
        <button onClick={handleForgotPassword} disabled={loading}>
          Забули пароль?
        </button>
        <p>
          Немає облікового запису?{' '}
          <button onClick={onToggleForm}>Зареєструватися</button>
        </p>
      </div>
    </div>
  );
};

export default Login; 