import React from "react";

interface RestaurantCardProps {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  total_rating: number;
  total_reviews: number;
  restaurant_image: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant_id,
  restaurant_name,
  restaurant_location,
  restaurant_detail,
  total_rating,
  total_reviews,
  restaurant_image,
}) => {
  return (
    <div
      key={restaurant_id}
      className="max-w-sm w-60 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="h-48">
        <img
          className="rounded-t-lg h-full w-full"
          src={`/image/restaurantImages/${restaurant_image}`}
          alt="{restaurant_name}"
        />
      </div>
      <div className="p-5 h-60">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {restaurant_name}
          </h5>
        </a>
        <p className="mb-3 text-sm font-normal text-gray-500 dark:text-gray-400">
          {restaurant_detail}
        </p>

        {/* Restaurant Location */}
        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400 ">
          <img src="/image/icons/location.svg" alt="location pin" />
          <p>{restaurant_location}</p>
        </div>

        {/* Restaurant Score */}
        <div className="flex items-center mt-2.5 mb-5 space-x-2">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <svg
              className="w-4 h-4 text-yellow-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            {/* Repeat SVGs for stars as needed */}
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ms-3">
            {total_rating}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            ({total_reviews} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
