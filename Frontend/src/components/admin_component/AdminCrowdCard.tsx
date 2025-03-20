import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EditBar from "@/components/admin_component/bar_button/editBar";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";

interface CrowdCardProps {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  max_people_in_bar: number;
  bar_image: string;
  bar_detail: string;
}

const AdminCrowdCard: React.FC<CrowdCardProps> = ({
  bar_id,
  bar_name,
  bar_location,
  max_people_in_bar,
  bar_image,
  bar_detail,
}) => {
  const router = useRouter();
  const [currentVisitors, setCurrentVisitors] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
        setImageUrl(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchVisitorData();
  }, [bar_id]);

  return (
    <>
      <div onClick={() => router.push(`/pages/recommend/bar/${bar_id}`)}>
        {imageUrl ? (
          <img
            className=" w-auto h-30 object-cover rounded-t-lg "
            src={imageUrl}
            alt=" Image"
          />
        ) : (
          <div>Loading image...</div>
        )}

        <div className="px-2 justify-between mt-4">
          <a href="#">
            <h5 className=" text-sm font-bold tracking-tight text-gray-900 dark:text-white">
              {bar_name.length > 20 ? `${bar_name.slice(0, 20)}...` : bar_name}
            </h5>
          </a>
          <div className="mt-2 flex text-center  ">
            <div className=" mr-2 text-md ">visitor :</div>
            <div className=" text-md">
              {currentVisitors} / {max_people_in_bar}
            </div>
          </div>

          <div className="flex items-center mt-2 space-x-2">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <svg
                className="w-3 h-3 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-3 h-3 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-3 h-3 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-3 h-3 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-3 h-3 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCrowdCard;
