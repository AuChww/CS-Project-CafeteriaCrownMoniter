"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import ZoneCard from "@/components/ZoneCard";
import {
  BarChart,
  Bar as RechartsBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { MdDeleteForever } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

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

const BarPage = () => {
  const router = useRouter();

  const { id } = useParams();
  const [bar, setBar] = useState<Bar | null>(null);
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentVisitors, setCurrentVisitors] = useState(0);
  const { role } = useAuth();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (role) {
      setUserRole(role);
    }
  }, [role]);

  const fetchBarAndZones = async () => {
    try {
      setLoading(true);

      const [getBarResponse, getAllZoneByBarIdResponse] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/v1/getBarId/${id}`),
        fetch(`http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${id}`),
      ]);

      if (!getBarResponse.ok || !getAllZoneByBarIdResponse.ok) {
        throw new Error("Failed to fetch bar details or zones");
      }

      const barData: Bar = await getBarResponse.json();
      const zonesData: { zones: Zone[] } =
        await getAllZoneByBarIdResponse.json();

      setBar(barData);
      setZones(zonesData.zones || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    try {
      let response = await fetch(
        `http://localhost:8000/api/v1/getBarImage/bar${id}.png`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch both restaurant image and fallback image"
        );
      }

      const data = await response.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        throw new Error("No image URL returned");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchBarAndZones();
  }, [id]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const zonesRes = await fetch(
          `http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${id}`
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
          `http://localhost:8000/api/v1/getBarImage/bar${id}.png`
        );
        if (!response.ok) throw new Error("Failed to fetch image URL");

        const data = await response.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchVisitorData();
  }, [id]);

  const handleDelete = async (bar_id: number, bar_name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure to delete Zone ${bar_id} : ${bar_name} ?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/deleteZone/${bar_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchBarAndZones();
      } else {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      console.error("Error deleting bar:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!bar) return <div>Error fetching bar details.</div>;
  if (!zones || zones.length === 0)
    return <div>No zones available for this bar.</div>;

  return (
    <div className="container mt-12 mx-auto p-4 w-full h-screen overflow-y-auto space-y-12">
      <div className="flex gap-6 xl:pt-10 ">
        <div className="grid w-full grid-cols-2">
          <div className="pl-8 space-y-2">
            <h1 className="text-3xl font-bold mb-4 text-green-500">
              {bar.bar_name}
            </h1>

            {imageUrl ? (
              <img
                className="w-full object-cover rounded-md mb-4"
                src={imageUrl}
                alt=" Image"
                width="500"
              />
            ) : (
              <div>Loading image...</div>
            )}

            <div className="text-lg text-gray-700">{bar.bar_detail}</div>
            <div className="flex space-x-3">
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
                {currentVisitors} / {bar.max_people_in_bar}
              </div>
            </div>

            <div className="text-base mt-2 text-gray-500 flex space-x-1">
              <img
                width="25px"
                height="25px"
                src="/image/icons/location.svg"
                alt="location pin"
              />
              <span>{bar.bar_location}</span>
            </div>

            <div className="flex space-x-1">
              <img
                width="25px"
                height="25px"
                src="/image/icons/star.svg"
                alt="location pin"
              />
              <div className="text-base text-gray-500">
                {bar.bar_rating} ({bar.total_rating} reviews)
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-10 mt-3">
            {zones &&
              Array.isArray(zones) &&
              zones.map((zone) => (
                <div
                  key={zone.zone_id}
                  className=" w-full bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-105 duration-300"
                >
                  <ZoneCard
                    zone_id={zone.zone_id}
                    bar_id={zone.bar_id}
                    zone_name={zone.zone_name}
                    zone_detail={zone.zone_detail}
                    max_people_in_zone={zone.max_people_in_zone}
                    current_visitor_count={zone.current_visitor_count}
                    update_date_time={zone.update_date_time}
                    zone_time={zone.zone_time}
                    zone_image={zone.zone_image}
                  />
                  {userRole === "admin" && (
                    <div className="flex justify-end p-4">
                      <div
                        onClick={() =>
                          handleDelete(zone.zone_id, zone.zone_name)
                        }
                      >
                        <MdDeleteForever className="text-red-600 w-6 h-6 cursor-pointer" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarPage;
