import React from "react";

interface RestaurantProps {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  total_rating: number;
  total_reviews: number;
  restaurant_image: string;
}

interface BarProps {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  bar_detail: string;
  total_rating: number;
  total_reviews: number;
  bar_image: string;
}

interface BarAndRestaurantCardProps {
  bars: BarProps[];
  restaurants: RestaurantProps[];
}

const RestaurantCard: React.FC<BarAndRestaurantCardProps> = ({
  bars,
  restaurants,
}) => {
  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
      {bars.map((bar) => (
        <div key={bar.bar_id} className="mb-6">
          <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
            {bar.bar_name}
          </h5>
          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {bar.bar_detail}
          </div>
          <ul className="my-4 space-y-3">
            {restaurants.map((restaurant) => (
              <li key={restaurant.restaurant_id}>
                <a
                  href="#"
                  className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {restaurant.restaurant_name}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-3">
                    {restaurant.total_rating}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RestaurantCard;
