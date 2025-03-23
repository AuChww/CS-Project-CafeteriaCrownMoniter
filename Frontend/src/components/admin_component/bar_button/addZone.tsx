import React, { useState, useRef } from "react";
import AddZoneModal from "@/components/modal/AddZoneModal";

interface Bar {
  bar_id: number;
  bar_name: string;
  bar_detail: string;
  bar_image: string;
  current_visitor_count: number;
  max_people_in_bar: number;
}

interface AddZoneProps {
  bars: Bar[];
}

const AddZone: React.FC<AddZoneProps> = ({ bars }) => {
  const [zoneName, setZoneName] = useState("");
  const [zoneDetail, setZoneDetail] = useState("");
  const [maxPeopleInZone, setMaxPeopleInZone] = useState("");
  const [zoneImage, setZoneImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoneStartTime, setZoneStartTime] = useState<string>("");
  const [zoneEndTime, setZoneEndTime] = useState<string>("");
  const zoneTime = `${zoneStartTime}:00 - ${zoneEndTime}:00`;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedZone(e.target.value);
  };

  const handleAddZone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("bar_id", selectedZone);
    formData.append("zone_name", zoneName);
    formData.append("zone_detail", zoneDetail);
    formData.append("max_people_in_zone", maxPeopleInZone);
    formData.append("zone_time", zoneTime);

    if (zoneImage) {
      formData.append("zone_image", zoneImage);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/addZone", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error submitting form");
      }

      console.log("zone added successfully");

      setZoneName("");
      setZoneDetail("");
      setMaxPeopleInZone("");
      setZoneStartTime("");
      setZoneEndTime("");
      setSelectedZone("");
      setZoneImage(null);
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
      <form className="py-2 px-4 md:p-5" onSubmit={handleAddZone}>
        <div className="grid gap-3 mb-8 grid-cols-2">
          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="zone_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                required
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Zone name
              </label>
            </div>
          </div>

          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="zone_detail"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={zoneDetail}
                onChange={(e) => setZoneDetail(e.target.value)}
                required
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Zone detail
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="number"
                name="max_people_in_bar"
                id="max_people_in_bar"
                value={maxPeopleInZone}
                onChange={(e) => setMaxPeopleInZone(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 
                           bg-transparent border-0 border-b-2 border-gray-300 
                           appearance-none dark:text-white dark:border-gray-600 
                           dark:focus:border-blue-500 focus:outline-none 
                           focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="max_people_in_bar"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 
                           transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                           peer-focus:left-0 peer-focus:text-blue-600 
                           peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                           peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                           peer-focus:-translate-y-6"
              >
                Max people
              </label>
            </div>
          </div>

          <div className="col-span-1">
            <div className="max-w-[16rem] mx-auto grid grid-cols-2 gap-4">
              <div className="relative z-0 mb-6 w-full group">
                <label
                  htmlFor="start-time"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Start time
                </label>
                <input
                  type="time"
                  id="start-time"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={zoneStartTime} // Ensure value is controlled via state
                  onChange={(e) => setZoneStartTime(e.target.value)} // Update state on change
                  required
                />
              </div>

              <div className="relative z-0 mb-6 w-full group">
                <label
                  htmlFor="end-time"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  End time
                </label>
                <input
                  type="time"
                  id="end-time"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={zoneEndTime} // Ensure value is controlled via state
                  onChange={(e) => setZoneEndTime(e.target.value)} // Update state on change
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <select
                required
                value={selectedZone}
                onChange={handleChange}
                className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 
                appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 
                focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                  selectedZone === "" ? "text-gray-500" : "text-gray-900"
                }`}
              >
                <option value="">Choose a bar</option>
                {bars.length > 0 ? (
                  bars.map((bar) => (
                    <option key={bar.bar_id} value={bar.bar_id}>
                      {bar.bar_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No bars available</option>
                )}
              </select>
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
                  setZoneImage(e.target.files[0]); // บันทึกไฟล์ใน state
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
          {isSubmitting ? "Adding..." : "Add new zone"}
        </button>
      </form>

      {isModalOpen && <AddZoneModal toggleModal={toggleModal} />}
    </>
  );
};

export default AddZone;
