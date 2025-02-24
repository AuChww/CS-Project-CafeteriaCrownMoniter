"use client";
import React, { useState, useEffect } from "react";
import Swipe from "@/components/swipe";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CrowdCard from "@/components/CrowdCard";
import YouTubeEmbed from "@/components/youtubeEmbed";
import UpdateZoneCountButton from "@/components/ZoneCountTest";

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

export default function HomePage() {
  const [bars, setBars] = useState<Bar[]>([]);
  const router = useRouter();

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/getAllBars");
        if (!response.ok) {
          throw new Error("Failed to fetch bars");
        }
        const data = await response.json();
        setBars(data.bars); // Assuming the API returns { bars: [...] }
      } catch (error) {
        console.error("Error fetching bars:", error);
      }
    };

    fetchBars();
  }, []);

  return (
    <div className="container p-4 mx-auto bg-gray-100 w-full h-screen overflow-y-auto" >
      <div className="lg:mt-16 md:mt-20 mt-24">
        <div className="text-center text-4xl text-green-500 py-6 mb-8 font-bold">
          Recommend Bar&Restaurant
        </div>
        <Swipe />
      </div>
      <div className="flex mt-2 grid grid-cols-5 gap-2 bg-green-500 p-2 rounded-lg">
        <YouTubeEmbed
          src="https://www.youtube.com/embed/GuI4SZtgYYY?autohide=1&modestbranding=1&rel=0"
          title="YouTube Video 1"
        />

        <YouTubeEmbed
          src="https://www.youtube.com/embed/dAK_ovr45d4?autohide=1&modestbranding=1&rel=0"
          title="YouTube Video 2"
        />

        <YouTubeEmbed
          src="https://www.youtube.com/embed/1P-49Wz41Lo?autohide=1&modestbranding=1&rel=0"
          title="YouTube Video 3"
        />

        <YouTubeEmbed
          src="https://www.youtube.com/embed/sTi8AzZjn5o?autohide=1&modestbranding=1&rel=0"
          title="YouTube Video 4"
        />

        <YouTubeEmbed
          src="https://www.youtube.com/embed/nQHuu9W0l6Y?autohide=1&modestbranding=1&rel=0"
          title="YouTube Video 5"
        />

      </div>
      <div className="text-center text-4xl my-8 py-6 text-green-500 font-bold">
        Bar Crowd
      </div>
      <div className="grid grid-cols-2 mt-6 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {bars.map((bar) => (
          <div key={bar.bar_id} onClick={() => router.push(`/pages/recommend/bar/${bar.bar_id}`)}>
            <CrowdCard
              key={bar.bar_id}
              bar_id={bar.bar_id}
              bar_name={bar.bar_name}
              bar_location={bar.bar_location}
              max_people_in_bar={bar.max_people_in_bar}
              bar_image={bar.bar_image}
              bar_detail={bar.bar_detail}

            />
          </div>
        ))}
      </div>
    </div>
  );
}
