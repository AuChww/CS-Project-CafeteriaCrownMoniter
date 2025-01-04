import React from "react";

interface BarCardProps {
  bar_id: number;
  bar_name: string;
  bar_location: string;
  bar_detail: string;
  total_rating: number;
  total_reviews: number;
  bar_image: string;
}

const BarCard: React.FC<BarCardProps> = ({
  bar_id,
  bar_name,
  bar_location,
  bar_detail,
  total_rating,
  total_reviews,
  bar_image,
}) => {
  return (
    <div
      key={bar_id}
      className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold mb-2">{bar_name}</h2>
      {bar_image && (
        <img
          src={bar_image}
          alt={bar_name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <p className="text-sm text-gray-600 mb-2">Location: {bar_location}</p>
      <p className="text-sm text-gray-600 mb-2">Details: {bar_detail}</p>
      <p className="text-sm text-gray-600">
        Rating: {total_rating} ({total_reviews} reviews)
      </p>
    </div>
  );
};

export default BarCard;
