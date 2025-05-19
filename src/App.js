import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Articles from './pages/Articles/Articles';
import CreatePost from './pages/CreatePost/CreatePost';
import MyPosts from './pages/MyPosts/MyPosts';
import Favorites from './pages/Favorites/Favorites';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { IMAGES } from './constants/images';
import './App.css';

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { currentUser, logout } = useAuth();

  const handleAuthToggle = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className="App">
      <header>
        <h1>Мій блог про подорожі</h1>
      </header>

      <nav>
        <Link to="/" className="nav-link">Головна</Link>
        <Link to="/articles" className="nav-link">Статті</Link>
        <Link to="/create-post" className="nav-link">Створити публікацію</Link>
        <Link to="/my-posts" className="nav-link">Мої публікації</Link>
        <Link to="/favorites" className="nav-link">Вподобані</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/articles" element={<Articles />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/" element={
            <div className="home-page">
              <section className="main-welcome-section">
                <img src={IMAGES.travel} alt="Гарний краєвид" className="main-travel-img" />
                <h2>Ласкаво просимо!</h2>
                <p>Це блог про подорожі, де ви знайдете цікаві статті та власні публікації.</p>
                <p>Мандрівки — це чудовий спосіб відкрити нові культури, познайомитися з цікавими людьми та побачити неймовірні місця.</p>
                <p>У нашому блозі ви знайдете поради щодо подорожей, огляди найцікавіших локацій та особисті історії мандрівників.</p>
                <p>Незалежно від того, чи любите ви екстремальні походи, пляжний відпочинок або культурні тури, тут знайдеться щось для кожного.</p>
                <p>Ми також ділимося корисними лайфхаками, які допоможуть зробити ваші подорожі комфортнішими та економнішими.</p>
                <p>Долучайтеся до нашої спільноти та діліться власними історіями про подорожі!</p>
                <Link to="/articles" className="cta-button">Переглянути статті</Link>
              </section>

              <section id="image-cards">
                <div className="card">
                  <img src={IMAGES.worldmap} alt="Карта світу" />
                  <p>Подорожі у будь-який куточок світу!</p>
                </div>
                <div className="card">
                  <img src={IMAGES.collage} alt="Туристичні пам'ятки" />
                  <p>Місця, які захоплюють подих!</p>
                </div>
                <div className="card">
                  <img src={IMAGES.hotel} alt="Готель" />
                  <p>Де можна відпочити після мандрівки.</p>
                </div>
              </section>
            </div>
          } />
        </Routes>
      </main>

      <footer>
        <p>Розроблено Святославом Пилищишином 2025 року</p>
        <p>Контакти: 098-97-12-819</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {currentUser ? (
            <>
              <button 
                className="cta-button" 
                onClick={logout}
              >
                Вийти
              </button>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Увійшли як {currentUser.email}</span>
            </>
          ) : (
            <button 
              className="cta-button" 
              onClick={() => {
                setShowAuthModal(true);
                setIsLoginForm(true);
              }}
            >
              Авторизація
            </button>
          )}
        </div>
      </footer>

      {showAuthModal && (
        isLoginForm ? (
          <Login 
            onToggleForm={handleAuthToggle} 
            onClose={() => setShowAuthModal(false)}
          />
        ) : (
          <Register 
            onToggleForm={handleAuthToggle} 
            onClose={() => setShowAuthModal(false)}
          />
        )
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
