import React from "react";
import BarAndRestaurant from "@/components/BarAndRestaurant";

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
  total_rating: number;
}

interface BarDetailProps {
  bars: Bar[];
  restaurants: Restaurant[];
}

const AllBar: React.FC<BarDetailProps> = ({ bars, restaurants }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Bars and Nearby Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bars.map((bar) => (
          <div
            key={bar.bar_id}
            className="bg-gray-50 rounded-lg shadow-lg p-4 border border-gray-300"
          >
            <h2 className="text-xl font-semibold mb-2">{bar.bar_name}</h2>
            {bar.bar_image && (
              <img
                src={bar.bar_image}
                alt={bar.bar_name}
                className="w-full h-32 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-sm text-gray-600 mb-2">Location: {bar.bar_location}</p>
            <p className="text-sm text-gray-600 mb-4">Details: {bar.bar_detail}</p>
            <h3 className="text-lg font-semibold">Nearby Restaurants</h3>
            <ul className="space-y-2">
              {restaurants.slice(0, 3).map((restaurant) => (
                <li
                  key={restaurant.restaurant_id}
                  className="bg-white p-2 rounded-md shadow-sm border border-gray-200"
                >
                  <h4 className="text-sm font-medium">{restaurant.restaurant_name}</h4>
                  <p className="text-xs text-gray-500">Rating: {restaurant.total_rating}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBar;
