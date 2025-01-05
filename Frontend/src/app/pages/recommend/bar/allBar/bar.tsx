"use client";
import React, { useEffect, useState } from "react";
import AllBar from './allBar';

interface Bar {
    bar_id: number;
    bar_name: string;
    bar_location: string;
    bar_detail: string;
    total_rating: number;
    total_reviews: number;
    bar_image: string;
  }
  
  interface Restaurant {
    restaurant_id: number;
    restaurant_name: string;
    restaurant_location: string;
    restaurant_detail: string;
    total_rating: number;
    total_reviews: number;
    restaurant_image: string;
  }

const BarPage: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barsResponse = await fetch("http://127.0.0.1:8000/api/v1/getAllBars");
        const restaurantsResponse = await fetch("http://127.0.0.1:8000/api/v1/getAllRestaurants");

        if (!barsResponse.ok || !restaurantsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const barsData: { bars: Bar[] } = await barsResponse.json();
        const restaurantsData: { restaurants: Restaurant[] } = await restaurantsResponse.json();

        const sortedBars = barsData.bars.sort(
          (a, b) => b.total_rating - a.total_rating || b.total_reviews - a.total_reviews
        );

        const sortedRestaurants = restaurantsData.restaurants.sort(
          (a, b) => b.total_rating - a.total_rating || b.total_reviews - a.total_reviews
        );

        setBars(sortedBars);
        setRestaurants(sortedRestaurants);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <AllBar bars={bars} restaurants={restaurants} />
    </div>
  );
};

export default BarPage;
