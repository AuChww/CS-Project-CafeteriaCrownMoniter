import React, { useState, useRef, useEffect } from "react";

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_detail: string;
  restaurant_location: string;
  restaurant_image: string;
}

interface EditRestaurantProps {
  restaurants: Restaurant[];
}

const EditRestaurant: React.FC<EditRestaurantProps> = ({ restaurants }) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDetail, setRestaurantDetail] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const [restaurantImage, setRestaurantImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Disable submit while submitting
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousRestaurantName, setPreviousRestaurantName] = useState("");
  const [previousRestaurantDetail, setPreviousRestaurantDetail] = useState("");
  const [previousRestaurantLocation, setPreviousRestaurantLocation] =
    useState("");

  const [previousRestaurantImage, setPreviousRestaurantImage] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRestaurant(e.target.value);
  };

  const handleEditRestaurant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedRestaurantName =
      restaurantName.trim() || previousRestaurantName;
    const updatedRestaurantDetail =
      restaurantDetail.trim() || previousRestaurantDetail;
    const updatedRestaurantLocation =
      restaurantLocation.trim() || previousRestaurantLocation;

    const formData = new FormData();
    formData.append("restaurant_id", selectedRestaurant);
    formData.append("restaurant_name", updatedRestaurantName);
    formData.append("restaurant_detail", updatedRestaurantDetail);
    formData.append("restaurant_location", updatedRestaurantLocation);

    if (restaurantImage) {
      formData.append("restaurant_image", restaurantImage);
    } else {
      formData.append("restaurant_image", previousRestaurantImage);
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/updateRestaurant/${selectedRestaurant}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error submitting form");
      }

      console.log("Restaurant updated successfully");

      // Reset form fields after successful submission
      setSelectedRestaurant("");
      setRestaurantName("");
      setRestaurantDetail("");
      setRestaurantLocation("");
      setRestaurantImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ล้างค่า input file เพื่อให้ UI อัปเดต
      }
      setError(null);
      toggleModal(); // Close the modal after submission
    } catch (error) {
      setError(
        "There was an error while submitting the form. Please try again."
      );
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!selectedRestaurant) return;

    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/api/v1/getRestaurantId/${selectedRestaurant}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch restaurant data");
        return response.json();
      })
      .then((data) => {
        setRestaurantName(data.restaurant_name || "");
        setRestaurantDetail(data.restaurant_detail || "");
        setRestaurantLocation(data.restaurant_location || "");
        setPreviousRestaurantImage(data.restaurant_image || ""); // เก็บค่ารูปภาพเดิม
        setRestaurantImage(null);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
    console.log("selectedRestaurant in useEffect:", selectedRestaurant);
  }, [selectedRestaurant]);

  return (
    <>
      <form className="py-2 px-4 md:p-5" onSubmit={handleEditRestaurant}>
        <div className="grid gap-3 mb-8 grid-cols-2">
          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 
                    focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                      selectedRestaurant === ""
                        ? "text-gray-500"
                        : "text-gray-900"
                    }`}
              >
                <option value="">Choose a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option
                    key={restaurant.restaurant_id}
                    value={restaurant.restaurant_id}
                  >
                    {restaurant.restaurant_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="restaurant_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                disabled={isLoading}
                required
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Restaurant name
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="restaurant_detail"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={restaurantDetail}
                onChange={(e) => setRestaurantDetail(e.target.value)}
                disabled={isLoading}
                required
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Restaurant detail
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="restaurant_location"
                id="restaurant_location"
                value={restaurantLocation}
                onChange={(e) => setRestaurantLocation(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                disabled={isLoading}
                required
              />
              <label
                htmlFor="restaurant_location"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Restaurant Location
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-500 dark:text-white">
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setRestaurantImage(e.target.files[0]); // บันทึกไฟล์ใน state
                }
              }}
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300"
        >
          {isSubmitting ? "Submitting..." : "Update Restaurant"}
        </button>
      </form>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={toggleModal}
        >
          <div
            className="relative p-10 w-full max-w-md bg-white rounded-lg shadow-sm dark:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 md:p-5 text-center space-y-6">
              <svg
                viewBox="0 0 117 117"
                version="1.1"
                className="w-16 h-16 ml-auto mr-auto"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title></title> <desc></desc> <defs></defs>{" "}
                  <g
                    fill="none"
                    fillRule="evenodd"
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                  >
                    {" "}
                    <g fillRule="nonzero" id="correct">
                      {" "}
                      <path
                        d="M34.5,55.1 C32.9,53.5 30.3,53.5 28.7,55.1 C27.1,56.7 27.1,59.3 28.7,60.9 L47.6,79.8 C48.4,80.6 49.4,81 50.5,81 C50.6,81 50.6,81 50.7,81 C51.8,80.9 52.9,80.4 53.7,79.5 L101,22.8 C102.4,21.1 102.2,18.5 100.5,17 C98.8,15.6 96.2,15.8 94.7,17.5 L50.2,70.8 L34.5,55.1 Z"
                        fill="#17AB13"
                        id="Shape"
                      ></path>{" "}
                      <path
                        d="M89.1,9.3 C66.1,-5.1 36.6,-1.7 17.4,17.5 C-5.2,40.1 -5.2,77 17.4,99.6 C28.7,110.9 43.6,116.6 58.4,116.6 C73.2,116.6 88.1,110.9 99.4,99.6 C118.7,80.3 122,50.7 107.5,27.7 C106.3,25.8 103.8,25.2 101.9,26.4 C100,27.6 99.4,30.1 100.6,32 C113.1,51.8 110.2,77.2 93.6,93.8 C74.2,113.2 42.5,113.2 23.1,93.8 C3.7,74.4 3.7,42.7 23.1,23.3 C39.7,6.8 65,3.9 84.8,16.2 C86.7,17.4 89.2,16.8 90.4,14.9 C91.6,13 91,10.5 89.1,9.3 Z"
                        fill="#4A4A4A"
                        id="Shape"
                      ></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Restaurant Updated Successfully
              </h3>
              <button
                onClick={toggleModal}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-white focus:outline-none bg-red-600 rounded-lg border border-red-200 hover:bg-red-400 hover:text-white focus:z-10 focus:ring-4 focus:ring-red-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditRestaurant;
