import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Firestore, serverTimestamp } from "firebase/firestore";
import { TextField, Button, Grid, Typography } from "@mui/material";
import styled from "styled-components";

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
  }
`;

interface AddListingPageProps {
  db: Firestore;
}

function AddListingPage({ db }: AddListingPageProps) {
  const navigate = useNavigate();
  const [newListing, setNewListing] = useState({
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    contact: "",
  });

  const handleAddListing = async () => {
    if (newListing.description.trim() !== "") {
      try {
        await addDoc(collection(db, "listings"), {
          ...newListing,
          createdAt: serverTimestamp() // Добавляем временную метку
        });
        navigate('/'); // Перенаправляем на главную страницу после добавления
      } catch (error) {
        console.error("Ошибка при добавлении объявления:", error);
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Добавить новое объявление
        </Typography>
      </Grid>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <StyledButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddListing}
        >
          Добавить объявление
        </StyledButton>
      </Grid>
    </Grid>
  );
}

export default AddListingPage;