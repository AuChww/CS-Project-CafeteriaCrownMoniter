import React, { useState, useEffect } from "react";
import AddBar from "@/components/admin_component/bar_button/addBar";
import AddZone from "@/components/admin_component/bar_button/addZone";
import AddRestaurant from "@/components/admin_component/bar_button/addRestaurant";

const addTab = () => {
  type Tab = "bar" | "zone" | "restaurant";

  const [activeTab, setActiveTab] = useState("bar");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // เปิด Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // ปิด Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // เปลี่ยน Tab โดยรับชื่อ Tab ที่ต้องการเป็น argument
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  

  return (
    <div>
      {/* ปุ่มเปิด Modal */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Modal
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 w-11/12 max-w-md">
            {/* Tab Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 ">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="me-2">
                  <button
                    onClick={() => handleTabChange("bar")}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === "bar"
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    Bar
                  </button>
                </li>
                <li className="me-2">
                  <button
                    onClick={() => handleTabChange("zone")}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === "zone"
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    Zone
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("restaurant")}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === "restaurant"
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    Restaurant
                  </button>
                </li>
                <li className="ml-auto mt-auto mb-auto">
                <button
                  onClick={closeModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-4 h-4"
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
                  <span className="sr-only">Close modal</span>
                </button>
                </li>
              </ul>
              
                
             
            </div>
            {/* Tab Content */}
            <div className="p-4">
              {activeTab === "bar" && (
                <div id="bar" role="tabpanel">
                  <AddBar></AddBar>
                </div>
              )}
              {activeTab === "zone" && (
                <div id="zone" role="tabpanel">
                  <AddZone></AddZone>
                </div>
              )}
              {activeTab === "restaurant" && (
                <div id="restaurant" role="tabpanel">
                  <AddRestaurant></AddRestaurant>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default addTab;
