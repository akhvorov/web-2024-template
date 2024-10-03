import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Header from './components/Header';
import ListingsPage from './components/ListingsPage';
import { firebaseConfig } from './firebaseConfig';

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

function App() {
  console.log('Рендеринг App компонента');
  return (
    <Router>
      <AppContainer>
        <Header />
        <ListingsPage db={db} />
      </AppContainer>
    </Router>
  );
}

export default App;
