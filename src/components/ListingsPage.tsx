import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, Firestore } from 'firebase/firestore';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddIcon from '@mui/icons-material/Add';
import ErrorDisplay from './ErrorDisplay';

interface ListingsPageProps {
  db: Firestore;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  city: string;
  country: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  photos: string[];
}

const ListingsPage: React.FC<ListingsPageProps> = ({ db }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newListing, setNewListing] = useState<Omit<Listing, 'id'>>({
    title: '',
    description: '',
    city: '',
    country: '',
    dateRange: {
      start: new Date(),
      end: new Date(),
    },
    photos: [],
  });

  useEffect(() => {
    fetchListings();
  }, [db]);

  const fetchListings = async () => {
    console.log('Начало загрузки объявлений');
    setIsLoading(true);
    try {
      const listingsCollection = collection(db, 'listings');
      const listingsSnapshot = await getDocs(listingsCollection);
      const listingsData = listingsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateRange: {
            start: data.dateRange?.start ? data.dateRange.start.toDate() : new Date(),
            end: data.dateRange?.end ? data.dateRange.end.toDate() : new Date(),
          },
        };
      }) as Listing[];
      console.log('Объявления загружены:', listingsData);
      setListings(listingsData);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке объявлений:', error);
      setError('Произошла ошибка при загрузке объявлений. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
      console.log('Загрузка объявлений завершена');
    }
  };

  const handleAddListing = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setNewListing({
      title: '',
      description: '',
      city: '',
      country: '',
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      photos: [],
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewListing(prev => ({ ...prev, [name]: value }));
  };

  const handleStartDateChange = (date: Date | null) => {
    setNewListing(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        start: date || new Date(),
      },
    }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setNewListing(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        end: date || new Date(),
      },
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      setNewListing(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const handleSubmitNewListing = async () => {
    try {
      const listingsCollection = collection(db, 'listings');
      await addDoc(listingsCollection, newListing);
      console.log('Новое объявление добавлено');
      handleCloseDialog();
      fetchListings(); // Обновляем список объявлений
    } catch (error) {
      console.error('Ошибка при добавлении объявления:', error);
      setError('Произошла ошибка при добавлении объявления. Пожалуйста, попробуйте позже.');
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Объявления
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        onClick={handleAddListing}
        sx={{ mb: 3 }}
      >
        Добавить новое объявление
      </Button>
      {listings.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Нет доступных объявлений.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {listings.map(listing => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {listing.photos && listing.photos.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={listing.photos[0]}
                    alt={listing.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {listing.city}, {listing.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {listing.dateRange.start.toLocaleDateString()} - {listing.dateRange.end.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={isAddDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Добавить новое объявление</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Заголовок"
            type="text"
            fullWidth
            variant="outlined"
            value={newListing.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Описание"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newListing.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="Город"
            type="text"
            fullWidth
            variant="outlined"
            value={newListing.city}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="country"
            label="Страна"
            type="text"
            fullWidth
            variant="outlined"
            value={newListing.country}
            onChange={handleInputChange}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <DatePicker
              selected={newListing.dateRange.start}
              onChange={handleStartDateChange}
              selectsStart
              startDate={newListing.dateRange.start}
              endDate={newListing.dateRange.end}
              placeholderText="Дата начала"
            />
            <DatePicker
              selected={newListing.dateRange.end}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={newListing.dateRange.start}
              endDate={newListing.dateRange.end}
              minDate={newListing.dateRange.start}
              placeholderText="Дата окончания"
            />
          </Box>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Загрузить фотографии
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmitNewListing} variant="contained" color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListingsPage;