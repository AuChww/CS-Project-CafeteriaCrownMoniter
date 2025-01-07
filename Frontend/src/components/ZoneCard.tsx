import React from "react";

interface ZoneCardProps {
  zone_id: number;
  bar_id: string;
  zone_name: string;
  zone_detail: string;
  max_people_in_zone: number;
  current_visitor_count: number;
  update_date_time: string ;
  zone_time: number;
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
    zone_time
}) => {
  return (


    <div
      key={zone_id}
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 "
    >
     

      <div className="p-5 ">
        
        {/* zone Name */}
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {zone_name}
          </h5>
        </a>

        {/* zone Details */}
        <p className="mb-3 text-sm font-normal text-gray-500 dark:text-gray-400">
          {zone_detail}
        </p>

        {/* zone Location */}
        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400 ">
         <p>Max perople in zone:</p>
          <p>{max_people_in_zone}</p>
        </div>

        <div className="flex items-center mt-2.5 mb-5 space-x-2">
        
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <p>{current_visitor_count}</p>
          </div>

          <p>{zone_time}</p>

         
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;
