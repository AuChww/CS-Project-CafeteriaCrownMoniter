import React, { useEffect, useState } from "react";

interface BarCardProps {
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
  current_visitor_count: number;
  restaurant_image: string;
}

const BarCard: React.FC<BarCardProps> = ({
  bar_id,
  bar_name,
  bar_location,
  bar_detail,
  total_rating,
  total_reviews,
  bar_image,
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/getRestaurantId/${bar_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }
        const data: Restaurant[] = await response.json(); // รับค่ามาเป็นอาร์เรย์
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurants();
  }, [bar_id]);

  // คำนวณยอดรวมของ current_visitor_count
  const totalVisitors = restaurants?.length
  ? restaurants.reduce((sum, restaurant) => sum + restaurant.current_visitor_count, 0)
  : 0;


  return (
    <div
      key={bar_id}
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <a href="#">
        <img
          className="rounded-t-lg h-full w-full"
          src={`/image/barImages/${bar_image}`}
          alt={bar_name}
        />
      </a>

      <div className="p-5">
        <a href="#">
          <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {bar_name}
          </div>
        </a>

        <div className="mt-2 flex space-x-2 ">
          <svg
            fill="#000000"
            width="25px"
            height="25px"
            viewBox="-3 0 19 19"
            xmlns="http://www.w3.org/2000/svg"
            className="cf-icon-svg"
          >
            <path d="M12.517 12.834v1.9a1.27 1.27 0 0 1-1.267 1.267h-9.5a1.27 1.27 0 0 1-1.267-1.267v-1.9A3.176 3.176 0 0 1 3.65 9.667h5.7a3.176 3.176 0 0 1 3.167 3.167zM3.264 5.48A3.236 3.236 0 1 1 6.5 8.717a3.236 3.236 0 0 1-3.236-3.236z" />
          </svg>
          <div className=" text-xl">{totalVisitors}</div>
        </div>

        <div className="mb-3 text-sm font-normal text-gray-500 dark:text-gray-400">
          {bar_detail}
        </div>

        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400 ">
          <img src="/image/icons/location.svg" alt="location pin" />
          <p>{bar_location}</p>
        </div>

        <div className="flex items-center mt-2.5 mb-5 space-x-2">
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

export default BarCard;
