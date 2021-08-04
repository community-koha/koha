import React from 'react';
import NavBar from './app/screens/NavBar';

import firebase from 'firebase/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnqlnigTMTCV4TFnCpxL2FIJPaSsDcOrI",
  authDomain: "communitykohaapp.firebaseapp.com",
  databaseURL: "https://communitykohaapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "communitykohaapp",
  storageBucket: "communitykohaapp.appspot.com",
  messagingSenderId: "244543529302",
  appId: "1:244543529302:web:b77ef4eebaf2ab34e7f6f7",
  measurementId: "G-2F9MTCXW75"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default function App() {
  return (
      <NavBar />
  );
}