import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import RestaurantCard from "./RestaurantCard";
import { useRouter } from "next/navigation";
import { IoIosWarning } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";

interface ZoneCardProps {
  zone_id: number;
  bar_id: number;
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
  restaurant_rating: number;
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

const ZoneCard: React.FC<ZoneCardProps> = ({
  zone_id,
  bar_id,
  zone_name,
  zone_detail,
  max_people_in_zone,
  current_visitor_count,
  update_date_time,
  zone_time,
  zone_image
}) => {
  const { user, role } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const router = useRouter();
  const navigateToReports = () => {
    router.push("/pages/report"); // เปลี่ยนเส้นทางไปที่หน้า /pages/report
  };

  useEffect(() => {
    if (role) {
      setUserRole(role);
    }
  }, [role]);


  const fetchBars = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/getZoneImage/zone${zone_id}.png`
      );
      if (!response.ok) throw new Error("Failed to fetch image URL");

      const data = await response.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("Error fetching image:", error);
    }

    try {
      // ดึงข้อมูลร้านอาหาร
      const getRestaurantsResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${zone_id}`
      );
      if (!getRestaurantsResponse.ok) {
        throw new Error("Failed to fetch restaurant data");
      }
      const restaurantsData = await getRestaurantsResponse.json();
      setRestaurants(restaurantsData.restaurants);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleDeleteRes = async (bar_id: number, bar_name: string) => {
    const confirmDelete = window.confirm(`Are you sure to delete Restaurant ${bar_id} : ${bar_name} ?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/deleteRestaurant/${bar_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBars();
      } else {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      console.error("Error deleting bar:", error);
    }
  };

  useEffect(() => {
    fetchBars();
  }, []);

  return (
    <div
      key={zone_id}
      className=""
    >
      {imageUrl ? (
        <img
          className="object-cover rounded-t-lg w-full max-h-60 absolute opacity-75"
          src={imageUrl}
          alt={zone_name}
          width="500"
        />
      ) : (
        <div>Loading image...</div>
      )}
      <div className="p-5 space-y-3 z-10 w-full">
        <div className="absolute w-full pr-10">
          {/* zone Name */}
          <a href="#">
            <h5 className="mb-2 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {zone_name}
            </h5>
          </a>

          {/* zone Location */}
          <div className="flex space-x-2 text-xl text-gray-900 mb-4 mt-4">
            <svg fill="#000000" width="25px" height="25px" viewBox="-3 0 19 19" xmlns="http://www.w3.org/2000/svg" className="cf-icon-svg mt-0.5"><path d="M12.517 12.834v1.9a1.27 1.27 0 0 1-1.267 1.267h-9.5a1.27 1.27 0 0 1-1.267-1.267v-1.9A3.176 3.176 0 0 1 3.65 9.667h5.7a3.176 3.176 0 0 1 3.167 3.167zM3.264 5.48A3.236 3.236 0 1 1 6.5 8.717a3.236 3.236 0 0 1-3.236-3.236z" /></svg>

            <div className="flex space-x-1 font-bold">
              <div>{current_visitor_count} / </div>
              <div>{max_people_in_zone}</div>
            </div>

          </div>

          {/* zone Details */}
          <div className=" text-sm text-gray-900 font-bold">
            {zone_detail}
          </div>

          <div className="text-md text-gray-900 font-bold">Time : {zone_time}</div>

          {/* <div className="flex items-center text-sm mt-2.5 mb-5 space-x-2 text-gray-700">
          <div>เวลาที่เปิดให้ปริการ: </div>
          <div>{zone_time}</div>
        </div> */}

          {/* <div className="flex justify-end">
          <div onClick={() => handleDelete(zone_id, zone_name)}>
            <MdDeleteForever className="text-red-600 w-6 h-6 cursor-pointer" />
          </div>
        </div> */}
          {user ? (
            <div className="flex justify-end">
              <button
                onClick={navigateToReports}
                className="flex bg-red-600 duration-200 rounded-lg px-3 py-2 text-md text-white font-bold hover:bg-yellow-200 hover:text-red-600"
              >
                <IoIosWarning className="mt-0.5 mr-2 w-5 h-5" />
                Report
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 p-2 pt-60">
          {restaurants &&
            Array.isArray(restaurants) &&
            restaurants.map((restaurant) => (
              <div
                key={restaurant.restaurant_id}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-105 duration-300"
              >
                <div
                  onClick={() =>
                    router.push(
                      `/pages/recommend/restaurant/${restaurant.restaurant_id}`
                    )
                  }
                >
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
                </div>
                {userRole === "admin" && (
                  <div className="flex justify-end bg-white ">
                    <div onClick={() => handleDeleteRes(restaurant.restaurant_id, restaurant.restaurant_name)}>
                      <MdDeleteForever className="text-red-600 w-6 h-6 cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
