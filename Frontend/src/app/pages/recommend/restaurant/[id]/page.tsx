"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import EditReviewModal from "@/components/modal/EditReviewModal";
import AddReviewModal from "@/components/modal/AddReviewModal";
import ReviewCard from "@/components/ReviewCard";
import Image from "next/image";

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
  user_id: number;
  restaurant_id: number;
  review_comment: string;
  review_image: string;
  rating: number;
  created_time: string;
  user_name?: string;
}

const RestaurantPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [reviewImageUrl, setReviewImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openReviewModal = () => setIsReviewOpen(true);
  const closeReviewModal = () => setIsReviewOpen(false);

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
          let reviewImageUrl = "";

          try {
            const reviewImageResponse = await fetch(
              `http://127.0.0.1:8000/api/v1/getReviewImage/review${review.review_id}.png`
            );

            if (reviewImageResponse.ok) {
              const reviewImageData = await reviewImageResponse.json();
              console.log("Review Image Data:", reviewImageData);

              if (reviewImageData && reviewImageData.url) {
                reviewImageUrl = reviewImageData.url; // เก็บ URL ของภาพ
              }
            }
          } catch (error) {
            console.error(
              `Error fetching image for review ${review.review_id}:`,
              error
            );
          }

          return {
            ...review,
            user_name: userData.username,
            review_image: reviewImageUrl,
          };
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleAddReview = async () => {
    if (!user) {
      console.log("User is not logged in, redirecting...");
      router.push("/app/pages/authenticate/login");
      return;
    }

    const formData = new FormData();

    formData.append("comment", comment);
    formData.append("rating", String(rating));
    formData.append("restaurant_id", String(id));
    formData.append("user_id", user.userId);

    // เพิ่มไฟล์ ถ้ามี
    if (imageFile) {
      formData.append("review_image", imageFile);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/addReview", {
        method: "POST",
        body: formData, // ส่ง FormData โดยตรง
      });

      const data = await response.json();

      if (response.ok) {
        toggleModal();
        fetchRestaurantAndReviews();
      } else {
        alert(data.message || "Failed to add review");
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
            user_id: user.userId,
            restaurant_id: id,
            rating: rating,
            comment: comment,
            review_image: imageFile ? imageFile.name : null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toggleEditModal();
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
        closeModal();
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
    <>
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

            <section className="py-24 relative">
              <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full flex-col justify-start items-start lg:gap-14 gap-7 inline-flex">
                  <div className="w-full flex-col justify-start items-start gap-8 flex">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review.review_id}
                          className="w-full lg:p-8 p-5 bg-white rounded-3xl border border-gray-200 flex-col justify-start items-start flex"
                        >
                          <div className="w-full flex-col justify-start items-start gap-3.5 flex space-y-4">
                            <div className="w-full justify-between items-center inline-flex">
                              <div className="justify_between items-center gap-2.5 flex">
                                <div className="flex-col justify-start items-start gap-1 inline-flex">
                                  <h5 className="text-gray-900 text-xl font-semibold leading-snug">
                                    {review.user_name}
                                  </h5>

                                  <p className="text-gray-500 text-xs">
                                    {new Date(
                                      review.created_time
                                    ).toLocaleDateString("th-TH", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex text-yellow-300">
                                {[...Array(5)].map((_, index) => (
                                  <svg
                                    key={index}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 ${index < review.rating
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

                            <p className="text-gray-600 text-sm font-normal leading-snug">
                              {review.review_comment}
                            </p>

                            {review.review_image && (
                              <img
                                src={review.review_image}
                                alt={`Review image for ${review.review_id}`}
                                style={{ maxWidth: "50%", height: "auto" }}
                              />
                            )}
                          </div>

                          <div className="flex gap-2 mt-8">
                            {(user?.userId === review.user_id) && (
                              <div className="flex gap-2 mt-8">
                                {user?.userId === review.user_id && (
                                  <button
                                    onClick={() => handleEditClick(review)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            )}

                            {(user?.role === "admin" || user?.userId === review.user_id) && (
                              <div className="flex gap-2 mt-8">
                                <button
                                  onClick={openModal}
                                  className="px-4 py-2 bg-red-600 text-white rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {isOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                              <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-md dark:bg-gray-700">
                                <button
                                  type="button"
                                  onClick={closeModal}
                                  className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                  </svg>
                                </button>

                                <div className="p-4 md:p-5 text-center">
                                  <svg
                                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete this review?
                                  </h3>
                                  <button
                                    onClick={() =>
                                      handleDeleteReview(review.review_id)
                                    }
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                  >
                                    Yes, I'm sure
                                  </button>
                                  <button
                                    onClick={closeModal}
                                    className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                  >
                                    No, cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No comments available for this restaurant.</p>
                    )}
                  </div>
                </div>

                {user ? (
                  <form className="mt-8  border  p-8 rounded-3xl space-y-4">
                    <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
                    <div className="space-y-2">
                      <label htmlFor="rating" className="block text-gray-700">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 cursor-pointer ${index < rating
                              ? "text-yellow-300 fill-yellow-300"
                              : "text-gray-300"
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

                    <div className="space-y-2">
                      <label htmlFor="comment" className="block text-gray-700">
                        Reviews
                      </label>
                      <textarea
                        id="comment"
                        className="w-full p-2 border rounded-xl"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Upload file
                      </label>
                      <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="reviewImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>

                    <button
                      onClick={handleAddReview}
                      className="px-4 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div></div>
                )}
              </div>
            </section>
          </div>
        </div>

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
                      className={`h-6 w-6 cursor-pointer ${index < rating ? "fill-yellow-500" : "text-gray-300"
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

      {isModalOpen && <AddReviewModal toggleModal={toggleModal} />}

      {isEditModalOpen && <EditReviewModal toggleModal={toggleEditModal} />}
    </>
  );
};

export default RestaurantPage;
