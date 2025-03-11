"use client";
import RestaurantCard from "@/components/RestaurantCard";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaFireAlt } from "react-icons/fa";

interface Restaurant {
  restaurant_id: number;
  zone_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  restaurant_image: string;
  total_rating: number;
  total_reviews: number;
  current_visitor_count: number;
  update_date_time: string;
}

const TopRestaurant: React.FC = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/getAllRestaurants");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: { restaurants: Restaurant[] } = await response.json();

        const sortedRestaurants = data.restaurants.sort(
          (a, b) => b.total_rating - a.total_rating || b.total_reviews - a.total_reviews
        );

        setRestaurants(sortedRestaurants);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-500">Top Restaurants</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto mb-8">
          <div className="flex gap-6">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant.restaurant_id}
                onClick={() => router.push(`/pages/recommend/restaurant/${restaurant.restaurant_id}`)}
                className="relative w-60"
              >
                {index < 3 && (
                  <div className="absolute flex top-2 right-2 bg-gradient-to-r
                            from-orange-500
                            via-red-600
                            to-red-800  text-white text-xs py-1 px-2 rounded-full">
                    <div>
                      Popular
                    </div>
                    <div>
                      <FaFireAlt className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                )}

                <RestaurantCard
                  key={restaurant.restaurant_id}
                  restaurant_id={restaurant.restaurant_id}
                  zone_id={restaurant.zone_id}
                  restaurant_name={restaurant.restaurant_name}
                  restaurant_location={restaurant.restaurant_location}
                  restaurant_detail={restaurant.restaurant_detail}
                  restaurant_image={restaurant.restaurant_image}
                  total_rating={restaurant.total_rating}
                  total_reviews={restaurant.total_reviews}
                  current_visitor_count={restaurant.current_visitor_count}
                  update_date_time={restaurant.update_date_time}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopRestaurant;
