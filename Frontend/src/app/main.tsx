"use client";
import React from "react";
import { useState } from "react";
import Swipe from "./swipe";
import Image from "next/image"; // Note: corrected to `next/image`
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Bar {
  bar_id: number;
  bar_name: string;
  visitor_count: number;
  crowd: string;
}

export default function HomePage() {
  // Mock data for bars
  const [bars] = useState<Bar[]>([
    { bar_id: 1, bar_name: "บาร์ใหม่", visitor_count: 100, crowd: "สูง" },
    { bar_id: 2, bar_name: "บาร์วิศวกร", visitor_count: 50, crowd: "ปานกลาง" },
    { bar_id: 3, bar_name: "บาร์วิทยาศาสตร์", visitor_count: 30, crowd: "ต่ำ" },
  ]);

  // Sort bars by number of people in descending order
  const sortedBars = [...bars].sort(
    (a, b) => b.visitor_count - a.visitor_count
  );
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 bg-gray-100 w-full h-screen overflow-y-auto">
      <div>
        <Swipe />
      </div>
      <div className="grid grid-cols-1 mt-6 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {sortedBars.map((bar) => (
          // <div
          //   onClick={() => router.push(`/recommend/bar/${bar.bar_id}`)}
          //   key={bar.bar_id}
          //   className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:bg-gray-100"
          // >
          //   <h2 className="text-2xl font-semibold mb-4 text-black">
          //     {bar.bar_name}
          //   </h2>
          //   <p className="text-lg text-gray-600 mb-2">
          //     People in Bar : {bar.visitor_count}
          //   </p>
          //   <p className="text-md text-gray-600">ความหนาแน่น {bar.crown}</p>
          // </div>
          <Link href={`/recommend/bar/${bar.bar_id}`} key={bar.bar_id}>
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:bg-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                {bar.bar_name}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                People in Bar : {bar.visitor_count}
              </p>
              <p className="text-md text-gray-600">ความหนาแน่น {bar.crowd}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
