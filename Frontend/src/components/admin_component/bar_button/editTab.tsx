import React, { useState, useEffect } from "react";
import EditBar from "@/components/admin_component/bar_button/editBar";
import EditZone from "@/components/admin_component/bar_button/editZone";
import EditRestaurant from "@/components/admin_component/bar_button/editRestaurant";

interface Bar {
    bar_id: number;
    bar_name: string;
    bar_detail: string;
    bar_image: string;
    current_visitor_count: number;
    max_people_in_bar: number;
  }


interface Zone {
  zone_id: number;
  zone_name: string;
  zone_detail: string;
  max_people_in_zone: number;
  zone_time: string;
  zone_image: string;
}


interface Restaurant {
    restaurant_id: number;
    restaurant_name: string;
    restaurant_detail: string;
    restaurant_location: string;
    restaurant_image: string;
}

const EditTab = () => {
  type Tab = "bar" | "zone" | "restaurant";

  const [activeTab, setActiveTab] = useState("bar");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [barList, setBarList] = useState<Bar[]>([]);

  const [zones, setZones] = useState<Zone[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
  const [zoneList, setZoneList] = useState<Zone[]>([]);


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

  useEffect(() => {
    const fetchData = async () => {
        try {
          const barsResponse = await fetch("http://127.0.0.1:8000/api/v1/getAllBars");
      
          if (!barsResponse.ok) {
            throw new Error("Failed to fetch data");
          }
      
          const barsData: { bars: Bar[] } = await barsResponse.json();
      
          setBarList(barsData.bars); // Set to barList instead of bars
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }

        try {
          const zonesResponse = await fetch("http://127.0.0.1:8000/api/v1/getAllZones");
      
          if (!zonesResponse.ok) {
            throw new Error("Failed to fetch data");
          }
      
          const zonesData: { zones: Zone[] } = await zonesResponse.json();
      
          setZoneList(zonesData.zones);
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }

        try {
            const restaurantsResponse = await fetch("http://127.0.0.1:8000/api/v1/getAllRestaurants");
        
            if (!restaurantsResponse.ok) {
              throw new Error("Failed to fetch data");
            }
        
            const restaurantsData: { restaurants: Restaurant[] } = await restaurantsResponse.json();
        
            setRestaurantList(restaurantsData.restaurants);
            setLoading(false);
          } catch (err: any) {
            setError(err.message);
            setLoading(false);
          }
      };
    fetchData();
  }, []);

  return (
    <div>
      {/* ปุ่มเปิด Modal */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-green-400 hover:bg-green-300 duration-300 text-white rounded"
      >
        Edit Tab
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
                        ? "border-green-400 text-green-400"
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
                        ? "border-green-400 text-green-400"
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
                        ? "border-green-400 text-green-400"
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
                  <EditBar bars={barList}></EditBar>
                </div>
              )}
              {activeTab === "zone" && (
                <div id="zone" role="tabpanel">
                  <EditZone zones={zoneList}></EditZone>
                </div>
              )}
              {activeTab === "restaurant" && (
                <div id="restaurant" role="tabpanel">
                  <EditRestaurant restaurants={restaurantList}></EditRestaurant>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTab;
