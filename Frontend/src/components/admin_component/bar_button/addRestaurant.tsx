import React, { useRef, useState } from "react";
import AddRestaurantModal from "@/components/modal/AddRestaurantModal";

interface Zone {
  zone_id: number;
  zone_name: string;
  zone_detail: string;
  zone_image: string;
  current_visitor_count: number;
  max_people_in_zone: number;
}

interface AddZoneProps {
  zones: Zone[];
}

const AddRestaurant: React.FC<AddZoneProps> = ({ zones }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBar, setSelectedBar] = useState("");
  const [selectedZone, setselectedZone] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDetail, setRestaurantDetail] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const [restaurantImage, setRestaurantImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedZone(e.target.value);
  };

  const handleAddRestaurant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("zone_id", selectedZone);
    formData.append("restaurant_name", restaurantName);
    formData.append("restaurant_location", restaurantLocation);
    formData.append("restaurant_detail", restaurantDetail);

    if (restaurantImage) {
      formData.append("restaurant_image", restaurantImage);
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/addRestaurant",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error submitting form");
      }

      console.log("zone added successfully");

      setRestaurantName("");
      setRestaurantDetail("");
      setselectedZone("");
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

  return (
    <>
      <form className="py-2 px-4 md:p-5" onSubmit={handleAddRestaurant}>
        <div className="grid gap-3 mb-8 grid-cols-2">
          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={(e) => setRestaurantName(e.target.value)}
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Restaurant name{" "}
              </label>
            </div>
          </div>
          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={(e) => setRestaurantDetail(e.target.value)}
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Restaurant detail{" "}
              </label>
            </div>
          </div>

          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={(e) => setRestaurantLocation(e.target.value)}
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Restaurant location{" "}
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <label htmlFor="underline_select" className="sr-only">
                Underline select
              </label>
              <select
                required
                id="underline_select"
                value={selectedZone}
                onChange={handleChange}
                className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 
          appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 
          focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
            selectedBar === "" ? "text-gray-500" : "text-gray-900"
          }`}
              >
                <option value="">Choose a bar</option>
                {zones.length > 0 ? (
                  zones.map((zone) => (
                    <option key={zone.zone_id} value={zone.zone_id}>
                      {zone.zone_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No bars available</option>
                )}
              </select>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block mb-1  text-sm font-medium text-gray-500 dark:text-white">
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
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
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}{" "}
        {/* Error message display */}
        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={isSubmitting} // Disable while submitting
        >
          {isSubmitting ? "Adding..." : "Add new restaurant"}
        </button>
      </form>

      {isModalOpen && <AddRestaurantModal toggleModal={toggleModal} />}
    </>
  );
};
export default AddRestaurant;
