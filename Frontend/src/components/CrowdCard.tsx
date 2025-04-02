import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

interface Zone {
  bar_id: number;
  zone_id: number;
  zone_name: string;
  zone_detail: string;
  max_people_in_zone: number;
  current_visitor_count: number;
  update_date_time: string;
  zone_time: number;
  zone_image: string;
}

interface Restaurant {
  restaurant_id: number;
  zone_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  restaurant_image: string;
  restaurant_rating: string;
  total_rating: number;
  total_reviews: number;
  current_visitor_count: number;
  update_date_time: string;
}

const CrowdCard: React.FC<Bar> = ({
  bar_id,
  bar_name,
  bar_location,
  bar_detail,
  max_people_in_bar,
  bar_rating,
  total_rating,
  total_reviews,
  bar_image,
}) => {
  const router = useRouter();
  const [currentVisitors, setCurrentVisitors] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const filledStars = Math.floor(bar_rating) || 0;
  const emptyStars = 5 - filledStars;

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const zonesRes = await fetch(
          `http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${bar_id}`
        );
        const zonesData = await zonesRes.json();

        let totalZoneVisitors = (zonesData.zones || []).reduce(
          (sum: number, zone: { current_visitor_count: number }) =>
            sum + zone.current_visitor_count,
          0
        );

        let totalRestaurantVisitors = 0;

        await Promise.all(
          zonesData.zones.map(async (zone: { zone_id: number }) => {
            const restaurantRes = await fetch(
              `http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${zone.zone_id}`
            );
            const restaurantData = await restaurantRes.json();

            totalRestaurantVisitors += (
              restaurantData.restaurants || []
            ).reduce(
              (sum: number, restaurant: { current_visitor_count?: number }) =>
                sum + (restaurant.current_visitor_count || 0),
              0
            );
          })
        );

        setCurrentVisitors(totalZoneVisitors + totalRestaurantVisitors);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/getBarImage/bar${bar_id}.png`
        );
        if (!response.ok) throw new Error("Failed to fetch image URL");

        const data = await response.json();
        console.log(data.url);
        setImageUrl(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchVisitorData();
  }, [bar_id]);

  return (
    <div className="bg-white hover:scale-110 duration-300  rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-100">
     
        {imageUrl ? (
          <img
            className="w-full h-40 object-cover rounded-md mb-4"
            src={imageUrl}
            alt=" Image"
            width="500"
          />
        ) : (
          <div>Loading image...</div>
        )}

      <div className="px-2 h-60 space-y-3 mt-3">
        <a href="#">
          <h5 className=" text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {bar_name}
          </h5>
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
          <div className=" text-xl">
            {currentVisitors} / {max_people_in_bar}
          </div>
        </div>
        <p className=" line-clamp-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          {bar_detail}
        </p>

        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400 ">
          <img src="/image/icons/location.svg" alt="location pin" />
          <p className="line-clamp-2">{bar_location}</p>
        </div>

        <div className="flex items-center mt-2.5 mb-5 space-x-2">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {[...Array(filledStars)].map((_, index) => (
              <svg
                key={index}
                className="w-4 h-4 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}

            {[...Array(emptyStars)].map((_, index) => (
              <svg
                key={filledStars + index}
                className="w-4 h-4 text-gray-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-3">
            {total_rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CrowdCard;
