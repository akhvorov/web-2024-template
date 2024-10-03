import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";

// Конфигурация Firebase (замените на свои данные)
const firebaseConfig = {
  apiKey: "AIzaSyCHPBZoJ8ziWW416y4E62SEXB--uirW9aM",
  authDomain: "flatsharing-3593f.firebaseapp.com",
  projectId: "flatsharing-3593f",
  storageBucket: "flatsharing-3593f.appspot.com",
  messagingSenderId: "245652534206",
  appId: "1:245652534206:web:b7baa63d7b4713f889bfef",
  measurementId: "G-C88T531LK5"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Listing {
  id: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  contact: string;
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
  }
`;

function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [newListing, setNewListing] = useState<Omit<Listing, "id">>({
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    contact: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "listings"), (snapshot) => {
      const updatedListings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      setListings(updatedListings);
    });

    return () => unsubscribe();
  }, []);

  const handleAddListing = async () => {
    if (newListing.description.trim() !== "") {
      try {
        await addDoc(collection(db, "listings"), newListing);
        setNewListing({
          description: "",
          imageUrl: "",
          startDate: "",
          endDate: "",
          contact: "",
        });
      } catch (error) {
        console.error("Ошибка при добавлении объявления:", error);
      }
    }
  };

  return (
    <AppContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Объявления о сдаче квартир в саблет
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Описание"
            value={newListing.description}
            onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="URL изображения"
            value={newListing.imageUrl}
            onChange={(e) => setNewListing({ ...newListing, imageUrl: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Дата начала"
            type="date"
            value={newListing.startDate}
            onChange={(e) => setNewListing({ ...newListing, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Дата окончания"
            type="date"
            value={newListing.endDate}
            onChange={(e) => setNewListing({ ...newListing, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Контактная информация"
            value={newListing.contact}
            onChange={(e) => setNewListing({ ...newListing, contact: e.target.value })}
          />
        </Grid>
      </Grid>
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddListing}
      >
        Добавить объявление
      </StyledButton>
      <Grid container spacing={3} style={{ marginTop: '2rem' }}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={listing.imageUrl}
                alt={listing.description}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {listing.description}
                </Typography>
                <Typography variant="body2">
                  Даты: {listing.startDate} - {listing.endDate}
                </Typography>
                <Typography variant="body2">
                  Контакты: {listing.contact}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AppContainer>
  );
}

export default App;
