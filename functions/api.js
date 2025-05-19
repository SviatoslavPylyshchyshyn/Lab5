const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } = require('firebase/firestore');

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

exports.handler = async function(event, context) {
  // Налаштування CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Обробка OPTIONS запиту для CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api/', '');
    const segments = path.split('/');

    // GET /api/favorites/:userId
    if (event.httpMethod === 'GET' && segments[0] === 'favorites') {
      const userId = segments[1];
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
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(favorites)
      };
    }

    // POST /api/favorites
    if (event.httpMethod === 'POST' && segments[0] === 'favorites') {
      const { userId, articleId, articleTitle, articleImage } = JSON.parse(event.body);

      // Перевірка на дублікати
      const favoritesRef = collection(db, 'favorites');
      const q = query(
        favoritesRef,
        where('userId', '==', userId),
        where('articleId', '==', articleId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Стаття вже додана до вподобаних' })
        };
      }

      const newFavorite = {
        userId,
        articleId,
        articleTitle,
        articleImage,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(favoritesRef, newFavorite);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ id: docRef.id, ...newFavorite })
      };
    }

    // DELETE /api/favorites/:favoriteId
    if (event.httpMethod === 'DELETE' && segments[0] === 'favorites') {
      const favoriteId = segments[1];
      const favoriteRef = doc(db, 'favorites', favoriteId);
      await deleteDoc(favoriteRef);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Статтю видалено з вподобаних' })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not Found' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 