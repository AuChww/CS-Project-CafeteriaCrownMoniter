import React, { useState, useRef } from "react";
import AddBarModal from "@/components/modal/AddBarModal";

function AddBar() {
  const [barName, setBarName] = useState("");
  const [barDetail, setBarDetail] = useState("");
  const [barLocation, setBarLocation] = useState("");
  const [maxPeopleInBar, setMaxPeopleInBar] = useState("");
  const [barImage, setBarImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const handleAddBar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    // เพิ่มข้อมูลที่ไม่ใช่ไฟล์
    formData.append("bar_name", barName);
    formData.append("bar_detail", barDetail);
    formData.append("bar_location", barLocation);
    formData.append("max_people_in_bar", maxPeopleInBar);

    if (barImage) {
      formData.append("bar_image", barImage);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/addBar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error submitting form");
      }

      console.log("Bar added successfully");

      // รีเซ็ตค่า Form
      setBarName("");
      setBarDetail("");
      setBarLocation("");
      setMaxPeopleInBar("");
      setBarImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toggleModal();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleAddBar} className="py-2 px-4 md:p-5">
        <div className="grid gap-3 mb-8 grid-cols-2">
          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_name"
                id="bar_name"
                value={barName}
                onChange={(e) => setBarName(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 
                           bg-transparent border-0 border-b-2 border-gray-300 
                           appearance-none dark:text-white dark:border-gray-600 
                           dark:focus:border-blue-500 focus:outline-none 
                           focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="bar_name"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 
                           transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                           peer-focus:left-0 peer-focus:text-blue-600 
                           peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                           peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                           peer-focus:-translate-y-6"
              >
                Bar name
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_detail"
                id="bar_detail"
                value={barDetail}
                onChange={(e) => setBarDetail(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 
                           bg-transparent border-0 border-b-2 border-gray-300 
                           appearance-none dark:text-white dark:border-gray-600 
                           dark:focus:border-blue-500 focus:outline-none 
                           focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="bar_detail"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 
                           transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                           peer-focus:left-0 peer-focus:text-blue-600 
                           peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                           peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                           peer-focus:-translate-y-6"
              >
                Bar detail
              </label>
            </div>
          </div>

          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="text"
                name="bar_location"
                id="bar_location"
                value={barLocation}
                onChange={(e) => setBarLocation(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 
                           bg-transparent border-0 border-b-2 border-gray-300 
                           appearance-none dark:text-white dark:border-gray-600 
                           dark:focus:border-blue-500 focus:outline-none 
                           focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="bar_location"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 
                           transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                           peer-focus:left-0 peer-focus:text-blue-600 
                           peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                           peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
                           peer-focus:-translate-y-6"
              >
                Bar location
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="number"
                name="max_people_in_bar"
                id="max_people_in_bar"
                value={maxPeopleInBar}
                onChange={(e) => setMaxPeopleInBar(e.target.value)}
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

          <div className="col-span-2">
            <label
              htmlFor="bar_image"
              className="block mb-1 text-sm font-medium text-gray-500 dark:text-white"
            >
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer 
                         bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 
                         dark:border-gray-600 dark:placeholder-gray-400"
              id="bar_image"
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
        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 
                     focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                     text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 
                     dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>

      {isModalOpen && <AddBarModal toggleModal={toggleModal} />}
    </div>
  );
}

export default AddBar;
