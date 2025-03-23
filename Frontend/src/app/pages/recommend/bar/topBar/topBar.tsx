"use client"
import BarCard from "@/components/BarCard";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaFireAlt } from "react-icons/fa";

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

const TopBar: React.FC = () => {
  const router = useRouter();
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barsResponse = await fetch("http://127.0.0.1:8000/api/v1/getAllBars");
        const restaurantsResponse = await fetch("http://127.0.0.1:8000/api/v1/getAllRestaurants");

        if (!barsResponse.ok || !restaurantsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const barsData: { bars: Bar[] } = await barsResponse.json();

        const sortedBars = barsData.bars.sort(
          (a, b) => b.total_rating - a.total_rating || b.total_reviews - a.total_reviews
        );

        setBars(sortedBars);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (bars.length === 0) {
    return <div className="p-6 text-gray-500">No bars available</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-500">Top Bars</h1>
      <div className="overflow-x-auto mb-8">
        <div className="flex gap-6">
          {bars.map((bar, index) => (
            <div key={bar.bar_id} onClick={() => router.push(`/pages/recommend/bar/${bar.bar_id}`)}
              className="relative">

              {index < 3 && (
                <div className="absolute flex top-2 right-2 bg-gradient-to-r
                          from-orange-500
                          via-red-600
                          to-red-800  text-white text-xs py-1 px-2 rounded-full">
                  <div>
                    Popular
                  </div>
                  <div>
                    <FaFireAlt className="w-4 h-4 ml-1" />
                  </div>
                </div>
              )}

              <BarCard
                key={bar.bar_id}
                bar_id={bar.bar_id}
                bar_name={bar.bar_name}
                max_people_in_bar={bar.max_people_in_bar}
                bar_detail={bar.bar_detail}
                bar_image={bar.bar_image}
                bar_location={bar.bar_location}
                bar_rating={bar.bar_rating}
                total_rating={bar.total_rating}
                total_reviews={bar.total_reviews}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
