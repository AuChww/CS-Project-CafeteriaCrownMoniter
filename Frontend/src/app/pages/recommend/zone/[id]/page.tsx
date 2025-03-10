"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantCard from "@/components/RestaurantCard";
import { IoIosWarning } from "react-icons/io";

interface Zone {
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
  restaurant_name: string;
  restaurant_detail: string;
  restaurant_image: string;
  restaurant_location: string;
  total_rating: number;
  total_reviews: number;
  current_visitor_count: number;
  zone_id: number;
}

const ZonePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [zone, setZone] = useState<Zone | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [video, setVideoUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigateToReports = () => {
    router.push("/pages/report"); // เปลี่ยนเส้นทางไปที่หน้า /pages/report
  };
  useEffect(() => {
    const fetchZoneAndRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        // ดึงข้อมูลโซน
        const getZoneResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/getZoneById/${id}`
        );
        if (!getZoneResponse.ok) {
          throw new Error("Failed to fetch zone data");
        }
        const zoneData: Zone = await getZoneResponse.json();
        setZone(zoneData);
      } catch (err: any) {
        setError(err.message);
      }

      try {
        // ดึงข้อมูลร้านอาหาร
        const getRestaurantsResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${id}`
        );
        if (!getRestaurantsResponse.ok) {
          throw new Error("Failed to fetch restaurant data");
        }
        const restaurantsData = await getRestaurantsResponse.json();
        setRestaurants(restaurantsData.restaurants);
      } catch (err: any) {
        setError(err.message);
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/getZoneImage/zone${id}.png`
        );
        if (!response.ok) throw new Error("Failed to fetch image URL");

        const data = await response.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }

      try {
        // ดึง URL วิดีโอ
        const getVideoResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/getZoneVideo/${id}.mp4`
        );
        if (!getVideoResponse.ok) {
          throw new Error("Failed to fetch video");
        }
        const videoData = await getVideoResponse.json();
        setVideoUrl(videoData.url);
      } catch (err: any) {
        setError(err.message);
      }

      setLoading(false);
    };

    fetchZoneAndRestaurants();
  }, [id]);

  //     useEffect(() => {
  //     const fetchZoneAndRestaurants = async () => {
  //         setLoading(true);
  //         setError(null);

  //         try {
  //             // ดึงข้อมูลโซน
  //             const getZoneResponse = await fetch(`http://127.0.0.1:8000/api/v1/getZoneById/${id}`);
  //             if (!getZoneResponse.ok) {
  //                 throw new Error("Failed to fetch zone data");
  //             }
  //             const zoneData: Zone = await getZoneResponse.json();
  //             setZone(zoneData);
  //         } catch (err: any) {
  //             setError(err.message);
  //         }

  //         try {
  //             // ดึงข้อมูลร้านอาหาร
  //             const getRestaurantsResponse = await fetch(`http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${id}`);
  //             if (!getRestaurantsResponse.ok) {
  //                 throw new Error("Failed to fetch restaurant data");
  //             }
  //             const restaurantsData = await getRestaurantsResponse.json();
  //             setRestaurants(restaurantsData.restaurants);
  //         } catch (err: any) {
  //             setError(err.message);
  //         }

  //         try {
  //             // ดึง URL วิดีโอ
  //             const getVideoResponse = await fetch(`http://localhost:5000/api/v1/getZoneVideo/${id}.mp4`);
  //             if (!getVideoResponse.ok) {
  //                 throw new Error("Failed to fetch video");
  //             }
  //             const videoData = await getVideoResponse.json();
  //             setVideoUrl(videoData.url);
  //         } catch (err: any) {
  //             setError(err.message);
  //         }

  //         setLoading(false);
  //     };

  //     fetchZoneAndRestaurants();
  // }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!zone) return <p>Error fetching zone details.</p>;

  return (
    <div className="container mt-12 mx-auto p-4 w-full h-screen overflow-y-auto space-y-12">
      <div className="flex w-full gap-6 xl:pt-10">
        <div className="grid grid-cols-2">
          <div className="pl-8">
            <h1 className="text-3xl font-bold mb-4 text-green-500">
              {zone.zone_name}
            </h1>
            {/* <video width="640" height="360" controls>
              <source src={video || ""} type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}

            {imageUrl ? (
              <img src={imageUrl} alt={zone.zone_name} width="500" />
            ) : (
              <p>Loading image...</p>
            )}
            {/* <img
              className="w-full object-cover rounded-md mb-4"
              src={
                zone.zone_image
                  ? `/image/zoneImages/${zone.zone_image}`
                  : `/image/zoneImages/placeholder.jpg`
              }
              alt={zone.zone_name}
            /> */}
            <p className="text-lg text-gray-700">{zone.zone_detail}</p>

            <p className="text-lg text-gray-700">
              <strong>Current Visitors:</strong> {zone.current_visitor_count} /{" "}
              {zone.max_people_in_zone}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Operating Hours:</strong> {zone.zone_time}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Lastest Update:</strong> {zone.update_date_time}
            </p>

            <div className="relative flex flex-col rounded-xl bg-white">
              <div className="flex items-center gap-4">
                <div></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-end">
              <button
                onClick={navigateToReports}
                className="flex bg-red-600 duration-200 rounded-lg px-3 py-2 text-md text-white font-bold hover:bg-yellow-200 hover:text-red-600"
              >
                <IoIosWarning className="mt-0.5 mr-2 w-5 h-5" />
                Report
              </button>
            </div>
            {/* Restaurant List */}
            <div className="grid grid-cols-2 gap-4 p-10">
              {restaurants &&
                Array.isArray(restaurants) &&
                restaurants.map((restaurant) => (
                  <div
                    key={restaurant.restaurant_id}
                    onClick={() =>
                      router.push(
                        `/pages/recommend/restaurant/${restaurant.restaurant_id}`
                      )
                    }
                    className="cursor-pointer"
                  >
                    <RestaurantCard
                      restaurant_id={restaurant.restaurant_id}
                      restaurant_name={restaurant.restaurant_name}
                      restaurant_detail={restaurant.restaurant_detail}
                      restaurant_image={restaurant.restaurant_image}
                      restaurant_location={restaurant.restaurant_location}
                      total_rating={restaurant.total_rating}
                      current_visitor_count={restaurant.current_visitor_count}
                      total_reviews={restaurant.total_reviews}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonePage;
