import React, { useState, useRef, useEffect } from "react";
import EditRestaurantModal from "@/components/modal/EditRestaurantModal";

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
  const [error, setError] = useState<string | null>(null); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
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

   
      setSelectedRestaurant("");
      setRestaurantName("");
      setRestaurantDetail("");
      setRestaurantLocation("");
      setRestaurantImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
      setError(null);
      toggleModal(); 
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
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {isModalOpen && <EditRestaurantModal toggleModal={toggleModal} />}
    </>
  );
};

export default EditRestaurant;
