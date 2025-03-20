import React from "react";
import RestaurantCard from "@/components/RestaurantCard";

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
            zone_id={restaurant.zone_id}
            restaurant_name={restaurant.restaurant_name}
            restaurant_location={restaurant.restaurant_location}
            restaurant_detail={restaurant.restaurant_detail}
            restaurant_rating={restaurant.restaurant_rating}
            total_rating={restaurant.total_rating}
            total_reviews={restaurant.total_reviews}
            restaurant_image={restaurant.restaurant_image}
            current_visitor_count={restaurant.current_visitor_count}
            update_date_time={restaurant.update_date_time}
          />
        ))}
      </div>
    </div>
  );
};

export default TopRestaurant;
