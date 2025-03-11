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
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok", // ปรับให้เป็นโซนเวลาที่ต้องการ
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(created_time));
  
  return (
    <div className="border rounded-md p-4 shadow-md">
      {review_image && (
        <img
          src={`/image/reviewImages/${review_image}`}
          alt="Review"
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <div className="text-lg font-medium">{review_comment}</div>
      <div className="text-gray-500 text-sm">Rating: {rating}/5</div>
      <div className="text-gray-400 text-xs">Posted on: {formattedDate}</div>
    </div>
  );
};

export default ReviewCard;
