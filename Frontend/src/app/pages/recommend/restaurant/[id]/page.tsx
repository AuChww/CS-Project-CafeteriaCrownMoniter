"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ใช้ AuthContext
import ReviewCard from "@/components/ReviewCard";

interface Restaurant {
  restaurant_id: number;
  zone_id: number;
  restaurant_name: string;
  restaurant_location: string;
  restaurant_detail: string;
  restaurant_image: string;
  restaurant_rating: number;
  total_rating: number;
  total_reviews: number;
  current_visitor_count: number;
  update_date_time: string;
}

interface Review {
  review_id: number;
  user_id: number; // user_id ที่จะใช้ดึงข้อมูลชื่อผู้ใช้
  restaurant_id: number;
  review_comment: string;
  review_image: string;
  rating: number;
  created_time: string;
  user_name?: string; // เพิ่ม property สำหรับ username
}

const RestaurantPage = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const router = useRouter();
  const { user } = useAuth(); // ใช้ useAuth เพื่อดึงข้อมูลผู้ใช้งาน
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0); // เก็บค่าระดับดาวที่ผู้ใช้เลือก
  const [comment, setComment] = useState(""); // เก็บความคิดเห็น
  const [reviewImage, setReviewImage] = useState<string>(""); // เก็บ URL รูป
  const [imageFile, setImageFile] = useState<File | null>(null); // เก็บไฟล์ที่เลือก
  const [editingReview, setEditingReview] = useState<Review | null>(null); // state สำหรับการแก้ไขรีวิว
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchRestaurantAndReviews = async () => {
    try {
      setLoading(true);
      const [restaurantResponse, reviewsResponse] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/v1/getRestaurantId/${id}`),
        fetch(`http://127.0.0.1:8000/api/v1/getReviewByRestaurantId/${id}`),
      ]);

      if (!restaurantResponse.ok || !reviewsResponse.ok) {
        throw new Error("Failed to fetch restaurant or reviews");
      }

      const restaurantData: Restaurant = await restaurantResponse.json();
      const reviewsData: { reviews: Review[] } = await reviewsResponse.json();

      const reviewsWithUserNames = await Promise.all(
        reviewsData.reviews.map(async (review) => {
          const userResponse = await fetch(
            `http://127.0.0.1:8000/api/v1/getUserId/${review.user_id}`
          );
          const userData = await userResponse.json();
          return { ...review, user_name: userData.username };
        })
      );

      setRestaurant(restaurantData);
      setReviews(reviewsWithUserNames || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    try {
      let response = await fetch(
        `http://localhost:8000/api/v1/getRestaurantImage/restaurant${id}.png`
      );

      if (!response.ok) {
        console.log("First image not found, trying fallback...");
      }
      if (!response.ok) {
        throw new Error(
          "Failed to fetch both restaurant image and fallback image"
        );
      }
      const data = await response.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        throw new Error("No image URL returned");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchRestaurantAndReviews();
  }, [id]);

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setComment(review.review_comment);
    setRating(review.rating);
    setImageFile(null);
  };

  const handleModalClose = () => {
    setEditingReview(null);
  };

  const handleSubmitEdit = () => {
    if (editingReview) {
      handleUpdateReview(editingReview.review_id);
      handleModalClose();
    }
  };

  const handleAddReview = async () => {
    if (!user) {
      alert("Please log in to add a review.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/addReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          rating,
          restaurant_id: id,
          user_id: user.user_id,
          review_image: imageFile ? imageFile.name : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Review added successfully!");
        fetchRestaurantAndReviews();
      } else {
        alert(data.message || "Failed to add review");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while adding the review.");
    }
  };

  const handleUpdateReview = async (reviewId: number) => {
    if (!user) {
      alert("Please log in to update the review.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/updateReview/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            restaurant_id: id,
            rating: rating,
            comment: comment,
            review_image: imageFile ? imageFile.name : null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Review updated successfully!");
        fetchRestaurantAndReviews();
      } else {
        alert(data.message || "Failed to update review");
      }
    } catch (error) {
      alert("An error occurred while updating the review.");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!user) {
      alert("Please log in to delete the review.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/deleteReview/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Review deleted successfully!");
        fetchRestaurantAndReviews();
      } else {
        alert(data.message || "Failed to delete review");
      }
    } catch (error) {
      alert("An error occurred while deleting the review.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <div className="container mt-12 mx-auto p-4 w-full h-screen space-y-12">
      <div className="">
        <div className="grid grid-cols-2 gap-6 xl:pt-10">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-green-500">
              {restaurant.restaurant_name}
            </h1>

            {imageUrl ? (
              <img
                className="w-full object-cover rounded-md mb-4"
                src={imageUrl}
                alt=" Image"
                width="500"
              />
            ) : (
              <p>Loading image...</p>
            )}
            <p className="text-lg text-gray-700">
              {restaurant.restaurant_detail}
            </p>
            <p className="text-base text-gray-500 flex space-x-1">
              <img src="/image/icons/location.svg" alt="location" />
              <span>{restaurant.restaurant_location}</span>
            </p>
            <p className="text-base text-gray-500 flex space-x-1">
              <img src="/image/icons/star.svg" alt="rating" />
              <span>
                {restaurant.total_rating} ({restaurant.total_reviews} reviews)
              </span>
            </p>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.review_id} className="border p-4 rounded">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.user_name}</p>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              index < review.rating
                                ? "fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 17.75l-6.162 3.24 1.174-6.874L2 7.87l6.902-1.004L12 1l2.098 5.866L21 7.87l-5.012 6.246 1.174 6.874z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p>{review.review_comment}</p>
                    {review.review_image && (
                      <img
                        src={
                          review.review_image
                            ? `/image/reviewImages/${review.review_image}`
                            : ``
                        }
                        alt="Review"
                        className="mt-4 w-full rounded"
                      />
                    )}

                    {user?.user_id === review.user_id && (
                      <button
                        onClick={() => handleEditClick(review)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Edit
                      </button>
                    )}

                    {user?.user_id === review.user_id && (
                      <button
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No reviews available for this restaurant.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {user ? (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-700">
              Rating
            </label>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 cursor-pointer ${
                    index < rating ? "fill-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(index + 1)}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 17.75l-6.162 3.24 1.174-6.874L2 7.87l6.902-1.004L12 1l2.098 5.866L21 7.87l-5.012 6.246 1.174 6.874z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700">
              Comment
            </label>
            <textarea
              id="comment"
              className="w-full p-2 border rounded"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reviewImage" className="block text-gray-700">
              Upload Image
            </label>
            <input
              id="reviewImage"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            onClick={handleAddReview}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <div className="my-8 py-8 text-center">
          <p>Please Login before reviews.</p>
        </div>
      )}

      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-xl font-bold mb-4">Edit Review</h3>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-700">
                Rating
              </label>
              <div className="flex gap-2">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 cursor-pointer ${
                      index < rating ? "fill-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(index + 1)}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17.75l-6.162 3.24 1.174-6.874L2 7.87l6.902-1.004L12 1l2.098 5.866L21 7.87l-5.012 6.246 1.174 6.874z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700">
                Comment
              </label>
              <textarea
                id="comment"
                className="w-full p-2 border rounded"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Edit your review here..."
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reviewImage" className="block text-gray-700">
                Upload Image
              </label>
              <input
                id="reviewImage"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;
