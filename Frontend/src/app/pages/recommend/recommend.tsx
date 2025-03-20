"use client";
import React, { useEffect, useState } from "react";
import AllBar from "./bar/allBar/allBar"

interface Bar {
  bar_id: number;
  bar_name: string;
  max_people_in_bar: number;
  bar_detail: string;
  bar_image: string;
  bar_location: string;
  bar_rating: number;
  total_rating: number;
  total_reviews: number;
}

interface Restaurant {
  restaurant_id: number;
  zone_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  restaurant_image: string;
  restaurant_rating: number;
  total_rating: number;
  total_reviews: number;
  current_visitor_count: number;
  update_date_time: string;
}

const RecommendPage: React.FC = () => {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <AllBar bars={bars} restaurants={restaurants} />
    </div>
  );
};

export default RecommendPage;
