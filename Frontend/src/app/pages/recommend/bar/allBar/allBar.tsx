import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { id } = useParams(); // ดึง id จาก URL
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBar = async () => {
      try {
        let response = await fetch(
          `http://localhost:8000/api/v1/getBarImage/bar${id}.png`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const data = await response.json();
        if (data.url) {
          setImageUrl(data.url); // ใช้ URL ที่ดึงมา
        } else {
          throw new Error("No image URL returned");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchBar();
  }, [id]);

  return (
    <div>
      <h1 className="text-3xl mt-12 font-bold mb-4">Bars and Nearby Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bars.map((bar) => (
          <div
            key={bar.bar_id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            {/* Bar Images */}
            <a href="#">
              <img
                className="rounded-t-lg"
                src={imageUrl ? imageUrl : `/image/barImages/${bar.bar_image}`} // หากดึง URL ได้จาก API ให้ใช้ URL นั้น, ถ้าไม่ได้ให้ใช้ path เดิม
                alt={bar.bar_name}
              />
            </a>
            <div className="p-5">
              <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                {bar.bar_name}
              </h5>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {bar.bar_detail}
              </div>
              <ul className="my-4 space-y-3">
                {restaurants.length > 0 ? (
                  restaurants.slice(0, 3).map((restaurant) => (
                    <li key={restaurant.restaurant_id}>
                      <a
                        href="#"
                        aria-label={`View details for ${restaurant.restaurant_name}`}
                        title={`View details for ${restaurant.restaurant_name}`}
                        className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                      >
                        <span className="flex-1 ms-3 whitespace-nowrap">
                          {restaurant.restaurant_name}
                        </span>
                        <span
                          className={`${
                            restaurant.total_rating >= 4
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          } text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-3`}
                        >
                          {restaurant.total_rating}
                        </span>
                      </a>
                    </li>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    No restaurants available.
                  </div>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBar;
