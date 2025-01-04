"use client"
import React from "react";
import { useState } from "react";
import Swipe from "./swipe";
import Image from "next/image";  // Note: corrected to `next/image`

interface Bar {
    bar_id: number;
    bar_name: string;
    people_count: number;
    crown: string;
}

export default function HomePage() {
    // Mock data for bars
    const [bars] = useState<Bar[]>([
        { bar_id: 1, bar_name: "บาร์ใหม่", people_count: 100 ,crown: "สูง"},
        { bar_id: 2, bar_name: "บาร์วิศวกร", people_count: 50 ,crown: "ปานกลาง"},
        { bar_id: 3, bar_name: "บาร์วิทยาศาสตร์", people_count: 30 ,crown: "ต่ำ"},
    ]);

    // Sort bars by number of people in descending order
    const sortedBars = [...bars].sort((a, b) => b.people_count - a.people_count);

    return (
        <div className="container mx-auto p-4 bg-gray-100 w-full h-screen overflow-y-auto">
            <div>
                <Swipe />
            </div>
            <div className="grid grid-cols-1 mt-6 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {sortedBars.map((bar) => (
                    <div
                        key={bar.bar_id}
                        className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:bg-gray-100"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-black">{bar.bar_name}</h2>
                        <p className="text-lg text-gray-600 mb-2">People in Bar : {bar.people_count}</p>
                        <p className="text-md text-gray-600">ความหนาแน่น {bar.crown}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
