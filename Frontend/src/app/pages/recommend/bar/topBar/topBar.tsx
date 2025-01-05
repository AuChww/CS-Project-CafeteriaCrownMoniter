import React from "react";
import BarCard from "@/components/BarCard";
import { useRouter } from "next/navigation";

interface Bar {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  bar_detail: string;
  total_rating: number;
  total_reviews: number;
  bar_image: string;
}

interface TopBarProps {
  bars: Bar[];
}


const TopBar: React.FC<TopBarProps> = ({ bars }) => {
  const router = useRouter();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Top Bars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {bars.map((bar) => (
          <BarCard
            key={bar.bar_id}
            bar_id={bar.bar_id}
            bar_name={bar.bar_name}
            bar_location={bar.bar_location}
            bar_detail={bar.bar_detail}
            total_rating={bar.total_rating}
            total_reviews={bar.total_reviews}
            bar_image={bar.bar_image}
          />
        ))}
      </div>
    </div>
  );
};

export default TopBar;
