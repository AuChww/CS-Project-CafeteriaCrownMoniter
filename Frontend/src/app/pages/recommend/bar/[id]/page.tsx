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

interface Bar {
    bar_id: number;
    bar_name: string;
    bar_location: string;
    bar_detail: string;
    total_rating: number;
    total_reviews: number;
    bar_image: string;
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
}

const BarPage = () => {
    // const { id } = useParams(); // ดึง id จาก URL
    // const [bar, setBar] = useState<Bar | null>(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

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
    if (!zones || zones.length === 0) return <p>No zones available for this bar.</p>;


    return (
        <div className="container mt-12 mx-auto p-4  w-full h-screen overflow-y-auto space-y-12">
            <div className="xl:grid grid-cols-2 gap-6 xl:pt-10">
                <div className="">
                    {bar.bar_image && (
                        <img
                            src={`/image/barImages/${bar.bar_image}`}
                            alt={bar.bar_name}
                            className="w-full  object-cover rounded-md mb-4"
                        />
                    )}
                </div>
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold mb-4 text-green-500">
                        {bar.bar_name}
                    </h1>
                    <p className="text-lg text-gray-700">{bar.bar_detail}</p>

                    <div className="text-base text-gray-500 flex space-x-1">
                        <img src="/image/icons/location.svg" alt="location pin" />
                        <span>{bar.bar_location}</span>
                    </div>

                    <div className="flex space-x-1">
                        <img src="/image/icons/star.svg" alt="location pin" />
                        <p className="text-base text-gray-500">
                            {bar.total_rating} ({bar.total_reviews}
                            reviews)
                        </p>{" "}
                    </div>

                    <p className="text-lg text-gray-700">
                        <strong>เวลาให้บริการ:</strong> {bar.total_rating} (
                        {bar.total_reviews} reviews)
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-6">
                        {zones &&
                            Array.isArray(zones) &&
                            zones.map((zone) => (
                                <ZoneCard
                                    key={zone.zone_id} // Use zone_id instead of bar_id
                                    zone_id={zone.zone_id}
                                    bar_id={zone.bar_id}
                                    zone_name={zone.zone_name}
                                    zone_detail={zone.zone_detail}
                                    max_people_in_zone={zone.max_people_in_zone}
                                    current_visitor_count={zone.current_visitor_count}
                                    update_date_time={zone.update_date_time}
                                    zone_time={zone.zone_time}
                                />
                            ))}
                    </div>
                </div>
            </div>

            <div className="flex">
                <iframe
                    width="600"
                    height="450"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509306!2d-122.08424908468879!3d37.42206597982483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba27c0bd6fd3%3A0x5d98e2b511eed377!2sGoogleplex!5e0!3m2!1sen!2sus!4v1633560792881!5m2!1sen!2sus">
                </iframe>
                <div className="relative flex flex-col rounded-xl bg-white w-2/3">
                    <div className="text-center">
                        <div className="mb-4">
                            People Count in Day
                        </div>
                        <VisitorBarChart barId={bar.bar_id} />
                        <div className="mb-4 mt-2">
                            People Count in Week
                        </div>
                        <DayOfWeekVisitorChart />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BarPage;
