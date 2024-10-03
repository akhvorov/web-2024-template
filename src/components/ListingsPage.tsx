import React, { useState, useEffect } from 'react';
import { collection, getDocs, Firestore } from 'firebase/firestore';
import ErrorDisplay from './ErrorDisplay';

interface ListingsPageProps {
  db: Firestore;
}

interface Listing {
  id: string;
  title: string;
  description: string;
}

const ListingsPage: React.FC<ListingsPageProps> = ({ db }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('ListingsPage компонент смонтирован');
    const fetchListings = async () => {
      console.log('Начало загрузки объявлений');
      setIsLoading(true);
      try {
        const listingsCollection = collection(db, 'listings');
        const listingsSnapshot = await getDocs(listingsCollection);
        const listingsData = listingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Listing[];
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

    fetchListings();
  }, [db]);

  console.log('Рендеринг ListingsPage', { isLoading, error, listingsCount: listings.length });

  if (isLoading) {
    return <p>Загрузка объявлений...</p>;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div>
      <h1>Объявления</h1>
      {listings.length === 0 ? (
        <p>Нет доступных объявлений.</p>
      ) : (
        listings.map(listing => (
          <div key={listing.id}>
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ListingsPage;