"use client";

import { useParams } from "next/navigation"; // ใช้ useParams แทน useRouter
import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import dynamic from "next/dynamic";
import ZoneCard from "@/components/ZoneCard";
import ContextDropdown from "@/components/SimpleComponent/ContextDropdown";

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
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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

          <div className="relative flex flex-col rounded-xl bg-white ">
            <div className="flex items-center gap-4">
              <div>
                <h6 className="font-sans text-base font-semibold leading-relaxed text-blue-gray-900">
                  ยอดผู้ใช้บริการ
                </h6>
              </div>
            </div>
            <div className="pt-6">
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
        </div>
      </div>

      {/* ZoneCard */}
      <div className="grid grid-cols-4 gap-4">
        {zones &&
          Array.isArray(zones) &&
          zones.map((zone) => (
            <ZoneCard
              key={zone.bar_id}
              zone_id={zone.zone_id}
              bar_id={zone.bar_id}
              zone_name={zone.zone_name}
              zone_detail={zone.zone_detail}
              max_people_in_zone={zone.max_people_in_zone}
              current_visitor_count={zone.current_visitor_count}
              update_date_time={zone.update_date_time}
              zone_time={zone.zone_time}
            ></ZoneCard>
          ))}
      </div>

      <section className="py-8 relative">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-20 mx-auto">
          <div className="w-full flex-col justify-start items-start  gap-7 inline-flex">
            <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">
              Comments
            </h2>

            <div className="w-full flex-col justify-start items-start gap-8 flex">
              <div className="w-full lg:py-8 lg:px-14 p-5 bg-white rounded-3xl border border-gray-200 flex-col justify-start items-end gap-2.5 flex">
                <div className="w-full flex-col justify-start items-end gap-3.5 flex">
                  <div className="w-full justify-between items-center inline-flex">
                    <div className="w-full justify-start items-center gap-2.5 flex">
                      <div className="w-10 h-10 bg-slate-400 rounded-full justify-start items-start gap-2.5 flex">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src="https://pagedone.io/asset/uploads/1710237485.png"
                          alt="Danial Harrison image"
                        />
                      </div>
                      <div className="flex-col justify-start items-start gap-1 inline-flex">
                        <h5 className="text-gray-900 text-sm font-semibold leading-snug">
                          Danial Harrison
                        </h5>
                        <h6 className="text-gray-500 text-xs font-normal leading-5">
                          5 Hour ago
                        </h6>
                      </div>
                    </div>

                    {/* Dropdown Icons */}
                    <ContextDropdown/>
                    {/* End Dropdown Icons */}
                  </div>

                  <p className="text-gray-800 text-sm font-normal leading-snug">
                    Malesuada rhoncus senectus amet dui tincidunt. Porttitor
                    lectus diam sit sit pellentesque ultrices. Molestie libero
                    ac odio at tristique sapien est venenatis. Egestas vitae
                    velit vestibulum egestas felis euismod. Morbi ac vel
                    scelerisque morbi eu nisi gravida tellus. Pulvinar orci at
                    elementum massa morbi pellentesque non nulla. Elementum
                    faucibus urna est mattis. Non aliquet in molestie id nisl.
                    Bibendum mauris dolor nisl elit ut eu viverra. Ut facilisi
                    turpis neque eu risus etiam senectus vel. Orci pharetra
                    ornare amet massa. Tempus orci vestibulum pulvinar tincidunt
                    amet dictum sit tempor.
                  </p>
                  <div className="group justify-end items-center flex">
                    <div className="px-5 py-2.5 rounded-xl shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-400 hover:border-green-600 transition-all duration-700 ease-in-out  justify-center items-center flex">
                      <a href="" className="">
                        <svg
                          className="group-hover:text-green-600 text-gray-400 group-hover:fill-green-600 fill-white transition-all duration-700 ease-in-out"
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M2.62629 3.43257C4.64001 1.44869 7.82082 1.31134 9.99614 3.02053C12.1723 1.31134 15.3589 1.44869 17.3726 3.43257L17.3734 3.43334C19.5412 5.57611 19.5412 9.04382 17.3804 11.1867L17.378 11.1891L10.4631 17.9764C10.2035 18.2312 9.78765 18.2309 9.52844 17.9758L2.62629 11.1821C0.457252 9.04516 0.457252 5.56947 2.62629 3.43257Z"
                            stroke="currentColor"
                          />
                        </svg>
                      </a>
                      <div className="px-2 justify-center items-center flex">
                        <h6 className="group-hover:text-green-600 text-gray-400 transition-all duration-700 ease-in-out text-base font-semibold leading-relaxed">
                          80
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form className="w-full relative flex justify-between ">
                <input
                  type="text"
                  className="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
                  placeholder="Leave a constructive comment..."
                />

                <button className="text-base bg-green-500 text-white border  px-4 py-2 rounded-lg">
                  Submit
                </button>
              </form>

              {/* <form>
                <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                    <label className="sr-only">Your comment</label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                      placeholder="Write a comment..."
                      required
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                    <button
                      type="submit"
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-green-500 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                    >
                      Post comment
                    </button>
                  </div>
                </div>
            </div>

        </div>
    );
};

export default BarPage;
