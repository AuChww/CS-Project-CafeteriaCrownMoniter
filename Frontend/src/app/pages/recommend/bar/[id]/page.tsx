"use client";

import { useParams } from "next/navigation"; // ใช้ useParams แทน useRouter
import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import dynamic from "next/dynamic";
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
import DayOfWeekVisitorChart from "@/components/bar/DayBarBarChart";
import VisitorBarChart from "@/components/bar/BarBarChart";
import { useRouter } from "next/navigation";
import { MdDeleteForever } from "react-icons/md";

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
  // const { id } = useParams(); // ดึง id จาก URL
  // const [bar, setBar] = useState<Bar | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const data = [
    { month: "Sunday", sales: 50 },
    { month: "Monday", sales: 40 },
    { month: "Tuesday", sales: 300 },
    { month: "Wednesday", sales: 320 },
    { month: "Thursday", sales: 500 },
    { month: "Friday", sales: 350 },
    { month: "Saturday", sales: 200 },
  ];

  const { id } = useParams(); // ดึง id จาก URL
  const [bar, setBar] = useState<Bar | null>(null);
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentVisitors, setCurrentVisitors] = useState(0);

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
        await getAllZoneByBarIdResponse.json(); // กำหนดให้รับข้อมูลเป็น object ที่มี key zones

      setBar(barData);
      setZones(zonesData.zones || []); // เข้าถึงข้อมูลใน key zones
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // Always stop loading
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
        setImageUrl(data.url); // ใช้ URL ที่ดึงมา
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
        // 1. ดึงข้อมูลโซนทั้งหมดที่เกี่ยวข้องกับ bar_id
        const zonesRes = await fetch(
          `http://127.0.0.1:8000/api/v1/getAllZonesByBarId/${id}`
        );
        const zonesData = await zonesRes.json();

        let totalZoneVisitors = (zonesData.zones || []).reduce(
          (sum: number, zone: { current_visitor_count: number }) =>
            sum + zone.current_visitor_count,
          0
        );

        // 2. ดึงข้อมูลร้านอาหารทั้งหมดที่เกี่ยวข้องกับแต่ละ zone_id
        let totalRestaurantVisitors = 0;

        await Promise.all(
          zonesData.zones.map(async (zone: { zone_id: number }) => {
            const restaurantRes = await fetch(
              `http://127.0.0.1:8000/api/v1/getRestaurantByZoneId/${zone.zone_id}`
            );
            const restaurantData = await restaurantRes.json();

            // รวม current_visitor_count ของทุกร้านอาหารในโซนนั้น
            totalRestaurantVisitors += (
              restaurantData.restaurants || []
            ).reduce(
              (sum: number, restaurant: { current_visitor_count?: number }) =>
                sum + (restaurant.current_visitor_count || 0),
              0
            );
          })
        );

        // 3. รวมค่า current_visitor ทั้งหมดจากโซนและร้านอาหาร
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
    const confirmDelete = window.confirm(`Are you sure to delete Zone ${bar_id} : ${bar_name} ?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/deleteZone/${bar_id}`, {
        method: 'DELETE',
      });

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
      <div className="flex w-full gap-6 xl:pt-10">
        <div className="grid grid-cols-2">
          <div className="pl-8">
            <h1 className="text-3xl font-bold mb-4 text-green-500">
              {bar.bar_name}
            </h1>
            {/* {bar.bar_image && (
              <img
                src={`/image/barImages/${bar.bar_image}`}
                alt={bar.bar_name}
                className="w-full object-cover rounded-md mb-4"
              />
            )}  */}
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

            <div className=" text-xl">
              {currentVisitors} / {bar.max_people_in_bar}
            </div>

            <div className="text-base mt-2 text-gray-500 flex space-x-1">
              <img src="/image/icons/location.svg" alt="location pin" />
              <span>{bar.bar_location}</span>
            </div>

            <div className="flex space-x-1">
              <img src="/image/icons/star.svg" alt="location pin" />
              <div className="text-base text-gray-500">
                {bar.bar_rating} ({bar.total_rating} reviews)
              </div>
            </div>

            <div className="text-lg text-gray-700">
              <strong>เวลาให้บริการ:</strong> {bar.total_rating} (
              {bar.total_reviews} reviews)
            </div>

            <div className="relative flex flex-col rounded-xl bg-white">
              <div className="flex items-center gap-4">
                <div></div>
              </div>
            </div>
          </div>
          {/* ZoneCard */}
          <div className="grid grid-cols-2 gap-4 p-10 mt-3">
            {zones &&
              Array.isArray(zones) &&
              zones.map((zone) => (
                <div
                  key={zone.zone_id}
                  className="max-w-sm p-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition-transform transform hover:scale-105 duration-300"
                >
                  <div onClick={() =>
                    router.push(`/pages/recommend/zone/${zone.bar_id}`)
                  }>
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
                  </div>
                  <div className="flex justify-end">
                    <div onClick={() => handleDelete(zone.zone_id, zone.zone_name)}>
                      <MdDeleteForever className="text-red-600 w-6 h-6 cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div></div>
      </div>

      {/* Comments Section */}
      <section className="py-8 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-20 mx-auto">
          <div className=" mb-10">
            <h2 className="text-gray-900 mb-8 text-4xl font-bold font-manrope leading-normal">
              ยอดผู้ใช้บริการ
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fontFamily: "inherit",
                    fill: "#616161",
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fontFamily: "inherit",
                    fill: "#616161",
                  }}
                />
                <Tooltip />
                <RechartsBar dataKey="sales" fill="#068010" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BarPage;
