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

interface Bar {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  bar_detail: string;
  total_rating: number;
  total_reviews: number;
  bar_image: string;
}

const BarPage = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const data = [
    { month: "Sunday", sales: 50 },
    { month: "Monday", sales: 40 },
    { month: "Tuesday", sales: 300 },
    { month: "Wednesday", sales: 320 },
    { month: "Thursday", sales: 500 },
    { month: "Friday", sales: 350 },
    { month: "Saturday", sales: 200 },
  ];

  useEffect(() => {
    if (!id) return; // รอให้ id โหลดเสร็จก่อน

    const fetchBar = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/getBarId/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch bar details");
        }

        const data = await response.json();
        console.log(data); // Log the response to verify its structure

        if (data) {
          // Check directly if the data exists
          setBar(data); // Set the bar data directly from the response
        } else {
          setError("Bar details not found.");
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBar();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!bar) return <p>No bar details found.</p>;

  return (
    <div className="container mx-auto p-4  w-full h-screen overflow-y-auto">
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
      <ZoneCard
      
      key={bar.bar_id}></ZoneCard>

      <form>
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
      </form>
    </div>
  );
};

export default BarPage;
