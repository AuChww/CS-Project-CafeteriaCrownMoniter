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

interface Bar {
  bar_id: number;
  bar_name: string;
  max_people_in_bar: number;
  bar_detail: string;
  bar_image: string;
  bar_location: string;
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

  useEffect(() => {
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
    };

    fetchBarAndZones();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!bar) return <p>Error fetching bar details.</p>;
  if (!zones || zones.length === 0)
    return <p>No zones available for this bar.</p>;

  return (
    <div className="container mt-12 mx-auto p-4 w-full h-screen overflow-y-auto space-y-12">
      <div className="flex w-full gap-6 xl:pt-10">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <div className="pl-8">
            <h1 className="text-3xl font-bold mb-4 text-green-500">
              {bar.bar_name}
            </h1>
            {bar.bar_image && (
              <img
                src={`http://127.0.0.1:8000/public/image/barImages/${bar.bar_image}`}
                alt={bar.bar_name}
                className="w-full object-cover rounded-md mb-4"
              />
            )}
            <p className="text-lg text-gray-700">{bar.bar_detail}</p>

            <div className="text-base text-gray-500 flex space-x-1">
              <img src="/image/icons/location.svg" alt="location pin" />
              <span>{bar.bar_location}</span>
            </div>

            <div className="flex space-x-1">
              <img src="/image/icons/star.svg" alt="location pin" />
              <p className="text-base text-gray-500">
                {bar.total_rating} ({bar.total_reviews} reviews)
              </p>
            </div>

            <p className="text-lg text-gray-700">
              <strong>เวลาให้บริการ:</strong> {bar.total_rating} (
              {bar.total_reviews} reviews)
            </p>

            <div className="relative flex flex-col rounded-xl bg-white">
              <div className="flex items-center gap-4">
                <div>
                </div>
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
                  onClick={() =>
                    router.push(`/pages/recommend/zone/${zone.bar_id}`)
                  }
                  className="cursor-pointer"
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
                </div>
              ))}
          </div>
        </div>
        <div>
        </div>
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
