import React from "react";
import RestaurantCard from "@/components/RestaurantCard";

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  total_rating: number;
  total_reviews: number;
  current_visitor_count: number;
  restaurant_image: string;
}

interface TopRestaurantProps {
  restaurants: Restaurant[];
}

const TopRestaurant: React.FC<TopRestaurantProps> = ({ restaurants }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Top Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.restaurant_id}
            restaurant_id={restaurant.restaurant_id}
            restaurant_name={restaurant.restaurant_name}
            restaurant_location={restaurant.restaurant_location}
            restaurant_detail={restaurant.restaurant_detail}
            total_rating={restaurant.total_rating}
            total_reviews={restaurant.total_reviews}
            current_visitor_count={restaurant.current_visitor_count}
            restaurant_image={restaurant.restaurant_image}
          />
        ))}
      </div>
    </div>
  );
};

export default TopRestaurant;
