import React, { useState, useRef } from "react";

interface BarData {
  bar_id: number;
  bar_name: string;
  max_people_in_bar: number;
  bar_detail: string;
  bar_image: string;
  bar_location: string;
}

interface EditFormProps {
  barData: BarData;
  onClose: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ barData, onClose }) => {
  const [updatedData, setUpdatedData] = useState<BarData>(barData);

  // ใช้ useRef เพื่อเก็บค่าของ input
  const barNameRef = useRef<HTMLInputElement>(null);
  const barLocationRef = useRef<HTMLInputElement>(null);
  const barDetailRef = useRef<HTMLInputElement>(null);
  const maxPeopleRef = useRef<HTMLInputElement>(null);
  const barImageRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleChange = () => {
    if (barNameRef.current && barLocationRef.current && barDetailRef.current && maxPeopleRef.current && barImageRef.current) {
      setUpdatedData({
        bar_id: updatedData.bar_id,
        bar_name: barNameRef.current.value,
        bar_location: barLocationRef.current.value,
        bar_detail: barDetailRef.current.value,
        max_people_in_bar: parseInt(maxPeopleRef.current.value),
        bar_image: barImageRef.current.value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/updateBar/${barData.bar_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        console.log("Bar updated successfully");
        onClose(); // Close the popup on successful update
      } else {
        console.error("Failed to update bar");
      }
    } catch (error) {
      console.error("Error updating bar:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal Container */}
      <form onSubmit={handleSubmit} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md z-50 p-6">
        <div className="mb-4">
          <label htmlFor="bar_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bar Name
          </label>
          <input
            type="text"
            id="bar_name"
            name="bar_name"
            ref={barNameRef}
            defaultValue={updatedData.bar_name}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bar_location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input
            type="text"
            id="bar_location"
            name="bar_location"
            ref={barLocationRef}
            defaultValue={updatedData.bar_location}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bar_detail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bar Detail
          </label>
          <input
            type="text"
            id="bar_detail"
            name="bar_detail"
            ref={barDetailRef}
            defaultValue={updatedData.bar_detail}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="max_people_in_bar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Max People
          </label>
          <input
            type="number"
            id="max_people_in_bar"
            name="max_people_in_bar"
            ref={maxPeopleRef}
            defaultValue={updatedData.max_people_in_bar}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bar_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <input
            type="text"
            id="bar_image"
            name="bar_image"
            ref={barImageRef}
            defaultValue={updatedData.bar_image}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="flex justify-between mt-6">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
            Update Bar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
