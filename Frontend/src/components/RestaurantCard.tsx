import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

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

function renderStars(totalRating: number) {
  const fullStars = Math.floor(totalRating);
  const halfStars = totalRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg
        key={`full-${i}`}
        className="w-4 h-4 text-yellow-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );
  }

  if (halfStars) {
    stars.push(
      <svg
        key="half"
        className="w-4 h-4 text-yellow-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <defs>
          <linearGradient id="half-star" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#E5E7EB" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-star)"
          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
        />
      </svg>
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg
        key={`empty-${i}`}
        className="w-4 h-4 text-gray-200 dark:text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );
  }

  return stars;
}

const RestaurantCard: React.FC<Restaurant> = ({
  restaurant_id,
  zone_id,
  restaurant_name,
  restaurant_location,
  restaurant_detail,
  restaurant_image,
  total_rating,
  total_reviews,
  current_visitor_count,
  update_date_time
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/getRestaurantImage/restaurant${restaurant_id}.png`
        );
        if (!response.ok) throw new Error("Failed to fetch image URL");

        const data = await response.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchBars();
  }, []);
  return (
    <div
      key={restaurant_id}
      className="max-w-sm w-60 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-105 duration-300"
    >
      {/* Image Section */}
      <a href="#">
        {imageUrl ? (
          <img
            className="rounded-t-lg w-full max-h-60 object-cover"
            src={imageUrl}
            alt={restaurant_name}
            width="500"
          />
        ) : (
          <div className="w-full max-h-60 bg-gray-300 flex items-center justify-center text-gray-600 rounded-t-lg">
            Loading image...
          </div>
        )}
      </a>

      <div className="p-5">
        {/* Restaurant Name */}
        <a href="#">
          <h5 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-500 transition-colors duration-200">
            {restaurant_name}
          </h5>
        </a>

        {/* Visitor Count */}
        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400 ">
          <svg fill="#000000" width="25px" height="25px" viewBox="-3 0 19 19" xmlns="http://www.w3.org/2000/svg" className="cf-icon-svg"><path d="M12.517 12.834v1.9a1.27 1.27 0 0 1-1.267 1.267h-9.5a1.27 1.27 0 0 1-1.267-1.267v-1.9A3.176 3.176 0 0 1 3.65 9.667h5.7a3.176 3.176 0 0 1 3.167 3.167zM3.264 5.48A3.236 3.236 0 1 1 6.5 8.717a3.236 3.236 0 0 1-3.236-3.236z" /></svg>

          <div className="flex space-x-1 text-base">
            <div>{current_visitor_count}</div>
          </div>

        </div>

        {/* Restaurant Detail */}
        <div className="mb-3 text-sm font-light text-gray-600 dark:text-gray-400">
          {restaurant_detail}
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <img src="/image/icons/location.svg" alt="location pin" className="w-4 h-4" />
          <div>{restaurant_location}</div>
        </div>

        {/* Rating Section */}
        <div className="flex items-center mt-3 mb-5 space-x-2">
          {/* Stars */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {renderStars(total_rating)}

            {/* Rating Value */}
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-3">
              {total_rating}
            </span>

            {/* Reviews Count */}
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              ({total_reviews} reviews)
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <MdEdit className='text-gray-600 w-6 h-6' />
          <MdDeleteForever className='text-red-600 w-6 h-6' />
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
