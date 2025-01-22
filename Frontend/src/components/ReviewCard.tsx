import React from "react";

interface ReviewCardProps {
  review_id: number;
  user_id: number;
  restaurant_id: number;
  review_comment: string;
  review_image: string;
  rating: number;
  created_time: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review_comment,
  review_image,
  rating,
  created_time,
}) => {
  return (
    <div className="border rounded-md p-4 shadow-md">
      {review_image && (
        <img
          src={`/image/reviewImages/${review_image}`}
          alt="Review"
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <p className="text-lg font-medium">{review_comment}</p>
      <p className="text-gray-500 text-sm">Rating: {rating}/5</p>
      <p className="text-gray-400 text-xs">Posted on: {new Date(created_time).toLocaleDateString()}</p>
    </div>
  );
};

export default ReviewCard;
