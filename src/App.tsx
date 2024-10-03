import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Header from './components/Header';
import ListingsPage from './components/ListingsPage';
import AddListingPage from './components/AddListingPage';
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
  return (
    <Router>
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<ListingsPage db={db} />} />
          <Route path="/add" element={<AddListingPage db={db} />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
