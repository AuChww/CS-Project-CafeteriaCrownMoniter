// pages/recomment/restaurant/[id].tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// types.ts (ไฟล์ประกาศประเภทข้อมูล)
export interface Restaurant {
  id: number;
  name: string;
  description: string;
  rating: number;
  location: string;
  category: string;
}

export interface Bar {
  id: number;
  name: string;
  description: string;
  rating: number;
  location: string;
}


const RestaurantPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRestaurantDetails = async () => {
        try {
          const response = await fetch('http://localhost:8000/restaurant/top-rated');
          if (response.ok) {
            const data: Restaurant = await response.json();
            setRestaurant(data);
          } else {
            console.error('Failed to fetch restaurant details');
          }
        } catch (error) {
          console.error('Error fetching restaurant details:', error);
        }
      };

      fetchRestaurantDetails();
    }
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      <p>Rating: {restaurant.rating}</p>
      <p>Location: {restaurant.location}</p>
    </div>
  );
};

export default RestaurantPage;
