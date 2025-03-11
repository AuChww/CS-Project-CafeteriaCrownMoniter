import React from "react";
import BarAndRestaurant from "@/components/BarAndRestaurant";

interface Bar {
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
  total_rating: number;
}

interface BarDetailProps {
  bars: Bar[];
  restaurants: Restaurant[];
}

const AllBar: React.FC<BarDetailProps> = ({ bars, restaurants }) => {
  return (
    // <div>
    //   <h1 className="text-3xl font-bold mb-4">Bars and Nearby Restaurants</h1>
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {bars.map((bar) => (
    //       <div
    //         key={bar.bar_id}
    //         className="bg-gray-50 rounded-lg shadow-lg p-4 border border-gray-300"
    //       >
    //         <h2 className="text-xl font-semibold mb-2">{bar.bar_name}</h2>
    //         {bar.bar_image && (
    //           <img
    //             src={bar.bar_image}
    //             alt={bar.bar_name}
    //             className="w-full h-32 object-cover rounded-md mb-4"
    //           />
    //         )}
    //         <div className="text-sm text-gray-600 mb-2">Location: {bar.bar_location}</div>
    //         <div className="text-sm text-gray-600 mb-4">Details: {bar.bar_detail}</div>
    //         <h3 className="text-lg font-semibold">Nearby Restaurants</h3>
    //         <ul className="space-y-2">
    //           {restaurants.slice(0, 3).map((restaurant) => (
    //             <li
    //               key={restaurant.restaurant_id}
    //               className="bg-white p-2 rounded-md shadow-sm border border-gray-200"
    //             >
    //               <h4 className="text-sm font-medium">{restaurant.restaurant_name}</h4>
    //               <div className="text-xs text-gray-500">Rating: {restaurant.total_rating}</div>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     ))}
    //   </div>
    // </div>

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
                src={`/image/barImages/${bar.bar_image}`}
                alt="{bar_name}"
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
