import React, { useState, useRef, useEffect } from "react";

interface Bar {
  bar_id: number;
  bar_name: string;
  bar_detail: string;
  bar_image: string;
  current_visitor_count: number;
  max_people_in_bar: number;
}

interface EditBarProps {
  bars: Bar[];
}

const EditBar: React.FC<EditBarProps> = ({ bars }) => {
  const [barName, setBarName] = useState("");
  const [barDetail, setBarDetail] = useState("");
  const [maxPeopleInBar, setMaxPeopleInBar] = useState("");
  const [barImage, setBarImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBar, setSelectedBar] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Disable submit while submitting
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousBarName, setPreviousBarName] = useState("");
  const [previousBarDetail, setPreviousBarDetail] = useState("");
  const [previousMaxPeopleInBar, setPreviousMaxPeopleInBar] = useState("");
  const [previousBarImage, setPreviousBarImage] = useState("");
  const [previousSelectedBar, setPreviousSelectedBar] = useState("");
  const [previousBarLocation, setPreviousBarLocation] = useState("");
  const [barLocation, setBarLocation] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBar(e.target.value);
  };

  const handleEditBar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ตรวจสอบค่าที่เปลี่ยนไป ถ้าไม่มีการเปลี่ยนแปลง ให้ใช้ค่าเดิมจาก state
    const Selected = selectedBar.trim || previousSelectedBar;
    const updatedBarName = barName.trim() || previousBarName;
    const updatedBarDetail = barDetail.trim() || previousBarDetail;
    const updatedBarLocation = barLocation.trim() || previousBarLocation;
    const updatedMaxPeopleInBar =
      maxPeopleInBar.trim() || previousMaxPeopleInBar;

    const formData = new FormData();
    formData.append("bar_id", selectedBar);
    formData.append("bar_name", updatedBarName);
    formData.append("bar_detail", updatedBarDetail);
    formData.append("bar_location", updatedBarLocation);
    formData.append("max_people_in_bar", updatedMaxPeopleInBar);

    if (barImage) {
      formData.append("bar_image", barImage);
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/updateBar/${selectedBar}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error submitting form");
      }

      console.log("Bar updated successfully");

      // Reset form fields after successful submission
      setBarName("");
      setBarDetail("");
      setMaxPeopleInBar("");
      setSelectedBar("");
      setBarLocation("");
      setBarImage(null);
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
    if (!selectedBar) return;

    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/api/v1/getBarId/${selectedBar}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch bar data");
        return response.json();
      })
      .then((data) => {
        setBarName(data.bar_name || "");
        setBarDetail(data.bar_detail || "");
        setBarLocation(data.bar_location || "");
        setMaxPeopleInBar(data.max_people_in_bar?.toString() || "");
        setPreviousBarImage(data.bar_image || ""); // เก็บค่ารูปภาพเดิม
        setBarImage(null);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
    console.log("selectedBar in useEffect:", selectedBar);
  }, [selectedBar]);

  return (
    <>
      <form className="py-2 px-4 md:p-5" onSubmit={handleEditBar}>
        <div className="grid gap-3 mb-8 grid-cols-2">
          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <select
                value={selectedBar}
                onChange={(e) => setSelectedBar(e.target.value)}
                className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 
                  appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 
                  focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    selectedBar === "" ? "text-gray-500" : "text-gray-900"
                  }`}
              >
                <option value="">Choose a bar</option>
                {bars.map((bar) => (
                  <option key={bar.bar_id} value={bar.bar_id}>
                    {bar.bar_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={barName}
                onChange={(e) => setBarName(e.target.value)}
                disabled={isLoading}
                required
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Bar name
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_detail"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={barDetail}
                onChange={(e) => setBarDetail(e.target.value)}
                disabled={isLoading}
                required
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Bar detail
              </label>
            </div>
          </div>

          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_detail"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={barLocation}
                onChange={(e) => setBarLocation(e.target.value)}
                disabled={isLoading}
                required
              />
              <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Bar Location
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="number"
                name="max_seating_in_bar"
                id="max_seating_in_bar"
                value={maxPeopleInBar}
                onChange={(e) => setMaxPeopleInBar(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                disabled={isLoading}
                required
              />
              <label
                htmlFor="max_seating_in_bar"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Max Seating in Bar
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
                  setBarImage(e.target.files[0]); // บันทึกไฟล์ใน state
                }
              }}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300"
        >
          {isSubmitting ? "Submitting..." : "Update Bar"}
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
                Bar Updated Successfully
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

export default EditBar;
