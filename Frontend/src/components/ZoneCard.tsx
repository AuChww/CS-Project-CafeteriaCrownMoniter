import React, {useEffect, useState} from "react";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
    useEffect(() => {
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
      };
  
      fetchBars();
    }, []);

  return (
    <div
      key={zone_id}
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 "
    >
      {/* <img
          className="rounded-t-lg w-full max-h-60"
          src={zone_image ? `/image/zoneImages/${zone_image}` : `/image/zoneImages/placeholder.jpg`}
          alt={zone_name}
        /> */}
        {imageUrl ? (
              <img
                className="rounded-t-lg w-full max-h-60"
                src={imageUrl}
                alt={zone_name}
                width="500"
              />
            ) : (
              <div>Loading image...</div>
            )}
      <div className="p-5 space-y-3 ">


        {/* zone Name */}
        <a href="#">
          <h5 className="mb-2 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {zone_name}
          </h5>
        </a>

        {/* zone Location */}
        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400 ">
          <svg fill="#000000" width="25px" height="25px" viewBox="-3 0 19 19" xmlns="http://www.w3.org/2000/svg" className="cf-icon-svg"><path d="M12.517 12.834v1.9a1.27 1.27 0 0 1-1.267 1.267h-9.5a1.27 1.27 0 0 1-1.267-1.267v-1.9A3.176 3.176 0 0 1 3.65 9.667h5.7a3.176 3.176 0 0 1 3.167 3.167zM3.264 5.48A3.236 3.236 0 1 1 6.5 8.717a3.236 3.236 0 0 1-3.236-3.236z" /></svg>

          <div
            className={`text-xl font-bold ${current_visitor_count / max_people_in_zone < 0.5
                ? 'text-green-400'
                : current_visitor_count / max_people_in_zone < 0.75
                  ? 'text-yellow-400'
                  : current_visitor_count / max_people_in_zone < 1
                    ? 'text-orange-500'
                    : 'text-red-600'
              }`}
          >
            {current_visitor_count} / {max_people_in_zone}
          </div>

        </div>

        {/* zone Details */}
        <div className="mb-3 text-sm font-normal text-gray-500 dark:text-gray-400">
          {zone_detail}
        </div>

        <div className="text-md text-gray-500">Time : {zone_time}</div>

        {/* <div className="flex items-center text-sm mt-2.5 mb-5 space-x-2 text-gray-700">
          <div>เวลาที่เปิดให้ปริการ: </div>
          <div>{zone_time}</div>
        </div> */}

        <div className="flex justify-end">
          <MdEdit  className='text-gray-600 w-6 h-6'/>
          <MdDeleteForever className='text-red-600 w-6 h-6' />
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
