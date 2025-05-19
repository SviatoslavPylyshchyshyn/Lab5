const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc } = require('firebase/firestore');

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBexI_OMBQiG25hWecLbLgj_m-7W5T0zeI",
  authDomain: "lab-4-924b3.firebaseapp.com",
  projectId: "lab-4-924b3",
  storageBucket: "lab-4-924b3.appspot.com",
  messagingSenderId: "789007215932",
  appId: "1:789007215932:web:b0387b019585b7f791c239",
  measurementId: "G-P6XLNXYGY0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// GET - отримання всіх вподобаних статей користувача
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Помилка при отриманні вподобаних статей' });
  }
});

// POST - додавання статті до вподобаних
app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, articleId, articleTitle, articleImage } = req.body;

    // Перевірка чи вже існує вподобана стаття
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('articleId', '==', articleId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(400).json({ error: 'Стаття вже додана до вподобаних' });
    }

    // Додавання нової вподобаної статті
    const newFavorite = {
      userId,
      articleId,
      articleTitle,
      articleImage,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(favoritesRef, newFavorite);
    res.status(201).json({ id: docRef.id, ...newFavorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Помилка при додаванні статті до вподобаних' });
  }
});

// DELETE - видалення статті з вподобаних
app.delete('/api/favorites/:favoriteId', async (req, res) => {
  try {
    const { favoriteId } = req.params;
    const favoriteRef = doc(db, 'favorites', favoriteId);
    await deleteDoc(favoriteRef);
    res.status(200).json({ message: 'Статтю видалено з вподобаних' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Помилка при видаленні статті з вподобаних' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

