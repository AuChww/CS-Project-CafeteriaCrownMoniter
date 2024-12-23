import React from "react";

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  total_rating: number;
  total_reviews: number;
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
          <div
            key={restaurant.restaurant_id}
            className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2">{restaurant.restaurant_name}</h2>
            {restaurant.restaurant_image && (
              <img
                src={restaurant.restaurant_image}
                alt={restaurant.restaurant_name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-sm text-gray-600 mb-2">Location: {restaurant.restaurant_location}</p>
            <p className="text-sm text-gray-600 mb-2">Details: {restaurant.restaurant_detail}</p>
            <p className="text-sm text-gray-600">
              Rating: {restaurant.total_rating} ({restaurant.total_reviews} reviews)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRestaurant;
