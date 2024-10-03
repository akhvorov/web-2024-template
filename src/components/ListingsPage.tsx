import { useState, useEffect } from "react";
import { collection, onSnapshot, Firestore, query, orderBy } from "firebase/firestore";
import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

interface Listing {
  id: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  contact: string;
}

interface ListingsPageProps {
  db: Firestore;
}

function ListingsPage({ db }: ListingsPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const listingsRef = collection(db, "listings");
    const q = query(listingsRef, orderBy("createdAt", "desc")); // Сортировка по дате создания

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedListings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      setListings(updatedListings);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <Grid container spacing={3}>
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
  );
}

export default ListingsPage;