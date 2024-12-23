import React from "react";

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
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Top Bars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {bars.map((bar) => (
          <div
            key={bar.bar_id}
            className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2">{bar.bar_name}</h2>
            {bar.bar_image && (
              <img
                src={bar.bar_image}
                alt={bar.bar_name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-sm text-gray-600 mb-2">Location: {bar.bar_location}</p>
            <p className="text-sm text-gray-600 mb-2">Details: {bar.bar_detail}</p>
            <p className="text-sm text-gray-600">
              Rating: {bar.total_rating} ({bar.total_reviews} reviews)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
